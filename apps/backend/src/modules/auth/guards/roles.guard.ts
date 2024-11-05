import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import { RequestWithUser } from "../interfaces/request-with-user.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest() as RequestWithUser;
    const user = request.user;

    return roles.some((role) => !!user.roles?.includes(role));
  }
}
