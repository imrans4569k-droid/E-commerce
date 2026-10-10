import React from 'react';

export default function ToastAlert({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container-custom">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className="custom-toast"
          style={{
            borderLeftColor: toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#6366f1'
          }}
        >
          <i 
            className={`bi ${
              toast.type === 'error' 
                ? 'bi-exclamation-triangle-fill text-danger' 
                : toast.type === 'warning' 
                ? 'bi-exclamation-circle-fill text-warning' 
                : 'bi-check-circle-fill text-primary'
            } fs-5`}
          ></i>
          <div className="flex-grow-1 small">
            <strong className="d-block">{toast.title}</strong>
            <span className="text-muted">{toast.message}</span>
          </div>
          <button 
            className="btn btn-link text-muted p-0 ms-2"
            onClick={() => onDismiss(toast.id)}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      ))}
    </div>
  );
}
