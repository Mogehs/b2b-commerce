/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "your-other-domains.com",
      },
       {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ ADD THIS LINE
      },
    ],
  },
};

export default nextConfig;
