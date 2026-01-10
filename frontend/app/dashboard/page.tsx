'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardHeader from '../components/dashboard-header';
import JournalList from '../components/journal-list';
import { useAuthGuard } from '../hook/use-auth-guard';
import { fetcher } from '../lib/helper';
import { FetchData } from '../types';

export default function DashboardPage() {
	const { status, user } = useAuthGuard({
		redirectIfNotAuthenticated: true,
		redirectPath: '/login',
	});

	const { data, isLoading, error } = useQuery<FetchData>({
		queryKey: ['journals'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/journal`),
	});

	if (status == 'loading') {
		return <>Loading...</>;
	}
	if (status !== 'authenticated' || !user) {
		return null;
	}
	if (!data) return;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<DashboardHeader user={user} />
			<JournalList journals={data.data} />
		</div>
	);
}
