/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reqres.in",
        pathname: "/img/faces/**",
      },
      {
        protocol: "https",
        hostname: "tsymxyztopbyygowwmpm.supabase.co",
        pathname: "/storage/v1/object/public/**", // ← مسیر عمومی فایل‌ها در Supabase
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
