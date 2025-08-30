import { useState, useEffect, useMemo } from 'react';
import { BookCard } from '@/components/BookCard';
import { BookModal } from '@/components/BookModal';
import { SearchFilters } from '@/components/SearchFilters';
import { StatsCards } from '@/components/StatsCards';
import { bookStorage } from '@/lib/storage';
import { Book, BookFormData, FilterOptions } from '@/lib/types';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import '../styles/components/Button.css';
import '../styles/components/EmptyState.css';

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    genre: '',
    status: 'all',
    author: '',
  });

  useEffect(() => {
    const loadedBooks = bookStorage.getBooks();
    setBooks(loadedBooks);
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = !filters.search || 
        book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        book.author.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesGenre = !filters.genre || book.genre === filters.genre;
      const matchesStatus = filters.status === 'all' || book.status === filters.status;
      const matchesAuthor = !filters.author || book.author === filters.author;

      return matchesSearch && matchesGenre && matchesStatus && matchesAuthor;
    });
  }, [books, filters]);

  const genres = useMemo(() => {
    return [...new Set(books.map(book => book.genre).filter(Boolean))].sort();
  }, [books]);

  const authors = useMemo(() => {
    return [...new Set(books.map(book => book.author).filter(Boolean))].sort();
  }, [books]);

  const handleAddBook = () => {
    setSelectedBook(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSaveBook = (bookData: BookFormData) => {
    try {
      if (modalMode === 'create') {
        const newBook = bookStorage.addBook(bookData);
        setBooks(prev => [...prev, newBook]);
        toast({
          title: "Livro adicionado!",
          description: `"${bookData.title}" foi adicionado à sua estante.`,
        });
      } else if (selectedBook) {
        const updatedBook = bookStorage.updateBook(selectedBook.id, bookData);
        if (updatedBook) {
          setBooks(prev => prev.map(book => 
            book.id === selectedBook.id ? updatedBook : book
          ));
          toast({
            title: "Livro atualizado!",
            description: `"${bookData.title}" foi atualizado com sucesso.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o livro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBook = (id: string) => {
    try {
      const success = bookStorage.deleteBook(id);
      if (success) {
        setBooks(prev => prev.filter(book => book.id !== id));
        toast({
          title: "Livro removido",
          description: "O livro foi removido da sua estante.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o livro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-gradient-page">
      <div className="container space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-float" style={{
              padding: '0.70rem',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-elevated)'
            }}>
              <BookOpen className="text-white" style={{width: '2rem', height: '2rem'}} />
            </div>
            <h1 className="text-4xl font-bold text-gradient">
              Estante Virtual
            </h1>
          </div>
          <p className="text-lg text-muted" style={{maxWidth: '42rem', margin: '0 auto'}}>
            Organize sua coleção de livros e acompanhe suas leituras.
          </p>
          <button 
            onClick={handleAddBook}
            className="btn btn--primary btn--lg"
          >
            <Plus className="icon" />
            <span>Adicionar Livro</span>
          </button>
        </div>

        <StatsCards books={books} />

        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          genres={genres}
          authors={authors}
        />

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {filteredBooks.length === 0 && filters.search ? 'Nenhum livro encontrado' : 
               filteredBooks.length === 0 ? 'Sua Estante' : 
               `${filteredBooks.length} ${filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}`}
            </h2>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <BookOpen />
              </div>
              <h3 className="empty-state__title">
                {books.length === 0 ? 'Sua estante está vazia' : 'Nenhum livro encontrado'}
              </h3>
              <p className="empty-state__description">
                {books.length === 0 
                  ? 'Adicione seu primeiro livro e comece a organizar sua biblioteca pessoal.'
                  : 'Tente ajustar os filtros para encontrar o que você está procurando.'
                }
              </p>
              {books.length === 0 && (
                <button onClick={handleAddBook} className="btn btn--outline btn--md">
                  <Plus className="icon" />
                  <span>Adicionar Primeiro Livro</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onClick={() => handleBookClick(book)}
                />
              ))}
            </div>
          )}
        </div>

        <BookModal
          book={selectedBook}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveBook}
          onDelete={handleDeleteBook}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default Index;
