/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@freelancex/ui', '@freelancex/db', '@freelancex/trpc', '@freelancex/three-scenes', '@freelancex/utils'],

};

module.exports = nextConfig;
