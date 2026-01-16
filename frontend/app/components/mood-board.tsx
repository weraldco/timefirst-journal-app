'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../context/auth-context';
import { fetcher } from '../lib/helper';

type moodDataT = {
	id: string;
	mood: MoodT;
	createdAt: string;
};
type ResponseData = {
	success: boolean;
	data: moodDataT[];
};

type MoodT = 'happy' | 'sad' | 'angry' | 'calm' | 'null';

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
		happy: '#FFD93D',
		sad: '#4D96FF',
		angry: '#FF6B6B',
		calm: '#6BCF63',
		null: '#E0E0E0',
	};
	return (
		<div className="flex flex-row gap-3 max-w-5xl items-center justify-center">
			<div className=" flex flex-row gap-1 max-w-3xl w-full flex-wrap items-center justify-center">
				{moodBoardData.map((d, i) => (
					<div
						key={i}
						style={{
							backgroundColor: moodColor[d.mood],
						}}
						className={` px-2 py-2 text-xs  rounded-full`}
					></div>
				))}
			</div>
		</div>
	);
};

export default MoodBoard;
