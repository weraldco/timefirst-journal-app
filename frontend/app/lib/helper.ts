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
