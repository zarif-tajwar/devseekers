import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthOriginService } from "../auth-origin.service";
import { OAuthCallbackResponse } from "../interfaces/oauth-callback-response.interface";
import { AuthError, AuthErrorKey } from "../errors/auth-error";

/**
 * (WIP)
 * The main purpose of this interceptor is to
 * redirect the user back to our frontend
 * incase of an auth failure
 */
@Injectable()
export class OAuthCallbackErrorsInterceptor implements NestInterceptor {
  constructor(private readonly authOriginService: AuthOriginService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context
      .switchToHttp()
      .getResponse() as OAuthCallbackResponse;

    return next.handle().pipe(
      catchError((err) => {
        if (response.origin) {
          const errorPageUrl = `${response.origin}/${
            this.authOriginService.getOriginData(response.origin).errorPageUrl
          }`;
          let errorKey: AuthErrorKey = "DEFAULT";

          if (err instanceof AuthError) {
            errorKey = err.key;
          }

          // Redirect to client error page with the error key
          response.redirect(`${errorPageUrl}?error=${errorKey}`);
        }

        // TODO: needs to be polished later
        return throwError(() => {
          return EMPTY;
        });
      }),
    );
  }
}
