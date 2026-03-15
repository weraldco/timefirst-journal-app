'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetcher } from '@/lib/helper';
import { queryKeys } from '@/lib/query-keys';
import { queryClient } from '@/lib/react-query';
import { PostFormData } from '@/lib/schemas';
import type { Post } from '@/types';
import PostFormModal from './post-form-modal';

interface PostTableProps {
	posts: Post[];
}

const typeLabels: Record<string, string> = {
	project: 'Project',
	code_kata: 'Code Kata',
	achievement: 'Achievement',
};

export default function PostTable({ posts }: PostTableProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<Post | null>(null);

	const createMutation = useMutation({
		mutationFn: (data: PostFormData & { imageUrl?: string | null }) =>
			fetcher<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/create`, {
				method: 'POST',
				body: JSON.stringify({
					...data,
					date: typeof data.date === 'string' ? data.date : data.date,
				}),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.posts });
			queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			data,
		}: {
			id: string;
			data: PostFormData & { imageUrl?: string | null };
		}) =>
			fetcher<Post>(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
				method: 'PUT',
				body: JSON.stringify({
					...data,
					date: typeof data.date === 'string' ? data.date : data.date,
				}),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.posts });
			queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
				method: 'DELETE',
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.posts });
			queryClient.invalidateQueries({ queryKey: queryKeys.myPosts });
		},
	});

	const handleAddPost = () => {
		setEditingPost(null);
		setIsModalOpen(true);
	};

	const handleEditPost = (post: Post) => {
		setEditingPost(post);
		setIsModalOpen(true);
	};

	const handleDeletePost = (post: Post) => {
		if (window.confirm(`Delete "${post.title}"?`)) {
			deleteMutation.mutate(post.id);
		}
	};

	const handleSave = (data: PostFormData & { imageUrl?: string | null }) => {
		if (editingPost) {
			updateMutation.mutate({ id: editingPost.id, data });
		} else {
			createMutation.mutate(data);
		}
		setIsModalOpen(false);
		setEditingPost(null);
	};

	return (
		<>
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-6 flex items-center justify-between">
					<h2 className="text-xl font-bold text-gray-900 dark:text-white">
						Blog Posts
					</h2>
					<button
						onClick={handleAddPost}
						className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
					>
						+ Add New Post
					</button>
				</div>

				{posts.length === 0 ? (
					<div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
						<p className="text-lg text-gray-500 dark:text-gray-400">
							No posts yet. Create your first post!
						</p>
						<button
							onClick={handleAddPost}
							className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white hover:bg-indigo-700"
						>
							Add New Post
						</button>
					</div>
				) : (
					<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<caption className="sr-only">Blog posts management</caption>
							<thead>
								<tr>
									<th
										scope="col"
										className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Thumbnail
									</th>
									<th
										scope="col"
										className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Title
									</th>
									<th
										scope="col"
										className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Type
									</th>
									<th
										scope="col"
										className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Date
									</th>
									<th
										scope="col"
										className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Tags
									</th>
									<th
										scope="col"
										className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
									>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
								{posts.map((post) => (
									<tr key={post.id}>
										<td className="whitespace-nowrap px-4 py-3">
											{post.imageUrl ? (
												<img
													src={post.imageUrl}
													alt=""
													className="h-12 w-16 rounded object-cover"
												/>
											) : (
												<div className="flex h-12 w-16 items-center justify-center rounded bg-gray-100 text-gray-400 dark:bg-gray-700">
													—
												</div>
											)}
										</td>
										<td className="px-4 py-3">
											<span className="font-medium text-gray-900 dark:text-white">
												{post.title}
											</span>
										</td>
										<td className="px-4 py-3">
											<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
												{typeLabels[post.type] ?? post.type}
											</span>
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
											{format(new Date(post.date), 'MMM d, yyyy')}
										</td>
										<td className="px-4 py-3">
											<div className="flex flex-wrap gap-1">
												{post.tags.slice(0, 2).map((tag) => (
													<span
														key={tag}
														className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700"
													>
														#{tag}
													</span>
												))}
												{post.tags.length > 2 && (
													<span className="text-xs text-gray-500">
														+{post.tags.length - 2}
													</span>
												)}
											</div>
										</td>
										<td className="whitespace-nowrap px-4 py-3 text-right">
											<button
												onClick={() => handleEditPost(post)}
												className="mr-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
											>
												Edit
											</button>
											<button
												onClick={() => handleDeletePost(post)}
												className="text-red-600 hover:text-red-800 dark:text-red-400"
											>
												Delete
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{isModalOpen && (
				<PostFormModal
					post={editingPost}
					onSave={handleSave}
					onClose={() => {
						setIsModalOpen(false);
						setEditingPost(null);
					}}
				/>
			)}
		</>
	);
}
