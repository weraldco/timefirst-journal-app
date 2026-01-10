'use client';

import { Journal } from '../types';
import { format } from 'date-fns';

interface JournalItemProps {
  journal: Journal;
  onView: (journal: Journal) => void;
  onEdit: (journal: Journal) => void;
  onDelete: (id: string) => void;
}

const moodColors: Record<string, string> = {
  happy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  calm: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  productive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  tired: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  stressed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  relaxed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function JournalItem({
  journal,
  onView,
  onEdit,
  onDelete,
}: JournalItemProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch {
      return dateString;
    }
  };

  const moodColor =
    moodColors[journal.mood.toLowerCase()] ||
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  return (
    <div
      onClick={() => onView(journal)}
      className="group relative cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(journal);
          }}
          className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
          aria-label="Edit journal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Are you sure you want to delete this journal?')) {
              onDelete(journal.id);
            }
          }}
          className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
          aria-label="Delete journal"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Title */}
      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
        {journal.title}
      </h3>

      {/* Date and Time - Mood */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(journal.createdAt)}
        </p>
        <span className="text-gray-400">-</span>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${moodColor}`}
        >
          {journal.mood}
        </span>
      </div>

      {/* Short Description */}
      <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
        {journal.content}
      </p>

      {/* Tags */}
      {journal.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {journal.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
          {journal.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{journal.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

