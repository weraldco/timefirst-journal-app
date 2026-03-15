'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/helper';
import { queryKeys } from '@/lib/query-keys';
import type { Post } from '@/types';
import BlogNav from './blog-nav';
import PostCard from './post-card';

interface PostsResponse {
	success: boolean;
	data: Post[];
}

export default function BlogFeed() {
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useQuery<PostsResponse>({
		queryKey: queryKeys.posts,
		queryFn: () =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/post`),
		staleTime: 60 * 1000,
	});

	const posts = data?.data ?? [];
	const filteredPosts = useMemo(() => {
		const byType =
			typeFilter === 'all'
				? posts
				: posts.filter((p) => p.type === typeFilter);

		const maxPage = Math.max(1, Math.ceil(byType.length / 10));
		if (page > maxPage) setPage(maxPage);

		return byType;
	}, [posts, typeFilter, page]);

	const pageSize = 10;
	const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
	const startIndex = (page - 1) * pageSize;
	const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pageSize);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<BlogNav />

			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						Blog
					</h1>
					<select
						value={typeFilter}
						onChange={(e) => {
							setTypeFilter(e.target.value);
							setPage(1);
						}}
						className="rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
						aria-label="Filter by post type"
					>
						<option value="all">All Types</option>
						<option value="project">Project</option>
						<option value="code_kata">Code Kata</option>
						<option value="achievement">Achievement</option>
					</select>
				</div>

				{isLoading && (
					<div className="flex justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
					</div>
				)}

				{error && (
					<div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20">
						<p className="text-red-600 dark:text-red-400">
							Failed to load posts. Please try again later.
						</p>
					</div>
				)}

				{!isLoading && !error && filteredPosts.length === 0 && (
					<div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
						<p className="text-lg text-gray-500 dark:text-gray-400">
							{posts.length === 0
								? 'No posts yet. Check back later!'
								: 'No posts match the selected filter.'}
						</p>
					</div>
				)}

				{!isLoading && !error && filteredPosts.length > 0 && (
					<>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{paginatedPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>

						{totalPages > 1 && (
							<div className="mt-8 flex items-center justify-center gap-4">
								<button
									type="button"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
									className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
								>
									Previous
								</button>
								<span className="text-sm text-gray-600 dark:text-gray-300">
									Page {page} of {totalPages}
								</span>
								<button
									type="button"
									onClick={() =>
										setPage((p) => Math.min(totalPages, p + 1))
									}
									disabled={page === totalPages}
									className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	);
}
