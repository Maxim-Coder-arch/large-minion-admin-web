'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useModal } from '../modal/ModalContext';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ClearAllButtonProps {
  entityType: string;
  entityName: string;
  count: number;
}

export default function ClearAllButton({ entityType, entityName, count }: ClearAllButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal } = useModal();

  const performClear = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/entities/${entityType}/clear`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: '✅ Успешно!',
          message: `Все ${entityName} (${count} записей) удалены`,
          onConfirm: () => {
            router.push(`/admin/entities/${entityType}`);
            router.refresh();
          },
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

  const confirmClear = () => {
    showModal({
      title: 'Подтверждение',
      message: `Вы уверены, что хотите удалить ВСЕХ ${entityName} (${count} записей)? Это действие нельзя отменить!`,
      onConfirm: performClear,
      showCancel: true,
    });
  };

  if (count === 0) {
    return (
      <div className="no-data-message">
        <p>Нет данных для удаления</p>
        <Link href={`/admin/entities/${entityType}`} className="back-link">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <button 
      onClick={confirmClear}
      disabled={isDeleting}
      className="clear-all-button danger"
    >
      {isDeleting ? 'Удаление...' : `Очистить все (${count})`}
    </button>
  );
}