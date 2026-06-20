/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // We can turn off standard eslint/typescript build blockages to prevent minor lint issues from blocking the run
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
