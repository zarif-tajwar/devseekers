import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleOAuthController } from "./google-oauth.controller";
import { GoogleOAuthService } from "./google-oauth.service";
import { AuthOriginService } from "./auth-origin.service";
import { AccountService } from "./account.service";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [AuthController, GoogleOAuthController],
  providers: [
    AuthService,
    GoogleOAuthService,
    AuthOriginService,
    AccountService,
  ],
  imports: [UserModule],
})
export class AuthModule {}
