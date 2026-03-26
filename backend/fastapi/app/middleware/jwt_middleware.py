import jwt
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from datetime import datetime, timezone

from app.config import settings
from app.infrastructure.database import SessionLocal
from app.infrastructure.repository.user_repository import UserRepository


class JWTMiddleware(BaseHTTPMiddleware):
    """
    Middleware que valida el token JWT en todas las rutas.
    - Si la petición NO lleva Bearer token, deja pasar la petición sin autenticación.
    - Si lleva Bearer token y es válido (firma, expiración, sessionVersion), 
      añade los datos del usuario al request.state.
    - Si lleva Bearer token y es inválido, devuelve 401 Unauthorized.
    """

    async def dispatch(self, request: Request, call_next):
        # Permite pasar el preflight CORS sin autenticacion.
        if request.method == "OPTIONS":
            request.state.user = None
            return await call_next(request)

        auth_header = request.headers.get("Authorization")

        # Sin header Authorization → dejar pasar sin autenticación
        if not auth_header:
            request.state.user = None
            return await call_next(request)

        # Si tiene header pero no empieza con "Bearer " → dejar pasar sin autenticación
        if not auth_header.startswith("Bearer "):
            request.state.user = None
            return await call_next(request)

        token = auth_header[7:]  # Quitar "Bearer "

        try:
            # Decodificar el token con HS256 (mismo algoritmo que el servidor Java)
            payload = jwt.decode(
                token,
                settings.JWT_SECRET,
                algorithms=["HS256"],
                options={"require": ["exp", "sub", "iat"]}
            )

            user_id = payload.get("userId")
            session_version = payload.get("sessionVersion")

            if user_id is None or session_version is None:
                return self._unauthorized("Token inválido: faltan claims requeridos")

            # Verificar sessionVersion contra la base de datos
            db = SessionLocal()
            try:
                repo = UserRepository(db)
                user = repo.get_by_id(int(user_id))

                if user is None:
                    return self._unauthorized("Usuario no encontrado")

                if user.session_version != session_version:
                    return self._unauthorized("Sesión invalidada. Inicia sesión de nuevo")

            finally:
                db.close()

            # Token válido → inyectar datos del usuario en el request
            request.state.user = {
                "userId": user_id,
                "email": payload.get("sub"),
                "role": payload.get("role"),
                "sessionVersion": session_version
            }

        except jwt.ExpiredSignatureError:
            return self._unauthorized("Token expirado")
        except jwt.InvalidTokenError as e:
            return self._unauthorized(f"Token inválido: {str(e)}")

        return await call_next(request)

    @staticmethod
    def _unauthorized(message: str) -> JSONResponse:
        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": message,
                "data": None,
                "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
            }
        )
