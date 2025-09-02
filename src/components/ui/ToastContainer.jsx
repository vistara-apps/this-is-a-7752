import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const position = toast.position || 'bottom-right';
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(toast);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div key={position} className="fixed z-50" style={getPositionStyle(position)}>
          <div className="flex flex-col space-y-2">
            {positionToasts.map((toast) => (
              <Toast
                key={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                position={position}
                onClose={() => removeToast(toast.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

// Helper function to get CSS position styles
const getPositionStyle = (position) => {
  switch (position) {
    case 'top-left':
      return { top: '1rem', left: '1rem' };
    case 'top-center':
      return { top: '1rem', left: '50%', transform: 'translateX(-50%)' };
    case 'top-right':
      return { top: '1rem', right: '1rem' };
    case 'bottom-left':
      return { bottom: '1rem', left: '1rem' };
    case 'bottom-center':
      return { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':
    default:
      return { bottom: '1rem', right: '1rem' };
  }
};

export default ToastContainer;

