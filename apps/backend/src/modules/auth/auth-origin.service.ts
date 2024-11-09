import { getEnvValue } from "@/config/env.config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthOriginService {
  private readonly validOriginsMap: Map<
    string,
    { errorPageUrl: string; signInPageUrl: string; signUpPageUrl: string }
  >;

  constructor(configService: ConfigService) {
    const FRONTEND_URL = getEnvValue(configService, "FRONTEND_URL");
    const ADMIN_FRONTEND_URL = getEnvValue(configService, "ADMIN_FRONTEND_URL");

    this.validOriginsMap = new Map();
    this.validOriginsMap.set(FRONTEND_URL, {
      errorPageUrl: "/auth/error",
      signInPageUrl: "/login",
      signUpPageUrl: "/signup",
    });
    this.validOriginsMap.set(ADMIN_FRONTEND_URL, {
      errorPageUrl: "/auth/error",
      signInPageUrl: "/login",
      signUpPageUrl: "/signup",
    });
  }

  /**
   * Validates if the input url origin is allowed
   * @param origin the origin url
   * @returns true if the input origin is allowed
   */
  validateOrigin(origin: string): boolean {
    return this.validOriginsMap.has(origin);
  }

  /**
   * Gets the origin data
   * @param validOrigin the origin url [MUST BE VALIDATED FIRST]
   * @returns origin data
   */
  getOriginData(validOrigin: string) {
    return this.validOriginsMap.get(validOrigin)!;
  }
}
