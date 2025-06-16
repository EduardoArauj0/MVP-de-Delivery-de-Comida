import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({
  show,
  onClose,
  onConfirm,
  title,
  confirmText = 'Confirmar',
  children 
}) {
  return (
    <Modal show={show} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        {children}
      </div>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}