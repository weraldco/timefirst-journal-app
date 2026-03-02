'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetcher } from '@/lib/helper';
import type { Post } from '@/types';
import BlogNav from '@/components/blog-nav';
import Link from 'next/link';

interface PostResponse {
	success: boolean;
	data: Post;
}

export default function PostPage() {
	const params = useParams();
	const id = params?.id as string;

	const { data, isLoading, error } = useQuery<PostResponse>({
		queryKey: ['post', id],
		queryFn: () => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`),
		enabled: !!id,
	});

	if (isLoading || !id) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<BlogNav />
				<main className="mx-auto max-w-3xl px-4 py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
				</main>
			</div>
		);
	}

	if (error || !data?.data) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<BlogNav />
				<main className="mx-auto max-w-3xl px-4 py-12">
					<p className="text-red-600 dark:text-red-400">Post not found.</p>
					<Link href="/" className="mt-4 inline-block text-indigo-600 hover:underline">
						Back to Blog
					</Link>
				</main>
			</div>
		);
	}

	const post = data.data;
	const typeColors: Record<string, string> = {
		project: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
		code_kata: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
		achievement: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
	};
	const typeLabels: Record<string, string> = {
		project: 'Project',
		code_kata: 'Code Kata',
		achievement: 'Achievement',
	};
	const typeColor = typeColors[post.type] ?? 'bg-gray-100 text-gray-800';

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<BlogNav />
			<main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
				>
					← Back to Blog
				</Link>
				<article>
					<span
						className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor}`}
					>
						{typeLabels[post.type] ?? post.type}
					</span>
					<h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
						{post.title}
					</h1>
					<p className="mt-2 text-gray-500 dark:text-gray-400">
						{post.user?.name && <span>{post.user.name}</span>}
						<span className="mx-2">·</span>
						{format(new Date(post.date), 'MMMM d, yyyy')}
					</p>
					{post.imageUrl && (
						<div className="mt-6 overflow-hidden rounded-xl">
							<img
								src={post.imageUrl}
								alt={post.title}
								className="h-auto w-full object-cover"
							/>
						</div>
					)}
					<div className="mt-6 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
						{post.description}
					</div>
					{post.tags.length > 0 && (
						<div className="mt-6 flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-400"
								>
									#{tag}
								</span>
							))}
						</div>
					)}
				</article>
			</main>
		</div>
	);
}
