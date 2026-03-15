import {
	fetcher,
	getDailyQuoteFromStorage,
	getToday,
} from '../helper';

describe('getToday', () => {
	it('returns YYYY-MM-DD format string', () => {
		const result = getToday();
		expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});
});

describe('fetcher', () => {
	const originalFetch = global.fetch;
	const originalOnLine = navigator.onLine;

	beforeEach(() => {
		Object.defineProperty(navigator, 'onLine', {
			value: true,
			writable: true,
			configurable: true,
		});
	});

	afterEach(() => {
		global.fetch = originalFetch;
		Object.defineProperty(navigator, 'onLine', {
			value: originalOnLine,
			writable: true,
			configurable: true,
		});
	});

	it('returns parsed JSON on 200', async () => {
		const data = { success: true, value: 42 };
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve(data),
		});

		const result = await fetcher<typeof data>('https://api.example.com/data');

		expect(result).toEqual(data);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://api.example.com/data',
			expect.objectContaining({
				credentials: 'include',
				headers: expect.objectContaining({
					'Content-Type': 'application/json',
				}),
			})
		);
	});

	it('throws with API error message when error is string', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 400,
			json: () => Promise.resolve({ error: 'Bad request' }),
		});

		await expect(fetcher('https://api.example.com')).rejects.toThrow(
			'Bad request'
		);
	});

	it('throws with error.message when error is object', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 500,
			json: () =>
				Promise.resolve({ error: { message: 'Server error' } }),
		});

		await expect(fetcher('https://api.example.com')).rejects.toThrow(
			'Server error'
		);
	});

	it('throws status when error format is unexpected', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 403,
			json: () => Promise.resolve({}),
		});

		await expect(fetcher('https://api.example.com')).rejects.toThrow(
			'Error: 403'
		);
	});

	it('throws No internet when navigator.onLine is false', async () => {
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			writable: true,
			configurable: true,
		});

		await expect(fetcher('https://api.example.com')).rejects.toThrow(
			'No internet connection. Please check your network.'
		);
	});

	it('throws Network error on TypeError Failed to fetch', async () => {
		global.fetch = jest.fn().mockRejectedValue(
			new TypeError('Failed to fetch')
		);

		await expect(fetcher('https://api.example.com')).rejects.toThrow(
			'Network error: Please check your internet connections.'
		);
	});

	it('sends credentials include', async () => {
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({}),
		});

		await fetcher('https://api.example.com');

		expect(global.fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ credentials: 'include' })
		);
	});
});

describe('getDailyQuoteFromStorage', () => {
	const originalLocalStorage = global.localStorage;

	beforeEach(() => {
		Object.defineProperty(global, 'localStorage', {
			value: {
				getItem: jest.fn(),
				setItem: jest.fn(),
				removeItem: jest.fn(),
				clear: jest.fn(),
				length: 0,
				key: jest.fn(),
			},
			writable: true,
			configurable: true,
		});
	});

	afterEach(() => {
		Object.defineProperty(global, 'localStorage', {
			value: originalLocalStorage,
			writable: true,
			configurable: true,
		});
	});

	it('returns undefined when no saved quote', () => {
		(global.localStorage.getItem as jest.Mock).mockReturnValue(null);

		const result = getDailyQuoteFromStorage();

		expect(result).toBeUndefined();
	});

	it('returns undefined when date does not match today', () => {
		(global.localStorage.getItem as jest.Mock).mockReturnValue(
			JSON.stringify({
				date: '2000-01-01',
				quote: { text: 'Old quote', author: 'Author' },
			})
		);

		const result = getDailyQuoteFromStorage();

		expect(result).toBeUndefined();
	});

	it('returns quote when date matches today', () => {
		const today = getToday();
		const quote = { text: 'Today quote', author: 'Author' };
		(global.localStorage.getItem as jest.Mock).mockReturnValue(
			JSON.stringify({ date: today, quote })
		);

		const result = getDailyQuoteFromStorage();

		expect(result).toEqual(quote);
	});
});
