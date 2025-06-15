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
  // Required for Socket.io integration
  webpack: (config) => {
    config.externals.push({
      bufferutil: "bufferutil",
      "utf-8-validate": "utf-8-validate",
    });
    return config;
  },
};

export default nextConfig;
