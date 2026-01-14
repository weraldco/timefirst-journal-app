'use client';

import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserType } from '../types';

interface AuthGuardOptions {
	redirectIfAuthenticated?: boolean;
	redirectIfNotAuthenticated?: boolean;
	redirectPath?: string;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'offline';

export function useAuthGuard({
	redirectIfAuthenticated = false,
	redirectIfNotAuthenticated = false,
	redirectPath = '/',
}: AuthGuardOptions = {}) {
	const router = useRouter();

	const [status, setStatus] = useState<AuthStatus>('loading');
	const [user, setUser] = useState<UserType | null>(null);

	useEffect(() => {
		let cancelled = false;

		const checkAuth = async () => {
			// 🔴 Network check first
			if (!navigator.onLine) {
				setStatus('offline');
				return;
			}
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
					credentials: 'include',
				});

				if (!res.ok) {
					if (!cancelled) {
						setStatus('unauthenticated');
						setUser(null);
						if (redirectIfNotAuthenticated) {
							router.replace(redirectPath);
						}
					}
					return;
				}

				const data = await res.json();

				if (!cancelled) {
					setStatus('authenticated');
					setUser(data.user);
					if (redirectIfAuthenticated) {
						router.replace(redirectPath);
					}
				}
			} catch (error) {
				setStatus('unauthenticated');
			}
		};

		checkAuth();

		return () => {
			cancelled = true;
		};
	}, [
		router,
		redirectIfAuthenticated,
		redirectIfNotAuthenticated,
		redirectPath,
	]);

	return {
		user,
		status,
		loading: status === 'loading',
	};
}
