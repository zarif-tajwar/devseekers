/**
 * Key prefix of session object in redis
 * Structure:
 * SESSION_KEY_PREFIX:sessionId = session object string
 */
export const SESSION_KEY_PREFIX = "u_s";

/**
 * Key prefix of user's session set in redis
 * (Will be used to keep track of all sessions of a user)
 * Structure:
 * USER_SESSION_LIST_KEY_PREFIX:userId = session id set
 */
export const USER_SESSION_LIST_KEY_PREFIX = "s_u";
