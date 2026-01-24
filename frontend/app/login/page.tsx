'use client';

import { useAuth } from '@/context/auth-context';
import { LoginFormData, loginSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LoginPage() {
	const router = useRouter();
	const { user, status, refresh } = useAuth();
	const [error, setError] = useState<string>('');

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	useEffect(() => {
		if (status === 'authenticated' && user) {
			router.replace('/dashboard');
		}
	}, [status, user, router]);

	const onSubmit = async (value: LoginFormData) => {
		setError('');
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({
						email: value.email,
						password: value.password,
					}),
				},
			);
			const data = await res.json();
			if (!res.ok) {
				toast.error('Login Error', { description: data.error });
				return;
			}
			await refresh();
			toast.success('Success!', { description: 'Successfully logged in!' });
		} catch (err) {
			toast.error('Error', { description: `Something went wrong! ${err}` });
		}
	};

	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'authenticated' && user) return null;
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Welcome Back
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						Sign in to your account
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Email
						</label>
						<input
							{...register('email')}
							type="email"
							id="email"
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							placeholder="Enter your email"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Password
						</label>
						<input
							{...register('password')}
							type="password"
							id="password"
							className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							placeholder="Enter your password"
						/>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600">
								{errors.password.message}
							</p>
						)}
					</div>

					{error && (
						<div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isSubmitting ? 'Signing in...' : 'Sign In'}
					</button>
				</form>
			</div>
		</div>
	);
}
