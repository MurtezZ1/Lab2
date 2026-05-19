import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.westcoast.co.uk",
      },
      {
        protocol: "https",
        hostname: "support.hp.com",
      },
      {
        protocol: "https",
        hostname: "www.gollo.com",
      },
      {
        protocol: "https",
        hostname: "hnsgsfp.imgix.net",
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com",
      },
      {
        protocol: "https",
        hostname: "ducttape.co.nz",
      },
      {
        protocol: "https",
        hostname: "www.bhphotovideo.com",
      },
    ],
  },
};

export default nextConfig;
