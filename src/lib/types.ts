export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  coverUrl: string;
  status: 'read' | 'reading' | 'want';
  description?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookFormData {
  title: string;
  author: string;
  genre: string;
  year: number;
  coverUrl: string;
  status: 'read' | 'reading' | 'want';
  description?: string;
  rating?: number;
}

export type BookStatus = 'read' | 'reading' | 'want';

export interface FilterOptions {
  search: string;
  genre: string;
  status: BookStatus | 'all';
  author: string;
}