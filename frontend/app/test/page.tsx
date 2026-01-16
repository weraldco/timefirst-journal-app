'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getDailyQuoteFromStorage, getToday } from '../lib/helper';
interface quoteType {
	text: string;
	source: string;
	tags: string[];
	author: string;
}
const Page = () => {
	const fetchQuote = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote`);

		if (!res.ok) throw new Error('Failed to fetch');
		console.log('res', res);
	};
	console.log(fetchQuote());
	const { data: quote } = useQuery({
		queryKey: ['daily-quote'],
		queryFn: fetchQuote,

		// Use stored quote if it exists
		initialData: getDailyQuoteFromStorage,

		// Cache until end of the day
		staleTime: 1000 * 60 * 60 * 24,
	});

	console.log('quote', quote);

	useEffect(() => {
		if (!quote) return;
		localStorage.setItem(
			'daily-quote',
			JSON.stringify({
				date: getToday(),
				quote,
			})
		);
	}, [quote]);
	console.log('Quote', quote);
	return (
		<div className="flex w-full bg-red-50 items-center justify-center">
			<div className="bg-amber-200 max-w-2xl w-full text-black flex flex-col">
				{/* <span className="italic">{quote.text}</span>
				<span className="w-full text-right">{quote.author}</span> */}
			</div>
		</div>
	);
};

export default Page;
