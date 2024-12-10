import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthOriginService } from "../auth-origin.service";
import { Request } from "express";

/**
 * Origin Guard only allows non-GET request(EX: POST,PUT,DELETE etc.) from an allowed origin,
 * otherwise returns forbidden 403 status.
 *
 * **Its main purpose is to mitigate CSRF attacks**
 */
@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly originService: AuthOriginService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;

    // Allow if its a GET request
    if (req.method === "GET") return true;

    const origin = req.headers.origin;

    // Disallow if no origin was found in headers
    if (!origin) return false;

    // Check if the request origin is allowed
    return this.originService.validateOrigin(origin);
  }
}
