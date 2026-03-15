import Link from 'next/link';
import { format } from 'date-fns';
import { memo } from 'react';
import type { Post } from '@/types';

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

interface PostCardProps {
	post: Post;
}

function PostCardComponent({ post }: PostCardProps) {
	const excerpt =
		post.description.length > 150
			? `${post.description.slice(0, 150)}...`
			: post.description;
	const typeColor = typeColors[post.type] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

	return (
		<article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
			<Link href={`/post/${post.id}`}>
				{post.imageUrl ? (
					<div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
						<img
							src={post.imageUrl}
							alt={post.title}
							className="h-full w-full object-cover"
						/>
					</div>
				) : (
					<div className="aspect-video w-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-800/10" />
				)}
				<div className="p-5">
					<span
						className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor}`}
					>
						{typeLabels[post.type] ?? post.type}
					</span>
					<h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
						{post.title}
					</h2>
					<p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
						{excerpt}
					</p>
					<div className="mt-3 flex flex-wrap gap-1">
						{post.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400"
							>
								#{tag}
							</span>
						))}
					</div>
					<p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
						{post.user?.name && <span>{post.user.name} · </span>}
						{format(new Date(post.date), 'MMM d, yyyy')}
					</p>
				</div>
			</Link>
		</article>
	);
}

const PostCard = memo(PostCardComponent);

export default PostCard;
