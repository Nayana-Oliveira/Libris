import { Book } from '@/lib/types';
import { BookOpen, Clock, CheckCircle2, Star } from 'lucide-react';
import '../styles/components/Card.css';

interface StatsCardsProps {
  books: Book[];
}

export const StatsCards = ({ books }: StatsCardsProps) => {
  const stats = {
    total: books.length,
    read: books.filter(book => book.status === 'read').length,
    reading: books.filter(book => book.status === 'reading').length,
    want: books.filter(book => book.status === 'want').length,
    avgRating: books.filter(book => book.rating).reduce((acc, book) => acc + (book.rating || 0), 0) / books.filter(book => book.rating).length || 0,
  };

  const cards = [
    {
      title: 'Total de Livros',
      value: stats.total,
      icon: BookOpen,
      className: 'stats-card--primary',
    },
    {
      title: 'Livros Lidos',
      value: stats.read,
      icon: CheckCircle2,
      className: 'stats-card--read',
    },
    {
      title: 'Lendo Agora',
      value: stats.reading,
      icon: Clock,
      className: 'stats-card--reading',
    },
    {
      title: 'Quero Ler',
      value: stats.want,
      icon: Star,
      className: 'stats-card--want',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`card stats-card ${card.className}`}>
            <div className="stats-card__content">
              <div>
                <p className="stats-card__label">{card.title}</p>
                <p className="stats-card__value">{card.value}</p>
              </div>
              <Icon className="stats-card__icon" />
            </div>
          </div>
        );
      })}
    </div>
  );
};