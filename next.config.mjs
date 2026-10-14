/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "res.cloudinary.com", "images.unsplash.com", "web.globallink.net.id"],
  },
};

export default nextConfig;
