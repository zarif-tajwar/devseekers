import { Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleOAuthController } from "./google-oauth.controller";
import { GoogleOAuthService } from "./google-oauth.service";
import { AuthOriginService } from "./auth-origin.service";
import { AccountService } from "./account.service";
import { UserModule } from "../user/user.module";
import { GithubOAuthService } from "./github-oauth.service";
import { GithubOAuthController } from "./github-oauth.controller";

@Global()
@Module({
  controllers: [AuthController, GoogleOAuthController, GithubOAuthController],
  providers: [
    AuthService,
    GoogleOAuthService,
    AuthOriginService,
    AccountService,
    GithubOAuthService,
  ],
  imports: [UserModule],
  exports: [AuthService, AuthOriginService],
})
export class AuthModule {}
