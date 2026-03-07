"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "../app/components/modal/ModalContext";

export default function DeleteLastArticleButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { showModal } = useModal();

  const performDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch("/api/admin/articles", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showModal({
          title: "Успешно!",
          message: data.message || "Статья успешно удалена",
          onConfirm: () => {
            router.refresh();
          },
          showCancel: false,
        });
      } else {
        showModal({
          title: "Ошибка",
          message: data.error || "Произошла ошибка при удалении",
          onConfirm: () => {},
          showCancel: false,
        });
      }
    } catch {
      showModal({
        title: "Ошибка",
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
      message: "Удалить последнюю добавленную статью?",
      onConfirm: performDelete,
      showCancel: true,
    });
  };

  return (
    <button onClick={confirmDelete} disabled={isDeleting}>
      {isDeleting ? "Удаление..." : "Удалить последнюю статью"}
    </button>
  );
}
