import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
let apiOrigin = "http://localhost:5000";
let apiRemotePattern: {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: string;
} | null = null;

try {
  const parsed = new URL(apiUrl);
  apiOrigin = parsed.origin;
  if (parsed.hostname !== "localhost" || parsed.port !== "5000") {
    apiRemotePattern = {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: "/uploads/**",
    };
  }
} catch {
  // Fallback to localhost origin when NEXT_PUBLIC_API_URL is not a valid URL
}

const imgSources = Array.from(
  new Set(["http://localhost:5000", apiOrigin, "https://res.cloudinary.com"])
).join(" ");

const connectSources = Array.from(
  new Set([
    "http://localhost:5000",
    apiOrigin,
    "https://app.sandbox.midtrans.com",
    "https://app.midtrans.com",
  ])
).join(" ");

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://app.sandbox.midtrans.com
    https://app.midtrans.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: ${imgSources};
  font-src 'self' data:;
  connect-src 'self' ${connectSources};
  frame-src
    https://app.sandbox.midtrans.com
    https://app.midtrans.com;
`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      ...(apiRemotePattern ? [apiRemotePattern] : []),
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;