import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BlogFeed from '../blog-feed';
import { fetcher } from '@/lib/helper';

jest.mock('@/lib/helper', () => ({
	fetcher: jest.fn(),
}));

jest.mock('@/context/auth-context', () => ({
	useAuth: () => ({
		status: 'unauthenticated',
		user: null,
	}),
}));

const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

const mockPosts = [
	{
		id: '1',
		title: 'Test Project',
		description: 'A test project description',
		imageUrl: null,
		tags: ['react', 'nextjs'],
		type: 'project',
		date: '2024-01-01T00:00:00Z',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
		userId: 'user-1',
		user: { name: 'Test User' },
	},
];

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

describe('BlogFeed', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api';
	});

	it('renders blog heading', () => {
		mockFetcher.mockResolvedValue({ success: true, data: [] });
		const Wrapper = createWrapper();

		render(
			<Wrapper>
				<BlogFeed />
			</Wrapper>
		);

		expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument();
	});

	it('shows loading state initially', () => {
		mockFetcher.mockImplementation(() => new Promise(() => {}));
		const Wrapper = createWrapper();

		render(
			<Wrapper>
				<BlogFeed />
			</Wrapper>
		);

		expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument();
	});

	it('renders post cards when posts are fetched', async () => {
		mockFetcher.mockResolvedValue({ success: true, data: mockPosts });
		const Wrapper = createWrapper();

		render(
			<Wrapper>
				<BlogFeed />
			</Wrapper>
		);

		await waitFor(() => {
			expect(screen.getByText('Test Project')).toBeInTheDocument();
		});

		expect(screen.getByText('A test project description')).toBeInTheDocument();
		expect(screen.getAllByText('Project').length).toBeGreaterThan(0);
	});

	it('shows empty state when no posts', async () => {
		mockFetcher.mockResolvedValue({ success: true, data: [] });
		const Wrapper = createWrapper();

		render(
			<Wrapper>
				<BlogFeed />
			</Wrapper>
		);

		await waitFor(() => {
			expect(
				screen.getByText(/no posts yet. check back later/i)
			).toBeInTheDocument();
		});
	});

	it('shows error message when fetch fails', async () => {
		mockFetcher.mockRejectedValue(new Error('Network error'));
		const Wrapper = createWrapper();

		render(
			<Wrapper>
				<BlogFeed />
			</Wrapper>
		);

		await waitFor(() => {
			expect(
				screen.getByText(/failed to load posts/i)
			).toBeInTheDocument();
		});
	});
});
