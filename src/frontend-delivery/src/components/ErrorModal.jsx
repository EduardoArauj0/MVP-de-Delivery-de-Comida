import React from 'react';
import Modal from './Modal';

export default function ErrorModal({ show, onClose, title, children }) {
  return (
    <Modal show={show} onClose={onClose} title={title} size="sm">
      <div>{children}</div>
      <div className="d-flex justify-content-end mt-4">
        <button type="button" className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </Modal>
  );
}