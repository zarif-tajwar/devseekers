import { getEnvValue } from "@/config/env.config";
import { DrizzleService } from "@/database/drizzle.service";
import { UserService } from "@/modules/user/user.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  Google,
  OAuth2Tokens,
  decodeIdToken,
  generateCodeVerifier,
  generateState,
} from "@repo/esm-to-cjs/arctic";
import { AccountService } from "./account.service";
import { AuthService } from "./auth.service";
import { AuthMethod } from "./dtos/get-oauth-query.dto";
import { AuthError } from "./errors/auth-error";
import { User } from "@repo/shared-lib/types/auth/user";

type GoogleResponse = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: true;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  iat: number;
  exp: number;
};

@Injectable()
export class GoogleOAuthService {
  private readonly googleOAuth: Google;
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly drizzleService: DrizzleService,
    private readonly authService: AuthService,
  ) {
    const clientId = getEnvValue(configService, "AUTH_GOOGLE_ID");
    const clientSecret = getEnvValue(configService, "AUTH_GOOGLE_SECRET");
    const redirectURI = `${getEnvValue(configService, "BACKEND_URL")}/auth/google/callback`;

    this.googleOAuth = new Google(clientId, clientSecret, redirectURI);
  }

  /**
   * Generates oauth authorization url with necessary data
   * @returns state, codeVerifier and authUrl
   */
  getOAuthData() {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const authUrl = this.googleOAuth.createAuthorizationURL(
      state,
      codeVerifier,
      ["openid", "profile", "email"],
    );

    return { state, codeVerifier, authUrl };
  }

  /**
   * Validates google oauth props,
   * then allows users to login or register
   * @returns session token with expiry date
   */
  async authenticate({
    code,
    codeVerifier,
    authMode: _,
  }: {
    code: string;
    codeVerifier: string;
    authMode: AuthMethod;
  }) {
    let tokens: OAuth2Tokens;
    try {
      tokens = await this.googleOAuth.validateAuthorizationCode(
        code,
        codeVerifier,
      );
    } catch {
      throw new AuthError("RESTART");
    }

    const claims = decodeIdToken(tokens.idToken()) as GoogleResponse;

    const googleUserId = claims.sub;

    let targetUser: User | undefined = undefined;

    // Querying for an existing user with the target google id
    const existingUser = await this.userService.getUserByOAuthId(
      "google",
      googleUserId,
    );

    if (existingUser) {
      targetUser = existingUser;
    }
    //
    // If no user was found with the target google id
    //
    else {
      // Checking if another account has the same email (EX: github, facebook)
      const isEmailInUse = await this.accountService.checkIfEmailInUse(
        claims.email,
      );

      // TODO: needs evaluation whether we should auto link
      // different sign in provider accounts or not
      if (isEmailInUse) throw new AuthError("SAME_EMAIL_DIFFERENT_PROVIDER");

      const [firstName, lastName] = claims.name.split(" ");

      const userId = await this.drizzleService.db.transaction(async (tx) => {
        // Create a user and oauth account inside a transaction
        const userId = await this.userService.createUser(
          {
            email: claims.email,
            firstName: firstName!,
            lastName: lastName || "",
            avatarUrl: claims.picture,
          },
          tx,
        );

        await this.accountService.createOAuthAccount(
          {
            userId,
            email: claims.email,
            provider: "google",
            providerId: googleUserId,
            type: "oauth",
          },
          tx,
        );

        return userId;
      });

      targetUser = {
        id: userId,
        email: claims.email,
        avatarUrl: claims.picture,
        fullname: claims.name,
        roles: [],
        username: null,
      };
    }

    const sessionToken = this.authService.generateSessionToken();

    // create session and store it to redis db
    const session = await this.authService.createSession(
      sessionToken,
      targetUser,
    );

    return { sessionToken, expiresAt: session.expiresAt };
  }
}
