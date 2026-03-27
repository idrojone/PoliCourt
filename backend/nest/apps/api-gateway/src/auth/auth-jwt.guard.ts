import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuardJwt implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization || request.headers?.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Authorization header missing or malformed");
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new UnauthorizedException("JWT secret not configured");
    }

    try {
      const payload = jwt.verify(token, secret) as { sub?: string; [key: string]: any };

      if (!payload || !payload.sub) {
        throw new UnauthorizedException("Token payload missing sub");
      }

      request.user = { email: payload.sub };

      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}