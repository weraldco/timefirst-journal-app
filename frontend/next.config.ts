import type { NextConfig } from 'next';

const backendUrl =
	process.env.BACKEND_API_URL || 'https://timefirst-backend.vercel.app';

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${backendUrl}/api/:path*`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'ftxifbtgyspqwzogeodg.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/**',
			},
		],
		dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
	},
};

export default nextConfig;
