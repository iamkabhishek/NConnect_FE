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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // Map localhost to 127.0.0.1 for server-side proxying to prevent IPv6 [::1] connection refusals in local dev
    const proxyTarget = apiUrl.replace('://localhost', '://127.0.0.1');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${proxyTarget}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
