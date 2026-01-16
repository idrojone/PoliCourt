Comandos para FastAPI
======================

Crear un entorno virtual
```python
python -m venv venv
```

Activar el entorno virtual
- En Windows:
```python
.venv\Scripts\activate
```
- En macOS/Linux:
```python
source .venv/bin/activate
```

Instalar fastapi
```python
pip install "fastapi[standard]"
```

Instalar dependencias
```python
python -m pip install -r requirements.txt 
```

Ejecutar la aplicación FastAPI
```python
python main.py
```

Crear las tablas en la base de datos (si no existen):
```python
python src/create_tables.py
```

> 💡 Nota: Asegúrate de que PostgreSQL esté corriendo y accesible en `POSTGRES_HOST:POSTGRES_PORT` (por defecto `localhost:5432`).

CLEAN Architecture con FastAPI
users_service/
├── app/
│   ├── main.py
│   ├── api/                 # Controllers / Routers (UI Layer)
│   │   └── v1/
│   │       ├── routes.py
│   │       └── dependencies.py
│   ├── application/
│   │   └── services/
│   │       ├── create_user.py
│   │       ├── authenticate_user.py
│   │       └── update_user.py
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.py
│   │   └── exceptions.py
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── user_repository.py
│   │   ├── database.py
│   │   └── security.py
│   ├── schemas/             # Pydantic DTOs
│   │   ├── user_create.py
│   │   ├── user_update.py
│   │   └── user_response.py
│   └── config.py
├── alembic/
└── req