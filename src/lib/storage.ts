import { Book, BookFormData } from './types';

const STORAGE_KEY = 'estante-virtual-books';

export const bookStorage = {
  getBooks: (): Book[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveBooks: (books: Book[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  },

  addBook: (bookData: BookFormData): Book => {
    const books = bookStorage.getBooks();
    const newBook: Book = {
      ...bookData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    books.push(newBook);
    bookStorage.saveBooks(books);
    return newBook;
  },

  updateBook: (id: string, updates: Partial<BookFormData>): Book | null => {
    const books = bookStorage.getBooks();
    const index = books.findIndex(book => book.id === id);
    
    if (index === -1) return null;
    
    books[index] = {
      ...books[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    bookStorage.saveBooks(books);
    return books[index];
  },

  deleteBook: (id: string): boolean => {
    const books = bookStorage.getBooks();
    const filteredBooks = books.filter(book => book.id !== id);
    
    if (filteredBooks.length === books.length) return false;
    
    bookStorage.saveBooks(filteredBooks);
    return true;
  },

  getBookById: (id: string): Book | null => {
    const books = bookStorage.getBooks();
    return books.find(book => book.id === id) || null;
  },
};