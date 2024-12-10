import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import { RequestWithUser } from "../interfaces/request-with-user.interface";

/**
 * **IMPORTANT:** `RolesGuard` must be used after `AuthGuard` to ensure
 *                 that the request is authenticated and has the user object
 *
 * RolesGuard restricts access to routes based on user roles.
 * It checks if the authenticated user has at least one of the required roles
 * to access a particular route.
 *
 * The guard retrieves the roles defined with the `@Roles` decorator on the route handler
 * and verifies if the user's roles include any of the specified roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    // If no roles are present allow the request
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const user = request.user;

    // Check if the user has atleast one required role
    return roles.some((role) => !!user.roles?.includes(role));
  }
}
