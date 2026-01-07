'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import JournalItem from '../components/JournalItem';
import JournalViewModal from '../components/JournalViewModal';
import JournalFormModal from '../components/JournalFormModal';
import { Journal, JournalFormData } from '../types';
import { getMockJournalsByUserId } from '../lib/mockData';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      loadJournals();
    }
  }, [user, isAuthenticated, router]);

  useEffect(() => {
    filterJournals();
  }, [journals, searchQuery, selectedMood]);

  const loadJournals = async () => {
    if (!user) return;
    try {
      const userJournals = await getMockJournalsByUserId(user.id);
      setJournals(userJournals);
    } catch (error) {
      console.error('Error loading journals:', error);
    }
  };

  const filterJournals = () => {
    let filtered = journals;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (journal) =>
          journal.title.toLowerCase().includes(query) ||
          journal.content.toLowerCase().includes(query) ||
          journal.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by mood
    if (selectedMood !== 'all') {
      filtered = filtered.filter(
        (journal) => journal.mood.toLowerCase() === selectedMood.toLowerCase()
      );
    }

    setFilteredJournals(filtered);
  };

  const handleViewJournal = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsViewModalOpen(true);
  };

  const handleEditJournal = (journal: Journal) => {
    setEditingJournal(journal);
    setIsFormModalOpen(true);
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(journals.filter((journal) => journal.id !== id));
  };

  const handleSaveJournal = (data: JournalFormData) => {
    if (editingJournal) {
      // Update existing journal
      setJournals(
        journals.map((journal) =>
          journal.id === editingJournal.id
            ? {
                ...journal,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : journal
        )
      );
      setEditingJournal(null);
    } else {
      // Create new journal
      const newJournal: Journal = {
        id: Date.now().toString(),
        ...data,
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setJournals([newJournal, ...journals]);
    }
    setIsFormModalOpen(false);
  };

  const handleNewJournal = () => {
    setEditingJournal(null);
    setIsFormModalOpen(true);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const uniqueMoods = Array.from(new Set(journals.map((j) => j.mood)));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journals..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
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

            <div className="relative">
              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
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
                ? "No journals yet. Create your first journal entry!"
                : "No journals match your search or filter criteria."}
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

      {isFormModalOpen && (
        <JournalFormModal
          journal={editingJournal}
          onSave={handleSaveJournal}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingJournal(null);
          }}
        />
      )}
    </div>
  );
}

