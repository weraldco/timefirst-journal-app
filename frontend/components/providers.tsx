'use client';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/auth-context';
import { queryClient } from '../lib/react-query';

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	);
};
