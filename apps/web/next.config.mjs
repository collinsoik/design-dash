/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@design-dash/shared"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
