export const AUTH_ERROR_MAPS = {
  RESTART: {
    key: "RESTART",
    message: "Please try logging in or registering again.",
  },
  DEFAULT: {
    key: "DEFAULT",
    message: "Something went wrong! Please try again or contact support.",
  },
  OAUTH_UNVERIFIED_EMAIL: {
    key: "OAUTH_UNVERIFIED_EMAIL",
    message:
      "Please verify your email inside the sign-in provider you used, then try again.",
  },
  SAME_EMAIL_DIFFERENT_PROVIDER: {
    key: "SAME_EMAIL_DIFFERENT_PROVIDER",
    message:
      "The email linked to your sign-in provider is already associated with a different account in our system. Please sign in with that account instead.",
  },
};
