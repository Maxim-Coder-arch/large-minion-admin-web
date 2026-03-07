'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/add-kitten/addKitten.scss";
import { useModal } from '@/app/components/modal/ModalContext';

export default function AddArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const articleData = {
      title: formData.get('title'),
      description: formData.get('description'),
    };

    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: 'Успешно!',
          message: 'Статья успешно добавлена!',
          onConfirm: () => {
            router.push('/articles');
            router.refresh();
          },
          showCancel: false,
        });
      } else {
        showModal({
          title: 'Ошибка',
          message: data.error || 'Произошла ошибка при добавлении',
          onConfirm: () => {},
          showCancel: false,
        });
      }
    } catch {
      showModal({
        title: 'Ошибка',
        message: 'Произошла ошибка при сохранении',
        onConfirm: () => {},
        showCancel: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    showModal({
      title: 'Подтверждение',
      message: 'Очистить все поля формы?',
      onConfirm: () => {
        const form = document.querySelector('form') as HTMLFormElement;
        form.reset();
      },
      showCancel: true,
    });
  };

  return (
    <div className='universal-styling'>
      <div className="add-kitten">
        <h3>Добавить статью</h3>
        <div className="add-kitten-form">
          <form onSubmit={handleSubmit}>
            <div className="set-data-kitten">
              <label htmlFor="title" className="required">Заголовок статьи</label>
              <input 
                type="text" 
                id="title"
                name="title"
                required
                placeholder="Например: Как ухаживать за мейн-куном"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="description" className="required">Текст статьи</label>
              <textarea 
                id="description"
                name="description"
                required
                placeholder="Полный текст статьи..."
                rows={10}
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Добавить статью'}
              </button>
              <button type="button" onClick={handleClear} disabled={loading}>
                Очистить форму
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}