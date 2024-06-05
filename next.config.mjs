/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.diplee.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "admin.diplee.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
