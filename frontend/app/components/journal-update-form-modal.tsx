'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { fetcher } from '../lib/helper';
import { queryClient } from '../lib/react-query';
import { JournalFormData, journalSchema } from '../lib/schemas';
import { Journal } from '../types';

interface JournalUpdateFormModalProps {
	journal?: Journal | null;
	onUpdate: (data: JournalFormData) => void;
	onClose: () => void;
}

const moods = ['happy', 'calm', 'productive', 'tired', 'stressed', 'relaxed'];
const availableTags = [
	'morning',
	'evening',
	'work',
	'personal',
	'reflection',
	'gratitude',
	'coding',
	'learning',
	'health',
	'family',
	'weekend',
	'plans',
];

export default function JournalUpdateFormModal({
	journal,
	onUpdate,
	onClose,
}: JournalUpdateFormModalProps) {
	const [selectedTags, setSelectedTags] = useState<string[]>(
		journal?.tags || []
	);
	const [customTag, setCustomTag] = useState('');

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
		watch,
	} = useForm<JournalFormData>({
		resolver: zodResolver(journalSchema),
		defaultValues: {
			title: '',
			content: '',
			mood: '',
			tags: [],
		},
	});

	useEffect(() => {
		if (journal) {
			reset({
				title: journal.title,
				content: journal.content,
				mood: journal.mood,
				tags: journal.tags ?? [],
			});
		}
	}, [journal, reset]);

	const updateJournalMutation = useMutation({
		mutationFn: (journal: Partial<Journal>) =>
			fetcher<Journal>(
				`${process.env.NEXT_PUBLIC_API_URL}/journal/${journal.id}`,
				{
					method: 'PUT',
					body: JSON.stringify(journal),
				}
			),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['journals'] });
		},
	});

	const currentMood = watch('mood');

	const toggleTag = (tag: string) => {
		const newTags = selectedTags.includes(tag)
			? selectedTags.filter((t) => t !== tag)
			: [...selectedTags, tag];
		setSelectedTags(newTags);
		setValue('tags', newTags);
	};

	const addCustomTag = () => {
		if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
			const newTags = [...selectedTags, customTag.trim()];
			setSelectedTags(newTags);
			setValue('tags', newTags);
			setCustomTag('');
		}
	};

	const onSubmit = async (data: JournalFormData) => {
		try {
			updateJournalMutation.mutate(data);
			onClose();
		} catch (err) {
			toast.error('Error submitting new journal!');
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
			onClick={onClose}
		>
			<div
				className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="border-b border-gray-200 p-6 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
							{journal ? 'Edit Journal' : 'New Journal Entry'}
						</h2>
						<button
							onClick={onClose}
							className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
							aria-label="Close modal"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
					<div>
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Title *
						</label>
						<input
							{...register('title')}
							type="text"
							id="title"
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							placeholder="Enter journal title"
						/>
						{errors.title && (
							<p className="mt-1 text-sm text-red-600">
								{errors.title.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="content"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Content *
						</label>
						<textarea
							{...register('content')}
							id="content"
							rows={6}
							className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							placeholder="Write your thoughts..."
						/>
						{errors.content && (
							<p className="mt-1 text-sm text-red-600">
								{errors.content.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor="mood"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Mood *
						</label>
						<div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
							{moods.map((mood) => (
								<button
									key={mood}
									type="button"
									onClick={() => setValue('mood', mood)}
									className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
										currentMood === mood
											? 'bg-indigo-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
									}`}
								>
									{mood}
								</button>
							))}
						</div>
						<input type="hidden" {...register('mood')} />
						{errors.mood && (
							<p className="mt-1 text-sm text-red-600">{errors.mood.message}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							Tags
						</label>
						<div className="mb-3 flex flex-wrap gap-2">
							{availableTags.map((tag) => (
								<button
									key={tag}
									type="button"
									onClick={() => toggleTag(tag)}
									className={`rounded-full px-3 py-1 text-sm transition-colors ${
										selectedTags.includes(tag)
											? 'bg-indigo-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
									}`}
								>
									#{tag}
								</button>
							))}
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={customTag}
								onChange={(e) => setCustomTag(e.target.value)}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										addCustomTag();
									}
								}}
								className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
								placeholder="Add custom tag"
							/>
							<button
								type="button"
								onClick={addCustomTag}
								className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							>
								Add
							</button>
						</div>
						{selectedTags.length > 0 && (
							<div className="mt-3 flex flex-wrap gap-2">
								{selectedTags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
									>
										#{tag}
										<button
											type="button"
											onClick={() => {
												const newTags = selectedTags.filter(
													(_, i) => i !== index
												);
												setSelectedTags(newTags);
												setValue('tags', newTags);
											}}
											className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					<div className="flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
						>
							{journal ? 'Update' : 'Create'} Journal
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
