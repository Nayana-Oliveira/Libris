import { Book } from '@/lib/types';
import '../styles/components/Card.css';
import '../styles/components/Badge.css';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

const statusConfig = {
  read: { label: 'Lido', className: 'badge--read' },
  reading: { label: 'Lendo', className: 'badge--reading' },
  want: { label: 'Quero Ler', className: 'badge--want' },
};

export const BookCard = ({ book, onClick }: BookCardProps) => {
  const status = statusConfig[book.status];

  return (
    <div className="card book-card animate-fade-in" onClick={onClick}>
      <div className="card__content--no-padding">
        <div className="book-card__image-container">
          <img
            src={book.coverUrl || '/placeholder.svg'}
            alt={`Capa do livro ${book.title}`}
            className="book-card__image"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="book-card__overlay" />
          <div className={`badge ${status.className} book-card__status`}>
            {status.label}
          </div>
        </div>
        
        <div className="book-card__details">
          <h3 className="book-card__title line-clamp-2">
            {book.title}
          </h3>
          <p className="book-card__author line-clamp-1">
            {book.author}
          </p>
          <div className="book-card__meta">
            <span>{book.genre}</span>
            <span>{book.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};