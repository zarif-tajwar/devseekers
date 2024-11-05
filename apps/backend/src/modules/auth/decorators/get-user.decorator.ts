import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestWithUser } from "../interfaces/request-with-user.interface";

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestWithUser;
    return request.user;
  },
);
