export const extractDomain = (url: string) => {
  const { hostname } = new URL(url);

  if (hostname === "localhost") {
    return hostname;
  }

  const parts = hostname.split(".");

  if (parts.length <= 2) {
    return hostname;
  }

  return parts.slice(-2).join(".");
};
