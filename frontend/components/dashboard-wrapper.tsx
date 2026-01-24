'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/auth-context';

export default function DashboardWrapper() {
	const { status } = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (status === 'loading') return;
		if (status === 'unauthenticated') {
			router.replace('/login'); // push user to login page
		} else {
			router.replace('/dashboard');
		}
	}, [status, router]);
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
				<p className="text-gray-600 dark:text-gray-400">Loading...</p>
				Journal
			</div>
		</div>
	);
}
