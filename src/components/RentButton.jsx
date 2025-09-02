import React from 'react';
import Button from './ui/Button';

const RentButton = ({ 
  variant = 'primary', 
  disabled = false, 
  onClick, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      disabled={disabled}
      onClick={onClick}
      fullWidth
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

export default RentButton;
