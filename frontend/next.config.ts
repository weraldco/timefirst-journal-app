import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
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
