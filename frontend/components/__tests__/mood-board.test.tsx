import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MoodBoard from '../mood-board';
import { fetcher } from '@/lib/helper';

jest.mock('@/lib/helper', () => ({
	fetcher: jest.fn(),
}));

jest.mock('@/context/auth-context', () => ({
	useAuth: () => ({
		user: { id: 'user-1', email: 'test@test.com', name: 'Test User' },
		status: 'authenticated',
		refresh: jest.fn(),
	}),
}));

const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
		},
	});
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe('MoodBoard', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api';
	});

	it('fetches mood data and renders when loaded', async () => {
		mockFetcher.mockResolvedValue({
			success: true,
			data: [
				{
					id: '1',
					mood: 'happy',
					createdAt: '2024-06-15T12:00:00Z',
				},
			],
		});

		const Wrapper = createWrapper();
		render(
			<Wrapper>
				<MoodBoard />
			</Wrapper>
		);

		await waitFor(() => {
			expect(mockFetcher).toHaveBeenCalled();
			const call = mockFetcher.mock.calls[0];
			expect(call[0]).toBe(
				`${process.env.NEXT_PUBLIC_API_URL}/journal/mood`
			);
			expect(call[1]?.method).toBe('POST');
			expect(JSON.parse(call[1]?.body as string)).toHaveProperty('year');
		});

		await waitFor(
			() => {
				const container = document.querySelector('.flex-wrap');
				expect(container).toBeInTheDocument();
				expect(container?.children.length).toBeGreaterThan(0);
			},
			{ timeout: 3000 }
		);
	});
});
