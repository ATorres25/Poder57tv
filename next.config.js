/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // YouTube thumbnails (hero, videos)
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },

      // UploadThing (imágenes de noticias)
      {
        protocol: "https",
        hostname: "utfs.io",
      },

      // Placeholder (por si se usa alguno)
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

module.exports = nextConfig;
