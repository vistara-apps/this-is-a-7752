import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-dark-surface border border-dark-border rounded-lg shadow-dark-card';
  
  const variantStyles = {
    default: '',
    interactive: 'cursor-pointer transition-all duration-200',
    elevated: 'shadow-lg',
    flat: 'shadow-none',
  };
  
  const hoverStyles = hover ? 'hover:border-accent hover:shadow-lg transition-all duration-200' : '';
  
  const clickableProps = onClick ? { 
    onClick,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick(e);
      }
    }
  } : {};
  
  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant] || ''}
        ${hoverStyles}
        ${className}
      `}
      {...clickableProps}
      {...props}
    >
      {children}
    </div>
  );
};

// Card subcomponents for consistent structure
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-dark-border ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-t border-dark-border ${className}`} {...props}>
    {children}
  </div>
);

Card.Title = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-dark-text ${className}`} {...props}>
    {children}
  </h3>
);

Card.Subtitle = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-dark-text-secondary ${className}`} {...props}>
    {children}
  </p>
);

export default Card;

