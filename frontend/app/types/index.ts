export interface User {
  id: string;
  name: string;
  email: string;
}

export interface FetchData {
  success:boolean;
  data:Journal[]
}
export interface Journal {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalFormData {
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

