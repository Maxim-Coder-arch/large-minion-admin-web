'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useModal } from '../components/modal/ModalContext';

export default function DeleteFirstKittenButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal } = useModal();

  // Функция для самого удаления
  const performDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch('/api/admin/kittens/first', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Показываем сообщение об успехе
        showModal({
          title: 'Успешно!',
          message: data.message,
          onConfirm: () => {
            router.refresh(); // Обновляем страницу только после закрытия
          },
          showCancel: false,
        });
      } else {
        // Показываем ошибку
        showModal({
          title: 'Ошибка',
          message: data.error,
          onConfirm: () => {},
          showCancel: false,
        });
      }
    } catch {
      showModal({
        title: 'Ошибка',
        message: 'Произошла ошибка при удалении',
        onConfirm: () => {},
        showCancel: false,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const confirmDelete = () => {
    showModal({
      title: 'Подтверждение',
      message: 'Удалить первого котенка?',
      onConfirm: performDelete,
      showCancel: true,
    });
  };

  return (
    <button 
      onClick={confirmDelete}
      disabled={isDeleting}
    >
      {isDeleting ? 'Удаление...' : 'Удалить первого котенка'}
    </button>
  );
}