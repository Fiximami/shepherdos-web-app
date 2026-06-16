import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: [
        "/dashboard",
        "/admin",
        "/profile",
        "/attendance",
        "/finance",
        "/giving",
        "/settings",
        "/feed",
        "/events",
        "/messages",
        "/notifications",
        "/members",
        "/forgot-password",
        "/reset-password",
      ],
    },
  };
}
