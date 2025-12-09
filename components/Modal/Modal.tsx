import css from './Modal.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import ErrorMsg from '@/app/notes/error';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  error: Error;
}

function Modal({ children, onClose, error }: ModalProps) {
  const ModalEl = document.getElementById('modal');

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    document.getElementById('modal')!.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!ModalEl) {
    return <ErrorMsg error={error} />;
  }

  if (ModalEl) {
    return createPortal(
      <div
        onClick={handleBackdropClick}
        className={css.backdrop}
        role="dialog"
        aria-modal="true"
      >
        <div className={css.modal}>{children}</div>
      </div>,

      ModalEl
    );
  }
}

export default Modal;
