import React from 'react';

const RentButton = ({ variant = 'primary', disabled = false, onClick, children }) => {
  const baseClasses = 'w-full px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent';
  
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed',
    secondary: 'bg-dark-border text-dark-text hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default RentButton;