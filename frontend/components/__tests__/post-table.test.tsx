import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostTable from '../post-table';

function createWrapper() {
	const queryClient = new QueryClient();
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

const mockPosts = [
	{
		id: '1',
		title: 'Test Project',
		description: 'A test',
		imageUrl: null,
		tags: ['react'],
		type: 'project',
		date: '2024-01-01T00:00:00Z',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
		userId: 'user-1',
	},
];

jest.mock('@/lib/helper', () => ({
	fetcher: jest.fn(),
}));

jest.mock('@/context/auth-context', () => ({
	useAuth: () => ({ user: { id: 'user-1' } }),
}));

const originalConfirm = window.confirm;
beforeAll(() => {
	window.confirm = jest.fn(() => false);
});
afterAll(() => {
	window.confirm = originalConfirm;
});

describe('PostTable', () => {
	it('renders empty state when no posts', () => {
		const Wrapper = createWrapper();
		render(
			<Wrapper>
				<PostTable posts={[]} />
			</Wrapper>
		);
		expect(
			screen.getByText(/no posts yet. create your first post/i)
		).toBeInTheDocument();
		expect(screen.getAllByRole('button', { name: /add new post/i }).length).toBeGreaterThan(0);
	});

	it('renders table with posts', () => {
		const Wrapper = createWrapper();
		render(
			<Wrapper>
				<PostTable posts={mockPosts} />
			</Wrapper>
		);
		expect(screen.getByText('Test Project')).toBeInTheDocument();
		expect(screen.getByText('Project')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
	});

	it('opens modal when Add New Post is clicked', async () => {
		const user = userEvent.setup();
		const Wrapper = createWrapper();
		render(
			<Wrapper>
				<PostTable posts={[]} />
			</Wrapper>
		);
		await user.click(screen.getAllByRole('button', { name: /add new post/i })[0]);
		expect(screen.getByText('New Post')).toBeInTheDocument();
	});
});
