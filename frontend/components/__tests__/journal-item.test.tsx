import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JournalItem from '../journal-item';

const mockJournal = {
	id: 'journal-1',
	title: 'My Journal Entry',
	content: 'This is the journal content.',
	mood: 'happy' as const,
	tags: ['work', 'personal'],
	userId: 'user-1',
	createdAt: '2024-06-15T10:30:00Z',
	updatedAt: '2024-06-15T10:30:00Z',
};

describe('JournalItem', () => {
	const mockOnView = jest.fn();
	const mockOnEdit = jest.fn();
	const mockOnDelete = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		window.confirm = jest.fn().mockReturnValue(true);
	});

	it('renders journal title', () => {
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		expect(screen.getByText('My Journal Entry')).toBeInTheDocument();
	});

	it('renders journal content', () => {
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		expect(screen.getByText('This is the journal content.')).toBeInTheDocument();
	});

	it('renders mood', () => {
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		expect(screen.getByText('happy')).toBeInTheDocument();
	});

	it('renders tags', () => {
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		expect(screen.getByText('#work')).toBeInTheDocument();
		expect(screen.getByText('#personal')).toBeInTheDocument();
	});

	it('calls onView when card is clicked', async () => {
		const user = userEvent.setup();
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		await user.click(screen.getByText('My Journal Entry'));

		expect(mockOnView).toHaveBeenCalledWith(mockJournal);
	});

	it('calls onEdit when edit button is clicked', async () => {
		const user = userEvent.setup();
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		const editButton = screen.getByLabelText('Edit journal');
		await user.click(editButton);

		expect(mockOnEdit).toHaveBeenCalledWith(mockJournal);
	});

	it('calls onDelete when delete button is clicked and confirmed', async () => {
		const user = userEvent.setup();
		render(
			<JournalItem
				journal={mockJournal}
				onView={mockOnView}
				onEdit={mockOnEdit}
				onDelete={mockOnDelete}
			/>
		);

		const deleteButton = screen.getByLabelText('Delete journal');
		await user.click(deleteButton);

		expect(mockOnDelete).toHaveBeenCalledWith('journal-1');
	});
});
