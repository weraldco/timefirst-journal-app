'use client';

import DashboardHeader from '@/components/dashboard-header';
import JournalList from '@/components/journal-list';
import MoodBoard from '@/components/mood-board';
import PostTable from '@/components/post-table';
import QuoteOfTheDay from '@/components/quote-of-the-day';
import { useAuth } from '@/context/auth-context';
import { fetcher } from '@/lib/helper';
import { FetchData } from '@/types';
import type { Post } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface MyPostsResponse {
	success: boolean;
	data: Post[];
}

export default function DashboardPage() {
	const { user, status } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.replace('/login');
		}
	}, [status, router]);

	const { data, isLoading, error } = useQuery<FetchData>({
		queryKey: ['journals'],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/journal`),
		enabled: status === 'authenticated',
	});

	const { data: postsData } = useQuery<MyPostsResponse>({
		queryKey: ['my-posts'],
		queryFn: () =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/post/my`),
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
			<JournalList journals={data.data} />
			<PostTable posts={postsData?.data ?? []} />
		</div>
	);
}
