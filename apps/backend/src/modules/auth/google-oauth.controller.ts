import { getEnvValue } from "@/config/env.config";
import { ZodPipe } from "@/config/zod-filter.config";
import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CookieOptions, Request, Response } from "express";
import { AuthService } from "./auth.service";
import { getOAuthQueryDto } from "./dtos/get-oauth-query.dto";
import { googleCallbackCookiesDto } from "./dtos/google-callback-cookies.dto";
import { GoogleOAuthService } from "./google-oauth.service";
import { OAuthCallbackErrorsInterceptor } from "./interceptors/oauth-callback-errors.interceptor";
import { AuthOriginService } from "./auth-origin.service";
import { OAuthCallbackResponse } from "./interfaces/oauth-callback-response.interface";
import { AuthError } from "./errors/auth-error";

@Controller("auth/google")
export class GoogleOAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authOriginService: AuthOriginService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * This endpoint will get called from our client
   * to initiate google login flow
   */
  @Get()
  initGoogleOAuth(
    @Req() req: Request,
    @Query(new ZodPipe(getOAuthQueryDto)) query: getOAuthQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    /**
     * Validate the request origin
     */
    let origin = req.headers.origin;

    if (!origin) {
      try {
        origin = new URL(req.headers.referer || "").origin;
      } catch {
        // Will throw an error if theres no referer
        throw new ForbiddenException();
      }
    }

    if (!origin || !this.authOriginService.validateOrigin(origin)) {
      throw new ForbiddenException();
    }

    // Get the necessary data for google oauth
    const { authUrl, codeVerifier, state } =
      this.googleOAuthService.getOAuthData();

    const isProduction =
      getEnvValue(this.configService, "NODE_ENV") === "production";

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      maxAge: 10 * 60 * 1000, // 10 mins expiration time
      sameSite: "lax",
    };

    // Place necessary  cookies
    res.cookie("google_oauth_state", state, cookieOptions);
    res.cookie("google_code_verifier", codeVerifier, cookieOptions);
    // Storing the redirect url to later redirect the user back to the client
    res.cookie("redirectUrl", `${origin}${query.redirectUrl}`, cookieOptions);
    res.cookie("method", query.method, cookieOptions);

    // Redirecting to google sign in flow
    res.redirect(authUrl.toString());
  }

  /**
   * Google will call this endpoint automatically,
   * passing the necessary properties in the query parameters.
   */
  @UseInterceptors(OAuthCallbackErrorsInterceptor)
  @Get("callback")
  async validateGoogleOAuthCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    /**
     * Validate original client's origin / redirect url
     */
    const parsedOrigin = googleCallbackCookiesDto
      .pick({ redirectUrl: true })
      .safeParse(req.cookies);

    if (!parsedOrigin.success) throw new ForbiddenException();

    const origin = new URL(parsedOrigin.data.redirectUrl).origin;

    if (!this.authOriginService.validateOrigin(origin))
      throw new ForbiddenException();

    // Attaching the origin and redirect url to the response object, so that interceptors can extract them later
    (res as OAuthCallbackResponse).origin = origin;
    (res as OAuthCallbackResponse).redirectUrl = parsedOrigin.data.redirectUrl;

    /**
     * Validate other cookies
     */
    const cookieParser = googleCallbackCookiesDto
      .omit({ redirectUrl: true })
      .safeParse(req.cookies);

    if (cookieParser.error) {
      throw new AuthError("RESTART");
    }

    const cookies = cookieParser.data;

    const storedState = cookies.google_oauth_state;
    const codeVerifier = cookies.google_code_verifier;

    /**
     * Validate query params
     */
    const code = req.query.code;
    const state = req.query.state;

    if (typeof code !== "string" || typeof state !== "string") {
      throw new AuthError("RESTART");
    }

    if (state !== storedState) {
      throw new AuthError("RESTART");
    }

    // Initiate authentication
    const { sessionToken, expiresAt } =
      await this.googleOAuthService.authenticate({
        code,
        codeVerifier,
        authMode: cookies.method,
      });

    // Create session cookie
    res.cookie("session", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(expiresAt),
      secure: getEnvValue(this.configService, "NODE_ENV") === "production",
    });

    // Redirect the user back to the client
    res.redirect(parsedOrigin.data.redirectUrl);
  }
}
