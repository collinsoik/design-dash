/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/games/design-dash",
  transpilePackages: ["@design-dash/shared"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
