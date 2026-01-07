import { Journal } from '../types';

export async function getMockJournals(): Promise<Journal[]> {
  const journalData = await import('../mockdata/journalData.json');
  return journalData.default;
}

export async function getMockJournalsByUserId(userId: string): Promise<Journal[]> {
  const journals = await getMockJournals();
  return journals.filter(journal => journal.userId === userId);
}

