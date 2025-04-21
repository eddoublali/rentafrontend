import React from 'react';

export default function ConfirmModal({ id, title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        {message && <p className="py-4">{message}</p>}

        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                document.getElementById(id).close();
              }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={() => {
                onConfirm();
                document.getElementById(id).close();
              }}
            >
              {confirmText}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
