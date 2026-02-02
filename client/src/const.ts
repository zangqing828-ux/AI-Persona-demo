export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Environment variable configuration
const config = {
  oauthPortalUrl: import.meta.env.VITE_OAUTH_PORTAL_URL || "",
  appId: import.meta.env.VITE_APP_ID || "",
  analyticsEndpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT || "",
  analyticsWebsiteId: import.meta.env.VITE_ANALYTICS_WEBSITE_ID || "",
};

/**
 * Validates that all required environment variables are set
 * @throws Error if required variables are missing
 */
export function validateEnvConfig(): void {
  const errors: string[] = [];

  // OAuth is optional - only validate if partially configured
  if (
    (config.oauthPortalUrl && !config.appId) ||
    (!config.oauthPortalUrl && config.appId)
  ) {
    errors.push(
      "VITE_OAUTH_PORTAL_URL and VITE_APP_ID must both be set or both be empty"
    );
  }

  if (errors.length > 0) {
    throw new Error(`Environment configuration error:\n${errors.join("\n")}`);
  }
}

/**
 * Check if OAuth authentication is configured
 */
export function isAuthConfigured(): boolean {
  return !!(config.oauthPortalUrl && config.appId);
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  if (!isAuthConfigured()) {
    throw new Error(
      "Authentication is not configured. Please set VITE_OAUTH_PORTAL_URL and VITE_APP_ID environment variables."
    );
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${config.oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", config.appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

/**
 * Get analytics configuration
 */
export function getAnalyticsConfig() {
  return {
    endpoint: config.analyticsEndpoint,
    websiteId: config.analyticsWebsiteId,
    isEnabled: !!(config.analyticsEndpoint && config.analyticsWebsiteId),
  };
}
