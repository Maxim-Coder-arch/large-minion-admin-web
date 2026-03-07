'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/add-kitten/addKitten.scss";
import { useModal } from '@/app/components/modal/ModalContext';

export default function AddKittenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const kittenData = {
      name: formData.get('name'),
      description: formData.get('description'),
      image: formData.get('image'),
      litter: formData.get('litter'),
      age: formData.get('age'),
      gender: formData.get('gender'),
      mother: {
        name: formData.get('mother-name'),
        image: formData.get('mother-image')
      },
      father: {
        name: formData.get('father-name'),
        image: formData.get('father-image')
      }
    };

    try {
      const response = await fetch('/api/admin/kittens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kittenData),
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: 'Успешно!',
          message: 'Котенок успешно добавлен!',
          onConfirm: () => {
            router.push('/kittens');
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
        <h3>Добавить котенка</h3>
        <div className="add-kitten-form">
          <form onSubmit={handleSubmit}>
            <div className="set-data-kitten">
              <label htmlFor="name" className="required">Имя котенка</label>
              <input 
                type="text" 
                id="name"
                name="name"
                required
                placeholder="Например: Мира"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="description" className="required">Описание котенка</label>
              <textarea 
                id="description"
                name="description"
                required
                placeholder="Расскажите о характере, особенностях..."
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="image" className="required">URL картинки котенка</label>
              <input 
                type="text" 
                id="image"
                name="image"
                required
                placeholder="https://example.com/cat.jpg"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="litter" className="required">Помет котенка</label>
              <input 
                type="text" 
                id="litter"
                name="litter"
                required
                placeholder="Например: L1"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="age" className="required">Возраст котенка</label>
              <input 
                type="text" 
                id="age"
                name="age"
                required
                placeholder="Например: 4 месяца"
              />
            </div>
            
            <div className="set-data-kitten">
              <label htmlFor="gender" className="required">Пол котенка</label>
              <select 
                id="gender"
                name="gender"
                required
              >
                <option value="">Выберите пол</option>
                <option value="male">Мальчик</option>
                <option value="female">Девочка</option>
              </select>
            </div>

            <div className="parents-section">
              <h4>Родители</h4>
              <div className="parent-grid">
                <div className="parent-block">
                  <h5>Мама</h5>
                  <div className="set-data-kitten">
                    <label htmlFor="mother-name" className="required">Имя мамы</label>
                    <input 
                      type="text" 
                      id="mother-name"
                      name="mother-name"
                      required
                      placeholder="Имя мамы-кошки"
                    />
                  </div>
                  <div className="set-data-kitten">
                    <label htmlFor="mother-image" className="required">Фото мамы</label>
                    <input 
                      type="text" 
                      id="mother-image"
                      name="mother-image"
                      required
                      placeholder="URL фото мамы"
                    />
                  </div>
                </div>

                <div className="parent-block">
                  <h5>Папа</h5>
                  <div className="set-data-kitten">
                    <label htmlFor="father-name" className="required">Имя папы</label>
                    <input 
                      type="text" 
                      id="father-name"
                      name="father-name"
                      required
                      placeholder="Имя папы-кота"
                    />
                  </div>
                  <div className="set-data-kitten">
                    <label htmlFor="father-image" className="required">Фото папы</label>
                    <input 
                      type="text" 
                      id="father-image"
                      name="father-image"
                      required
                      placeholder="URL фото папы"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Сохранение...' : 'Добавить котенка'}
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