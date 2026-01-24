'use client';

import { getDailyQuoteFromStorage, getToday } from '@/lib/helper';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const Page = () => {
	const fetchQuote = async () => {
		console.log('Fetching data..');
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote`);
		if (!res.ok) throw new Error('Failed to fetch');
		const data = await res.json();
		return data;
	};

	const { data: quote } = useQuery({
		queryKey: ['daily-quote'],
		queryFn: fetchQuote,

		// Use stored quote if it exists
		initialData: getDailyQuoteFromStorage,

		// Cache until end of the day
		staleTime: 1000 * 60 * 60 * 24,
	});

	useEffect(() => {
		if (!quote) return;
		localStorage.setItem(
			'daily-quote',
			JSON.stringify({
				date: getToday(),
				quote,
			}),
		);
	}, [quote]);

	if (!quote) {
		return <p>Loading..</p>;
	}
	return (
		<div className="flex w-full bg-red-50 items-center justify-center">
			<div className="bg-amber-200 max-w-2xl w-full text-black flex flex-col">
				<span className="italic">{quote.text}</span>
				<span className="w-full text-right">{quote.author}</span>
			</div>
		</div>
	);
};

export default Page;
