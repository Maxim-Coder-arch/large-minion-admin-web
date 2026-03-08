'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/add-kitten/addKitten.scss";
import { useModal } from '@/app/components/modal/ModalContext';

export default function AddPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const postData = {
      title: formData.get('title'),
      description: formData.get('description'),
      image: formData.get('image'),
      urlToVk: formData.get('urlToVk'),
    };

    try {
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: '✅ Успешно!',
          message: 'Пост успешно добавлен!',
          onConfirm: () => {
            router.push('/entities/posts');
            router.refresh();
          },
          showCancel: false,
        });
      } else {
        showModal({
          title: '❌ Ошибка',
          message: data.error || 'Произошла ошибка при добавлении',
          onConfirm: () => {},
          showCancel: false,
        });
      }
    } catch {
      showModal({
        title: '❌ Ошибка',
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
        <h3>Добавить пост</h3>
        <div className="add-kitten-form">
          <form onSubmit={handleSubmit}>
            <div className="set-data-kitten">
              <label htmlFor="title" className="required">Заголовок поста</label>
              <input 
                type="text" 
                id="title"
                name="title"
                required
                placeholder="Например: Презентация помета L3"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="description" className="required">Описание</label>
              <textarea 
                id="description"
                name="description"
                required
                placeholder="Текст поста..."
                rows={5}
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="image" className="required">URL фото поста</label>
              <input 
                type="text" 
                id="image"
                name="image"
                required
                placeholder="https://example.com/post-image.jpg"
              />
            </div>

            <div className="set-data-kitten">
              <label htmlFor="urlToVk" className="required">Ссылка на пост ВК</label>
              <input 
                type="url" 
                id="urlToVk"
                name="urlToVk"
                required
                placeholder="https://vk.com/wall-95911846_7740"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : '📝 Добавить пост'}
              </button>
              <button type="button" onClick={handleClear} disabled={loading}>
                🗑️ Очистить форму
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}