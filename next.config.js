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

      // Sponsors banner (ufs.sh)
      {
        protocol: "https",
        hostname: "5y6xtj0au7.ufs.sh",
      },
    ],
  },
};

module.exports = nextConfig;
