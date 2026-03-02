'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

export default function BlogNav() {
	const { status, user } = useAuth();

	return (
		<header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white"
				>
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white">
						<span className="text-xl font-bold">T</span>
					</div>
					TimeFirst
				</Link>

				<div className="flex items-center gap-4">
					<Link
						href="/"
						className="text-sm font-medium text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
					>
						Blog
					</Link>
					{status === 'authenticated' && user ? (
						<Link
							href="/dashboard"
							className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Dashboard
						</Link>
					) : (
						<Link
							href="/login"
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
						>
							Login
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
