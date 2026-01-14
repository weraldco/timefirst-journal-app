'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardHeader from '../components/dashboard-header';
import JournalList from '../components/journal-list';
import { useAuth } from '../context/auth-context';
import { fetcher } from '../lib/helper';
import { FetchData } from '../types';

export default function DashboardPage() {
	const { user, status, refresh } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.replace('/login'); // push user to login page
		}
	}, [status, router]);
	const { data, isLoading, error } = useQuery<FetchData>({
		queryKey: ['journals'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/journal`),
		enabled: status === 'authenticated',
	});

	if (status === 'loading') return <p>Checking authentication..</p>;

	if (status === 'unauthenticated') {
		return null;
	}

	if (isLoading) return <p>Loading...</p>;

	if (error || !data || !user)
		return <p>Failed to fetch data.. {error?.message}</p>;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<DashboardHeader user={user} />
			<JournalList journals={data.data} />
		</div>
	);
}
