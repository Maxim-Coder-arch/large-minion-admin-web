'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useModal } from '../modal/ModalContext';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface DeleteButtonProps {
  entityType: string;
  position: 'first' | 'last';
}

const entityNames = {
  kittens: 'котенка',
  adults: 'взрослого кота',
  graduates: 'выпускника',
  posts: 'пост',
  articles: 'статью'
};

export default function DeleteButton({ entityType, position }: DeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal } = useModal();

  const entityName = entityNames[entityType as keyof typeof entityNames] || 'элемент';
  const positionText = position === 'first' ? 'первое добавленное' : 'последнее добавленное';

  const performDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/${entityType}/${position}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: '✅ Успешно!',
          message: data.message || `${positionText} ${entityName} удален`,
          onConfirm: () => router.refresh(),
          showCancel: false,
        });
      } else {
        showModal({
          title: '❌ Ошибка',
          message: data.error || 'Ошибка при удалении',
          onConfirm: () => {},
          showCancel: false,
        });
      }
    } catch {
      showModal({
        title: '❌ Ошибка',
        message: 'Ошибка при удалении',
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
      message: `Удалить ${positionText} ${entityName}?`,
      onConfirm: performDelete,
      showCancel: true,
    });
  };

  return (
    <button onClick={confirmDelete} disabled={isDeleting}>
      {isDeleting ? '...' : `Удалить ${positionText}`}
    </button>
  );
}