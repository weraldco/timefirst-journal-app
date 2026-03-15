import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardHeader from '../dashboard-header';

const mockLogout = jest.fn();

jest.mock('@/context/auth-context', () => ({
	useAuth: () => ({
		logout: mockLogout,
	}),
}));

jest.mock('next/link', () => {
	return function MockLink({
		children,
		href,
	}: {
		children: React.ReactNode;
		href: string;
	}) {
		return <a href={href}>{children}</a>;
	};
});

const mockUser = {
	id: 'user-1',
	email: 'john@example.com',
	name: 'John Doe',
};

describe('DashboardHeader', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders user name and email', () => {
		render(<DashboardHeader user={mockUser} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
	});

	it('renders user initials in avatar', () => {
		render(<DashboardHeader user={mockUser} />);

		expect(screen.getByText('JD')).toBeInTheDocument();
	});

	it('renders TimeFirst logo', () => {
		render(<DashboardHeader user={mockUser} />);

		expect(screen.getByText('TimeFirst')).toBeInTheDocument();
	});

	it('calls logout when Logout button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardHeader user={mockUser} />);

		const logoutButton = screen.getByRole('button', { name: /logout/i });
		await user.click(logoutButton);

		expect(mockLogout).toHaveBeenCalled();
	});
});
