import { useState, useEffect } from 'react';
import { Book, BookFormData, BookStatus } from '@/lib/types';
import { Star, Trash2, Edit3, X } from 'lucide-react';
import '../styles/components/Modal.css';
import '../styles/components/Button.css';
import '../styles/components/Input.css';
import '../styles/components/Badge.css';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BookFormData) => void;
  onDelete: (id: string) => void;
  mode: 'view' | 'edit' | 'create';
}

const statusOptions = [
  { value: 'want' as BookStatus, label: 'Quero Ler' },
  { value: 'reading' as BookStatus, label: 'Lendo' },
  { value: 'read' as BookStatus, label: 'Lido' },
];

const statusConfig = {
  read: { label: 'Lido', className: 'badge--read' },
  reading: { label: 'Lendo', className: 'badge--reading' },
  want: { label: 'Quero Ler', className: 'badge--want' },
};

export const BookModal = ({ book, isOpen, onClose, onSave, onDelete, mode }: BookModalProps) => {
  const [editMode, setEditMode] = useState(mode === 'edit' || mode === 'create');
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    genre: '',
    year: new Date().getFullYear(),
    coverUrl: '',
    status: 'want',
    description: '',
    rating: undefined,
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        year: book.year,
        coverUrl: book.coverUrl,
        status: book.status,
        description: book.description || '',
        rating: book.rating,
      });
    } else if (mode === 'create') {
      setFormData({
        title: '',
        author: '',
        genre: '',
        year: new Date().getFullYear(),
        coverUrl: '',
        status: 'want',
        description: '',
        rating: undefined,
      });
    }
    setEditMode(mode === 'edit' || mode === 'create');
  }, [book, mode]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (book && window.confirm('Tem certeza que deseja excluir este livro?')) {
      onDelete(book.id);
      onClose();
    }
  };

  const renderStars = (rating: number | undefined, interactive = false) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`star ${rating && star <= rating ? 'star--active' : ''}`}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Adicionar Livro' : editMode ? 'Editar Livro' : book?.title}
          </h2>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div className="modal-cover">
              <div className="modal-cover__image">
                <img
                  src={formData.coverUrl || '/placeholder.svg'}
                  alt="Capa do livro"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              {editMode && (
                <div className="form-field">
                  <label className="label" htmlFor="coverUrl">URL da Capa</label>
                  <input
                    id="coverUrl"
                    type="text"
                    className="input"
                    value={formData.coverUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            <div className="modal-details">
              {editMode ? (
                <>
                  <div className="modal-form-grid modal-form-grid--two-cols">
                    <div className="form-field">
                      <label className="label" htmlFor="title">Título *</label>
                      <input
                        id="title"
                        type="text"
                        className="input"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Título do livro"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="label" htmlFor="author">Autor *</label>
                      <input
                        id="author"
                        type="text"
                        className="input"
                        value={formData.author}
                        onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="Nome do autor"
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-form-grid modal-form-grid--three-cols">
                    <div className="form-field">
                      <label className="label" htmlFor="genre">Gênero</label>
                      <input
                        id="genre"
                        type="text"
                        className="input"
                        value={formData.genre}
                        onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                        placeholder="Ficção, Romance..."
                      />
                    </div>
                    <div className="form-field">
                      <label className="label" htmlFor="year">Ano</label>
                      <input
                        id="year"
                        type="number"
                        className="input"
                        value={formData.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                        min="1000"
                        max={new Date().getFullYear() + 5}
                      />
                    </div>
                    <div className="form-field">
                      <label className="label" htmlFor="status">Status</label>
                      <select
                        id="status"
                        className="select-trigger"
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as BookStatus }))}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="label">Avaliação</label>
                    {renderStars(formData.rating, true)}
                  </div>

                  <div className="form-field">
                    <label className="label" htmlFor="description">Descrição</label>
                    <textarea
                      id="description"
                      className="textarea"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Suas impressões sobre o livro..."
                      rows={4}
                    />
                  </div>
                </>
              ) : (
                <div className="book-info">
                  <div className="book-info__header">
                    <h2>{book?.title}</h2>
                    <p>por {book?.author}</p>
                  </div>

                  <div className="book-info__meta">
                    {book && (
                      <div className={`badge ${statusConfig[book.status].className}`}>
                        {statusConfig[book.status].label}
                      </div>
                    )}
                    <span className="text-sm text-muted">{book?.genre}</span>
                    <span className="text-sm text-muted">{book?.year}</span>
                  </div>

                  {book?.rating && (
                    <div className="book-info__rating">
                      <p className="book-info__rating-label">Sua Avaliação:</p>
                      {renderStars(book.rating)}
                    </div>
                  )}

                  {book?.description && (
                    <div className="book-info__description">
                      <div className="separator" />
                      <p className="book-info__description-label">Suas Impressões:</p>
                      <p className="book-info__description-text">
                        {book.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <div className="modal-actions__left">
            {!editMode && book && (
              <button
                className="btn btn--destructive btn--sm"
                onClick={handleDelete}
              >
                <Trash2 className="icon" />
                <span>Excluir</span>
              </button>
            )}
          </div>
          
          <div className="modal-actions__right">
            {editMode ? (
              <>
                <button 
                  className="btn btn--outline btn--md"
                  onClick={() => editMode && mode !== 'create' ? setEditMode(false) : onClose()}
                >
                  Cancelar
                </button>
                <button 
                  className="btn btn--primary btn--md"
                  onClick={handleSave}
                  disabled={!formData.title.trim() || !formData.author.trim()}
                >
                  {mode === 'create' ? 'Adicionar' : 'Salvar'}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn--outline btn--md" onClick={onClose}>
                  Fechar
                </button>
                <button className="btn btn--primary btn--md" onClick={() => setEditMode(true)}>
                  <Edit3 className="icon" />
                  <span>Editar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};