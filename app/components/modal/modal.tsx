'use client';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  showCancel?: boolean;
}

export default function Modal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  showCancel = true 
}: ModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={showCancel ? onCancel : undefined}>
      <div className="modal-window" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          <button 
            className="modal-btn confirm" 
            onClick={() => {
              onConfirm();
            }}
          >
            Ок
          </button>
          {showCancel && (
            <button 
              className="modal-btn cancel" 
              onClick={onCancel}
            >
              Отмена
            </button>
          )}
        </div>
      </div>
    </div>
  );
}