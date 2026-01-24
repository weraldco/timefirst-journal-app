'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FaQuoteLeft } from 'react-icons/fa6';
import { getDailyQuoteFromStorage, getToday } from '../lib/helper';

const QuoteOfTheDay = () => {
	const fetchQuote = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quote`);
		if (!res.ok) throw new Error('Failed to fetch');
		const data = await res.json();
		console.log(data);
		return data;
	};

	const { data: quote, isLoading } = useQuery({
		queryKey: ['daily-quote'],
		queryFn: fetchQuote,

		// Use stored quote if it exists
		initialData: () => {
			return getDailyQuoteFromStorage();
		},

		// Cache until end of the day
		staleTime: 1000 * 60 * 60 * 24,
	});

	console.log('data', quote);

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
	return (
		<div className="flex w-full items-center justify-center py-5">
			<div className=" max-w-md md:max-w-2xl w-full text-white flex flex-col">
				<span className="italic flex flex-row gap-2 text-sm md:text-lg">
					<FaQuoteLeft></FaQuoteLeft>
					{quote.text}
				</span>
				<span className="w-full text-right">- {quote.author}</span>
			</div>
		</div>
	);
};

export default QuoteOfTheDay;
