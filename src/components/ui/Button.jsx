import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default', 
  className = '', 
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-accent';
  
  const variantStyles = {
    primary: 'bg-accent text-white hover:bg-blue-600 disabled:bg-gray-600',
    secondary: 'bg-dark-border text-dark-text hover:bg-opacity-80 disabled:bg-opacity-50',
    outline: 'bg-transparent border border-dark-border text-dark-text hover:bg-dark-border disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-800',
    ghost: 'bg-transparent text-dark-text hover:bg-dark-border disabled:opacity-50',
  };
  
  const sizeStyles = {
    small: 'text-xs px-2.5 py-1.5',
    default: 'text-sm px-4 py-2',
    large: 'text-base px-6 py-3',
  };
  
  const widthStyles = fullWidth ? 'w-full' : '';
  
  const disabledStyles = disabled ? 'cursor-not-allowed opacity-60' : '';
  
  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.default}
        ${widthStyles}
        ${disabledStyles}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;

