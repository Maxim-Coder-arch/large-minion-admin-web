"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "../app/components/modal/ModalContext";

interface DeleteLastButtonProps {
  entityType: "kittens" | "adults" | "graduates" | "posts" | "articles";
}

const entityNames = {
  kittens: "котенка",
  adults: "взрослого кота",
  graduates: "выпускника",
  posts: "пост",
  articles: "статью",
};

export default function DeleteLastButton({
  entityType,
}: DeleteLastButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal } = useModal();

  const entityName = entityNames[entityType];

  const performDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/${entityType}/last`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: "✅ Успешно!",
          message: data.message || `Последний ${entityName} удален`,
          onConfirm: () => {
            router.refresh();
          },
          showCancel: false,
        });
      } else {
        showModal({
          title: "❌ Ошибка",
          message: data.error || `Ошибка при удалении последнего ${entityName}`,
          onConfirm: () => {},
          showCancel: false,
        });
      }
    } catch {
      showModal({
        title: "❌ Ошибка",
        message: "Произошла ошибка при удалении",
        onConfirm: () => {},
        showCancel: false,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    showModal({
      title: "Подтверждение",
      message: `Удалить последнего ${entityName}? Это действие нельзя отменить!`,
      onConfirm: performDelete,
      showCancel: true,
    });
  };

  return (
    <button
      onClick={confirmDelete}
      disabled={isDeleting}
      className="delete-button"
    >
      {isDeleting ? "Удаление..." : `🗑️ Удалить последнего ${entityName}`}
    </button>
  );
}
