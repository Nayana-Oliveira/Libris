import { FilterOptions, BookStatus } from '@/lib/types';
import { Search, Filter, X } from 'lucide-react';
import '../styles/components/Card.css';
import '../styles/components/Input.css';
import '../styles/components/Button.css';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  genres: string[];
  authors: string[];
}

const statusOptions = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'want', label: 'Quero Ler' },
  { value: 'reading', label: 'Lendo' },
  { value: 'read', label: 'Lido' },
];

export const SearchFilters = ({ filters, onFiltersChange, genres, authors }: SearchFiltersProps) => {
  const handleClearFilters = () => {
    onFiltersChange({
      search: '',
      genre: '',
      status: 'all',
      author: '',
    });
  };

  const hasActiveFilters = filters.search || filters.genre || filters.status !== 'all' || filters.author;

  return (
    <div className="filter-card">
      <div className="filter-card__header">
        <div className="filter-card__title">
          <Filter className="icon" />
          <h3>Filtrar Livros</h3>
        </div>
        {hasActiveFilters && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleClearFilters}
          >
            <X className="icon" />
            <span>Limpar</span>
          </button>
        )}
      </div>

      <div className="filter-card__grid">
        <div className="input-container">
          <Search className="input-icon" />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="input input--with-icon"
          />
        </div>

        <select
          value={filters.author}
          onChange={(e) => onFiltersChange({ ...filters, author: e.target.value })}
          className="select-trigger"
        >
          <option value="">Todos os Autores</option>
          {authors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>

        <select
          value={filters.genre}
          onChange={(e) => onFiltersChange({ ...filters, genre: e.target.value })}
          className="select-trigger"
        >
          <option value="">Todos os Gêneros</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as BookStatus | 'all' })}
          className="select-trigger"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};