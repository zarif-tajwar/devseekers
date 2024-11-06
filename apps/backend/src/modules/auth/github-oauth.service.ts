import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { generateState, GitHub, OAuth2Tokens } from "@repo/esm-to-cjs/arctic";
import { UserService } from "../user/user.service";
import { AccountService } from "./account.service";
import { DrizzleService } from "@/database/drizzle.service";
import { AuthService } from "./auth.service";
import { getEnvValue } from "@/config/env.config";
import { AuthMethod } from "./dtos/get-oauth-query.dto";
import { AuthError } from "./errors/auth-error";
import { User } from "@repo/shared-lib/types/auth/user";

type GithubUser = {
  id: number;
  avatar_url: string;
  name: string;
};

type GithubEmailList = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: unknown;
}[];

@Injectable()
export class GithubOAuthService {
  private readonly githubOAuth: GitHub;
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly accountService: AccountService,
    private readonly drizzleService: DrizzleService,
    private readonly authService: AuthService,
  ) {
    const clientId = getEnvValue(configService, "AUTH_GITHUB_ID");
    const clientSecret = getEnvValue(configService, "AUTH_GITHUB_SECRET");
    const redirectURI = `${getEnvValue(configService, "BACKEND_URL")}/auth/github/callback`;

    this.githubOAuth = new GitHub(clientId, clientSecret, redirectURI);
  }

  /**
   * Generates oauth authorization url with necessary data
   * @returns state, and authUrl
   */
  getOAuthData() {
    const state = generateState();

    const authUrl = this.githubOAuth.createAuthorizationURL(state, [
      "user:email",
    ]);

    return { state, authUrl };
  }

  /**
   * Validates github oauth props
   * then allow users to sign in or sign up
   * @returns session token with expiry date
   */
  async authenticate({
    code,
    authMode: _,
  }: {
    code: string;
    authMode: AuthMethod;
  }) {
    let tokens: OAuth2Tokens;
    try {
      tokens = await this.githubOAuth.validateAuthorizationCode(code);
    } catch {
      throw new AuthError("RESTART");
    }
    const githubAccessToken = tokens.accessToken();

    // fetch github user object
    const userRequest = new Request("https://api.github.com/user");
    userRequest.headers.set("Authorization", `Bearer ${githubAccessToken}`);
    const userResponse = await fetch(userRequest);
    const userResult = (await userResponse.json()) as GithubUser;

    const githubUserId = userResult.id.toString();

    let targetUser: User | undefined = undefined;

    // Querying for an existing user with the target github id
    const existingUser = await this.userService.getUserByOAuthId(
      "github",
      githubUserId,
    );

    if (existingUser) {
      targetUser = existingUser;
    }
    //
    // If no user was found with the target github id
    //
    else {
      // fetch target github account's email
      const emailListRequest = new Request(
        "https://api.github.com/user/emails",
      );
      emailListRequest.headers.set(
        "Authorization",
        `Bearer ${githubAccessToken}`,
      );
      const emailListResponse = await fetch(emailListRequest);
      const emailListResult =
        (await emailListResponse.json()) as GithubEmailList;

      // Throw error if email list response doesn't contain our needed results
      if (!Array.isArray(emailListResult) || emailListResult.length === 0) {
        throw new AuthError("RESTART");
      }

      let email: string | null = null;

      // look for a primary and verified email
      for (const emailRecord of emailListResult) {
        if (emailRecord.primary && emailRecord.verified) {
          email = emailRecord.email;
          break;
        }
      }

      // Throw error if no primary or verified email was found
      if (email === null) {
        throw new AuthError("OAUTH_UNVERIFIED_EMAIL");
      }

      // Check if another account has the same email (EX: google, facebook)
      const isEmailInUse = await this.accountService.checkIfEmailInUse(email);

      // TODO: needs evaluation whether we should auto link
      // different sign in provider accounts or not
      if (isEmailInUse) throw new AuthError("SAME_EMAIL_DIFFERENT_PROVIDER");

      const [firstName, lastName] = userResult.name.split(" ");

      const userId = await this.drizzleService.db.transaction(async (tx) => {
        // Create a user and oauth account inside a transaction
        const userId = await this.userService.createUser(
          {
            email,
            firstName: firstName!,
            lastName: lastName || "",
            avatarUrl: userResult.avatar_url,
          },
          tx,
        );

        await this.accountService.createOAuthAccount(
          {
            userId,
            email,
            provider: "github",
            providerId: githubUserId,
            type: "oauth",
          },
          tx,
        );

        return userId;
      });

      targetUser = {
        id: userId,
        email: email,
        avatarUrl: userResult.avatar_url,
        fullname: userResult.name,
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
