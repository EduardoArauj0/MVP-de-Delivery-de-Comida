import React from 'react';
import './style/Modal.css';

export default function Modal({ show, onClose, title, children, size = 'lg' }) {
  if (!show) {
    return null;
  }

  const sizeClass = size === 'sm' ? 'modal-sm' : 'modal-lg';

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className={`modal-custom ${sizeClass}`} role="dialog">
        <div className="modal-content-custom">
          <div className="modal-header-custom">
            <h5 className="modal-title-custom">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body-custom">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}