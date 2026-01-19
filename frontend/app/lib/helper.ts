export const getToday = () => new Date().toISOString().split('T')[0];

export const fetcher = async <T>(
	url: string,
	options?: RequestInit
): Promise<T> => {
	if (!navigator.onLine) {
		throw new Error('No internet connection. Please check your network.');
	}

	try {
		const res = await fetch(url, {
			...options,
			credentials: 'include',
			headers: {
				...(options?.body instanceof FormData
					? {}
					: { 'Content-Type': 'application/json' }),
				...(options?.headers || {}),
			},
		});

		if (!res.ok) {
			let errorMessage = `Error: ${res.status}`;
			try {
				const errorData = await res.json();
				if (errorData.error) errorMessage = errorData.error;
			} catch {}
			throw new Error(errorMessage);
		}
		return res.json();
	} catch (error) {
		if (error instanceof TypeError && error.message === 'Failed to fetch!') {
			throw new Error('Network error: Please check your internet connections.');
		}
		throw error;
	}
};

export const getDailyQuoteFromStorage = () => {
	// window is a browser object that when exist, you
	// can have access to localstorage
	if (typeof window === 'undefined') return undefined;

	// get the daily-quote saved in localstorage
	const saved = localStorage.getItem('daily-quote');

	// is daily-quote not exist return undefined
	if (!saved) return undefined;

	// parse the save data
	const parsed = JSON.parse(saved);

	// check if save date equals to todays date,
	// if yes return parse quote else undefined
	return parsed.date === getToday() ? parsed.quote : undefined;
};
