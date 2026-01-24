import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext } from 'react';
import { fetcher } from '../lib/helper';
import { UserType } from '../types';

// first we make a type for our AuthContext
type AuthContextType = {
	user: UserType | null;
	status: 'loading' | 'authenticated' | 'unauthenticated';
	refresh: () => void;
	logout: () => void;
};

// Create a context
const AuthContext = createContext<AuthContextType | null>(null);
interface AuthResponse {
	user: UserType;
}
// Define the fetcher for obtaining the current user
const fetchUser = async (): Promise<UserType | null> => {
	try {
		const data = await fetcher<AuthResponse>(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/me`
		);
		return data?.user;
	} catch (error) {
		return null;
	}
};

// Define logout user fetcher
const logoutUser = async () => {
	const res: Response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,
		{
			method: 'POST',
			credentials: 'include',
		}
	);

	if (!res.ok) throw new Error('Logout failed!');

	return res;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const queryClient = useQueryClient();
	const router = useRouter();

	// Fetch user session
	const { data: user, isLoading } = useQuery({
		queryKey: ['authUser'],
		queryFn: fetchUser,
		staleTime: Infinity, // users data doesn't expire until we say no
		retry: false, //Dont retry when 401 errors
	});
	const logoutMutation = useMutation({
		mutationFn: logoutUser,
		onSuccess: () => {
			// Clear the cached
			queryClient.setQueryData(['authUser'], null);
			queryClient.clear();
			// redirect to login
			router.replace('/login');
		},
	});

	// Derive state
	const status = isLoading
		? 'loading'
		: user
		? 'authenticated'
		: 'unauthenticated';

	const refresh = useCallback(() => {
		queryClient.invalidateQueries({ queryKey: ['authUser'] });
	}, [queryClient]);
	console.log('status', status);
	return (
		<AuthContext.Provider
			value={{
				user: user || null,
				status,
				refresh,
				logout: () => logoutMutation.mutate(),
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
	return ctx;
};
