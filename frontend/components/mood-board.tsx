'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { fetcher } from '../lib/helper';
import { MoodT } from '../types';

type moodDataT = {
	id: string;
	mood: MoodT;
	createdAt: string;
};
type ResponseData = {
	success: boolean;
	data: moodDataT[];
};

interface MoodDataType {
	date: string;
	mood: MoodT;
}

const MoodBoard = () => {
	const { user, status, refresh } = useAuth();
	const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

	const getTotalDaysOfTheYear = (year: number) => {
		return new Date(year, 11, 31).getDate() == 31
			? new Date(year, 1, 29).getMonth() === 1
				? 366
				: 365
			: 365;
	};
	const { data, isLoading, error } = useQuery<ResponseData>({
		queryKey: ['mood-data'],
		queryFn: () =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/journal/mood`, {
				method: 'POST',
				body: JSON.stringify({ year: currentYear }),
			}),
		enabled: status === 'authenticated',
	});
	if (!data) return;

	// Create a moodMap
	const moodMap = data.data.reduce<Record<string, MoodT>>((acc, curr) => {
		const day = new Date(curr.createdAt).toISOString().split('T')[0];

		acc[day] = curr.mood;

		return acc;
	}, {});

	const daysOfYear = getTotalDaysOfTheYear(currentYear);

	// Create a board of the whole year with empty data.
	const yearBoard = Array.from({ length: daysOfYear }, (_, i) => {
		const date = new Date(currentYear, 0, i + 1).toISOString().split('T')[0];
		return { date, mood: null };
	});

	const moodBoardData: MoodDataType[] = yearBoard.map((day) => ({
		date: day.date,
		mood: moodMap[day.date] ?? 'null',
	}));

	const moodColor = {
		happy: '#64d971',
		calm: '#ffa805',
		productive: '#40cae6',
		tired: '#f0465c',
		stressed: '#ae46f0',
		relaxed: '#494fc9',
		null: '#707070',
	};
	return (
		<div className="flex flex-row w-full items-center justify-center ">
			<div className=" flex flex-row gap-1 max-w-md md:max-w-xl w-full flex-wrap items-center justify-center">
				{moodBoardData.map((d, i) => (
					<div
						key={i}
						style={{
							backgroundColor: moodColor[d.mood],
						}}
						className={`w-2.5 h-2.5	 text-xs  rounded-full`}
					></div>
				))}
			</div>
		</div>
	);
};

export default MoodBoard;
