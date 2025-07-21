/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reqres.in",
        pathname: "/img/faces/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // اگر نمی‌خواهید خطاهای TypeScript در هنگام بیلد بررسی شوند
  },
};

export default nextConfig;
