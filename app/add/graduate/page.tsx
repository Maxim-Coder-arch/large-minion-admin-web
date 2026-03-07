'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/add-kitten/addKitten.scss";
import { useModal } from '@/app/components/modal/ModalContext';

export default function AddAdultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const adultData = {
      name: formData.get('name'),
      description: formData.get('description'),
      portait: formData.get('portait'),
    };

    try {
      const response = await fetch('/api/admin/graduates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adultData),
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: 'Успешно!',
          message: 'Взрослый кот успешно добавлен!',
          onConfirm: () => {
            router.push('/graduates');
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
        <h3>Добавить выпускника</h3>
        <div className="add-kitten-form">
          <form onSubmit={handleSubmit}>
            <div className="set-data-kitten">
              <label htmlFor="name" className="required">Имя выпускника</label>
              <input 
                type="text" 
                id="name"
                name="name"
                required
                placeholder="Например: Valdemar (Largeminion Valdemar)"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="description" className="required">Описание</label>
              <textarea 
                id="description"
                name="description"
                required
                placeholder="Расскажите о коте, его достижениях..."
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="portait" className="required">URL фото</label>
              <input 
                type="text" 
                id="portait"
                name="portait"
                required
                placeholder="https://example.com/cat.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Добавить выпускника'}
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