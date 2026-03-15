import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import QuoteOfTheDay from '../quote-of-the-day';

const mockQuote = { text: 'Test quote text', author: 'Test Author' };

const mockFetch = jest.fn();

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

describe('QuoteOfTheDay', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080/api';
		global.fetch = mockFetch;
	});

	it('renders quote when fetched', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(mockQuote),
		});

		const Wrapper = createWrapper();
		render(
			<Wrapper>
				<QuoteOfTheDay />
			</Wrapper>
		);

		await waitFor(() => {
			expect(screen.getByText('Test quote text')).toBeInTheDocument();
		});

		expect(screen.getByText(/- Test Author/)).toBeInTheDocument();
	});

	it('renders quote from initialData when available', () => {
		const storedQuote = { text: 'Stored quote', author: 'Stored Author' };
		const today = new Date().toISOString().split('T')[0];
		jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(
			JSON.stringify({ date: today, quote: storedQuote })
		);

		const Wrapper = createWrapper();
		render(
			<Wrapper>
				<QuoteOfTheDay />
			</Wrapper>
		);

		expect(screen.getByText('Stored quote')).toBeInTheDocument();
		expect(screen.getByText(/- Stored Author/)).toBeInTheDocument();
	});
});
