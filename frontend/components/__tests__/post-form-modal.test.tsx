import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostFormModal from '../post-form-modal';

jest.mock('@/lib/upload', () => ({
	uploadPostImage: jest.fn().mockResolvedValue('https://example.com/image.png'),
}));

jest.mock('@/context/auth-context', () => ({
	useAuth: () => ({ user: { id: 'user-1' } }),
}));

describe('PostFormModal', () => {
	const mockOnSave = jest.fn();
	const mockOnClose = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders form for new post', () => {
		render(
			<PostFormModal post={null} onSave={mockOnSave} onClose={mockOnClose} />
		);

		expect(screen.getByText('New Post')).toBeInTheDocument();
		expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
		expect(screen.getByRole('combobox')).toBeInTheDocument();
		expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /create post/i })).toBeInTheDocument();
	});

	it('renders form for edit with pre-filled data', () => {
		const post = {
			id: '1',
			title: 'Existing Title',
			description: 'Existing description',
			imageUrl: null,
			tags: ['react'],
			type: 'project',
			date: '2024-01-01T00:00:00Z',
			createdAt: '2024-01-01T00:00:00Z',
			updatedAt: '2024-01-01T00:00:00Z',
			userId: 'user-1',
		};

		render(
			<PostFormModal post={post} onSave={mockOnSave} onClose={mockOnClose} />
		);

		expect(screen.getByText('Edit Post')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Existing Title')).toBeInTheDocument();
		expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
	});

	it('shows validation error when title is empty', async () => {
		const user = userEvent.setup();
		render(
			<PostFormModal post={null} onSave={mockOnSave} onClose={mockOnClose} />
		);

		const titleInput = screen.getByLabelText(/title/i);
		await user.clear(titleInput);
		await user.click(screen.getByRole('button', { name: /create post/i }));

		await waitFor(() => {
			expect(screen.getByText(/title is required/i)).toBeInTheDocument();
		});
	});

	it('calls onSave when form is valid', async () => {
		const user = userEvent.setup();
		render(
			<PostFormModal post={null} onSave={mockOnSave} onClose={mockOnClose} />
		);

		await user.type(screen.getByLabelText(/title/i), 'Test Title');
		await user.type(screen.getByLabelText(/description/i), 'Test description');
		await user.click(screen.getByRole('button', { name: /create post/i }));

		await waitFor(() => {
			expect(mockOnSave).toHaveBeenCalledWith(
				expect.objectContaining({
					title: 'Test Title',
					description: 'Test description',
					tags: expect.any(Array),
					type: 'project',
				})
			);
		});
	});
});
