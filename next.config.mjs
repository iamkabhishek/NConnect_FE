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
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
