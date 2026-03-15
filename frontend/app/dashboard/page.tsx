'use client';

import DashboardHeader from '@/components/dashboard-header';
import JournalList from '@/components/journal-list';
import MoodBoard from '@/components/mood-board';
import PostTable from '@/components/post-table';
import QuoteOfTheDay from '@/components/quote-of-the-day';
import { useAuth } from '@/context/auth-context';
import { fetcher } from '@/lib/helper';
import { queryKeys } from '@/lib/query-keys';
import { FetchData } from '@/types';
import type { Post } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface MyPostsResponse {
	success: boolean;
	data: Post[];
}

export default function DashboardPage() {
	const { user, status } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.replace('/login');
		}
	}, [status, router]);

	const { data, isLoading, error } = useQuery<FetchData>({
		queryKey: queryKeys.journals,
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/journal`),
		enabled: status === 'authenticated',
		retry: (failureCount, error) => {
			if (error?.message?.toLowerCase().includes('not authenticated')) {
				return false;
			}
			return failureCount < 2;
		},
	});

	useEffect(() => {
		if (
			error?.message?.toLowerCase().includes('not authenticated')
		) {
			queryClient.invalidateQueries({ queryKey: queryKeys.auth });
		}
	}, [error?.message, queryClient]);

	const { data: postsData } = useQuery<MyPostsResponse>({
		queryKey: queryKeys.myPosts,
		queryFn: () =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/post/my`),
		enabled: status === 'authenticated',
	});

	if (status === 'loading') return <p>Checking authentication..</p>;

	if (status === 'unauthenticated') {
		return null;
	}

	if (isLoading) return <p>Loading...</p>;

	if (error || !data || !user) {
		const isAuthError = error?.message
			?.toLowerCase()
			.includes('not authenticated');
		return (
			<div className="flex min-h-screen items-center justify-center p-4">
				<p className="text-center text-gray-600 dark:text-gray-400">
					{isAuthError
						? 'Session expired or not signed in. Redirecting to login…'
						: `Failed to fetch data. ${error?.message ?? 'Please try again.'}`}
				</p>
			</div>
		);
	}

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
