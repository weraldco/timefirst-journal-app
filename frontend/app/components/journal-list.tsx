import { useMutation } from '@tanstack/react-query';
import { Homemade_Apple } from 'next/font/google';
import { useEffect, useState } from 'react';
import { fetcher } from '../lib/helper';
import { queryClient } from '../lib/react-query';
import { JournalFormData } from '../lib/schemas';
import { Journal } from '../types';
import JournalAddFormModal from './journal-add-form-modal';
import JournalItem from './journal-item';
import JournalUpdateFormModal from './journal-update-form-modal';
import JournalViewModal from './journal-view-modal';

interface PropsType {
	journals: Journal[];
}

const JournalList = ({ journals }: PropsType) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedMood, setSelectedMood] = useState<string>('all');
	const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [isAddFormModalOpen, setIsAddFormModalOpen] = useState(false);
	const [isUpdateFormModelOpen, setIsUpdateFormModalOpen] = useState(false);
	const [editingJournal, setEditingJournal] = useState<Journal | null>(null);

	// Add mutation
	const createJournalMutation = useMutation({
		mutationFn: (newJournal: Partial<Journal>) =>
			fetcher<Journal>(`${process.env.NEXT_PUBLIC_API_URL}/journal/create`, {
				method: 'POST',
				body: JSON.stringify(newJournal),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['journals'] });
			queryClient.invalidateQueries({ queryKey: ['mood-data'] });
		},
	});

	const deleteJournalMutation = useMutation({
		mutationFn: (id: string) =>
			fetcher(`${process.env.NEXT_PUBLIC_API_URL}/journal/${id}`, {
				method: 'delete',
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['journals'] });
			queryClient.invalidateQueries({ queryKey: ['mood-data'] });
		},
	});
	const filteredJournals =
		selectedMood === 'all'
			? journals
			: journals.filter((journal) => journal.mood === selectedMood);

	const handleViewJournal = (journal: Journal) => {
		setSelectedJournal(journal);
		setIsViewModalOpen(true);
	};

	const handleEditJournal = (journal: Journal) => {
		setEditingJournal(journal);
		setIsAddFormModalOpen(true);
	};

	const handleDeleteJournal = (id: string) => {
		deleteJournalMutation.mutate(id);
	};

	const handleSaveJournal = (data: JournalFormData) => {
		createJournalMutation.mutate(data);
	};

	const handleNewJournal = () => {
		setEditingJournal(null);
		setIsAddFormModalOpen(true);
	};

	const uniqueMoods = Array.from(new Set(journals.map((j) => j.mood)));

	return (
		<>
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Search and Filter Section */}
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-1 gap-4">
						{/* Search Section */}
						<div className="relative flex-1">
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search journals..."
								className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							/>
							{/* Search Icon */}
							<svg
								className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
						{/* Filter Section */}
						<div className="relative">
							<select
								value={selectedMood}
								onChange={(e) => {
									setSelectedMood(e.target.value);
								}}
								className="appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 pr-8 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
							>
								<option value="all">All Moods</option>
								{uniqueMoods.map((mood) => (
									<option key={mood} value={mood}>
										{mood}
									</option>
								))}
							</select>
							<svg
								className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>

					<button
						onClick={handleNewJournal}
						className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-indigo-700"
					>
						+ New Journal
					</button>
				</div>

				{/* Journals List */}
				{filteredJournals.length === 0 ? (
					<div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-800">
						<p className="text-lg text-gray-500 dark:text-gray-400">
							{journals.length === 0
								? 'No journals yet. Create your first journal entry!'
								: 'No journals match your search or filter criteria.'}
						</p>
					</div>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filteredJournals.map((journal) => (
							<JournalItem
								key={journal.id}
								journal={journal}
								onView={handleViewJournal}
								onEdit={handleEditJournal}
								onDelete={handleDeleteJournal}
							/>
						))}
					</div>
				)}
			</main>
			{/* Modals */}
			{isViewModalOpen && selectedJournal && (
				<JournalViewModal
					journal={selectedJournal}
					onClose={() => {
						setIsViewModalOpen(false);
						setSelectedJournal(null);
					}}
					onEdit={handleEditJournal}
					onDelete={handleDeleteJournal}
				/>
			)}
			{isAddFormModalOpen && (
				<JournalAddFormModal
					journal={editingJournal}
					onSave={handleSaveJournal}
					onClose={() => {
						setIsAddFormModalOpen(false);
						setEditingJournal(null);
					}}
				/>
			)}

			{isUpdateFormModelOpen && (
				<JournalUpdateFormModal
					journal={editingJournal}
					onUpdate={() => {
						console.log('Udpating...');
					}}
					onClose={() => {
						setIsUpdateFormModalOpen(false);
						setEditingJournal(null);
					}}
				/>
			)}
		</>
	);
};

export default JournalList;
