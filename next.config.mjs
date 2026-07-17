/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // sermon thumbnail_url is arbitrary user-entered data (YouTube/Vimeo CDN, S3,
    // etc.) with no way to know the host ahead of time, so we allow any https host.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
