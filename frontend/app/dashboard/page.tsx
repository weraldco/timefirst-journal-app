'use client';

import DashboardHeader from '@/components/dashboard-header';
import JournalList from '@/components/journal-list';
import MoodBoard from '@/components/mood-board';
import QuoteOfTheDay from '@/components/quote-of-the-day';
import { useAuth } from '@/context/auth-context';
import { fetcher } from '@/lib/helper';
import { FetchData } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
	const { user, status } = useAuth();
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
			<QuoteOfTheDay />
			<MoodBoard />
			{/* <p className="text-3xl text-center py-5">
				Time first, pause. <br /> Do you have something in your mind? <br />
				Come here, talk to me..
			</p>
			<div className="flex items-center justify-center ">
				<button className="bg-blue-600 px-6 py-4 text-xl rounded-xl font-bold cursor-pointer">
					Add your thoughts
				</button>
			</div> */}

			<JournalList journals={data.data} />
		</div>
	);
}
