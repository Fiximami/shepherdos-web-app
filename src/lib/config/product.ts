const DEFAULT_PRODUCT_NAME = "FaithBaseOS";
const DEFAULT_TAGLINE = "Church operations, cared for well.";
const DEFAULT_APP_URL = "https://app.faithbaseos.com";

function readPublicEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function readBooleanEnv(name: string, fallback: boolean): boolean {
  const value = readPublicEnv(name);
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function getProductName(): string {
  return readPublicEnv("NEXT_PUBLIC_PRODUCT_NAME") ?? DEFAULT_PRODUCT_NAME;
}

export function getProductTagline(): string {
  return readPublicEnv("NEXT_PUBLIC_PRODUCT_TAGLINE") ?? DEFAULT_TAGLINE;
}

export function getAppUrl(): string {
  return readPublicEnv("NEXT_PUBLIC_APP_URL") ?? DEFAULT_APP_URL;
}

export function isDemoModeAllowed(): boolean {
  return readBooleanEnv("NEXT_PUBLIC_ENABLE_DEMO_MODE", process.env.NODE_ENV === "development");
}

export function isPasswordResetEnabled(): boolean {
  return readBooleanEnv("NEXT_PUBLIC_ENABLE_PASSWORD_RESET", false);
}

export function showPreviewRoutes(): boolean {
  return readBooleanEnv("NEXT_PUBLIC_SHOW_PREVIEW_ROUTES", false);
}

export function isAlphaDeployment(): boolean {
  return readBooleanEnv("NEXT_PUBLIC_ALPHA_MODE", true);
}
