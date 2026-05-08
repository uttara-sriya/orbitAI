/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    images: {
        domains: ['images.unsplash.com'],
    },
    experimental: {
        // optimizePackageImports: ['lucide-react', 'framer-motion'], // Removed if unsupported in some versions
    }
};

export default nextConfig;
