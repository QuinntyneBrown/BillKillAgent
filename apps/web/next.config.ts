import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@billkill/shared", "@billkill/api"],
};

export default nextConfig;
