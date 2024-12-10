import dayjs from "@/lib/utils/dayjs";
import { User } from "@repo/shared-lib/types/auth/user";
import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
  sha256,
} from "@repo/esm-to-cjs/oslo";
import { Redis } from "ioredis";
import {
  SESSION_KEY_PREFIX,
  USER_SESSION_LIST_KEY_PREFIX,
} from "./constants/session";
import { SessionEntity } from "./entities/session.entity";
import { ConfigService } from "@nestjs/config";
import { getEnvValue } from "@/config/env.config";

@Injectable()
export class AuthService {
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.redis = redisService.getOrThrow();
  }

  /**
   * Generates a token with 20 bytes of entropy,
   * then encodes it with base32
   * the result is a 32-character long random string
   * @returns a session token
   */
  generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
  }

  /**
   * Generates a session ID and saves it with the user's info in Redis.
   * @param sessionToken The session token string
   * @param user The user info object
   * @returns The session object
   */
  async createSession(
    sessionToken: string,
    user: User,
  ): Promise<SessionEntity> {
    // Hash the session token to store it to the db as session id
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken)),
    );

    const currentTime = Date.now();
    const expiryTimeInDays = getEnvValue(
      this.configService,
      "SESSION_EXPIRY_TIME_IN_DAYS",
    );
    const expiresAt = dayjs(currentTime).add(expiryTimeInDays, "d").valueOf();

    // The session object that will get stored in the db
    const session: SessionEntity = {
      ...user,
      userId: user.id,
      id: sessionId,
      createdAt: currentTime,
      expiresAt,
    };

    // Add the session object and session id in a redis transaction
    await this.redis
      .multi()
      .set(
        this.getRedisSessionKey(sessionId),
        JSON.stringify(session),
        "PXAT",
        session.expiresAt,
      )
      .sadd(this.getRedisUserSessionListKey(user.id), sessionId)
      .exec();

    return session;
  }

  /**
   * Validates session token,
   * extends session expiry time when its close
   * to expiration. Returns the session object with user info.
   * @param sessionToken The session token string
   * @returns The session object if valid, otherwise null
   */
  async validateSession(
    sessionToken: string,
    disableAutoExtend: boolean = false,
  ): Promise<{ session: SessionEntity; isExpiryUpdated: boolean } | null> {
    // Generate the session key to query the db
    const sessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(sessionToken)),
    );
    const sessionKey = this.getRedisSessionKey(sessionId);

    // Retrieve the session object from the db
    const sessionStr = await this.redis.get(sessionKey);
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr) as SessionEntity;

    const currentTime = Date.now();

    // Check if the session is expired
    if (dayjs(currentTime).isAfter(session.expiresAt)) {
      await this.invalidateSession(sessionId, session.userId);
      return null;
    }

    const expiryTimeInDays = getEnvValue(
      this.configService,
      "SESSION_EXPIRY_TIME_IN_DAYS",
    );
    let isExpiryUpdated = false;

    // Extend expiration time when half the time has passed
    if (
      !disableAutoExtend &&
      dayjs(currentTime).isAfter(
        dayjs(session.expiresAt).subtract(expiryTimeInDays / 2, "d"),
      )
    ) {
      session.expiresAt = dayjs(currentTime)
        .add(expiryTimeInDays, "d")
        .valueOf();

      await this.redis.set(
        sessionKey,
        JSON.stringify(session),
        "PXAT",
        session.expiresAt,
      );

      isExpiryUpdated = true;
    }

    return { session, isExpiryUpdated };
  }

  /**
   * Invalidates a session of a user
   * @param sessionId The session id
   * @param userId The user id
   */
  async invalidateSession(sessionId: string, userId: string) {
    await this.redis
      .multi()
      .del(this.getRedisSessionKey(sessionId))
      .srem(this.getRedisUserSessionListKey(userId), sessionId)
      .exec();
  }

  /**
   * Invalidate all sessions of a user
   * @param userId The user id
   */
  async invalidateSessions(userId: string) {
    // Get the key that retrieves all session ids of the target user
    const userSessionListKey = this.getRedisUserSessionListKey(userId);

    // Transform all session ids into session keys that retrieves the session object
    const targetKeys = await this.redis
      .smembers(userSessionListKey)
      .then((res) =>
        res.map((sessionId) => this.getRedisSessionKey(sessionId)),
      );

    // Return the function if theres no keys
    if (targetKeys.length === 0) return;

    // Add the session list key
    targetKeys.push(userSessionListKey);

    // Delete all the keys together
    await this.redis.del(targetKeys);
  }

  /**
   * Gets the key to retrieve and create sessions
   * @param sessionId the session id
   * @returns the target key
   */
  getRedisSessionKey(sessionId: string) {
    return `${SESSION_KEY_PREFIX}:${sessionId}`;
  }

  /**
   * Gets the key which lets us
   * retrieve all session ids of a user
   * @param userId the user id
   * @returns the target key
   */
  getRedisUserSessionListKey(userId: string) {
    return `${USER_SESSION_LIST_KEY_PREFIX}:${userId}`;
  }
}
