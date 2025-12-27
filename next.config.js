/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },

      // UploadThing (noticias)
      {
        protocol: "https",
        hostname: "utfs.io",
      },

      // Placeholder
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

module.exports = nextConfig;
