import React from 'react';

const Skeleton = ({ 
  className = '', 
  variant = 'rectangle',
  width,
  height,
  rounded = false,
  circle = false,
  animate = true,
  ...props 
}) => {
  const baseStyles = 'bg-dark-border/50';
  
  const variantStyles = {
    rectangle: '',
    text: 'h-4 w-full',
    circular: 'rounded-full',
    card: 'w-full h-32 rounded-lg',
  };
  
  const animationStyles = animate ? 'animate-pulse' : '';
  const roundedStyles = rounded ? 'rounded-md' : '';
  const circleStyles = circle ? 'rounded-full' : '';
  
  const customStyles = {
    width: width ? `width: ${typeof width === 'number' ? `${width}px` : width}` : '',
    height: height ? `height: ${typeof height === 'number' ? `${height}px` : height}` : '',
  };
  
  const inlineStyles = Object.values(customStyles).filter(Boolean).join(';');
  
  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.rectangle}
        ${animationStyles}
        ${roundedStyles}
        ${circleStyles}
        ${className}
      `}
      style={inlineStyles ? { ...props.style, ...customStyles } : props.style}
      {...props}
    />
  );
};

// Predefined skeleton components for common use cases
Skeleton.Text = ({ lines = 1, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        variant="text" 
        className={i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'} 
      />
    ))}
  </div>
);

Skeleton.Card = ({ className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>
    <Skeleton variant="card" />
  </div>
);

Skeleton.Avatar = ({ size = 40, className = '', ...props }) => (
  <Skeleton 
    circle 
    width={size} 
    height={size} 
    className={className} 
    {...props} 
  />
);

Skeleton.Button = ({ width = '100px', height = '38px', className = '', ...props }) => (
  <Skeleton 
    rounded 
    width={width} 
    height={height} 
    className={className} 
    {...props} 
  />
);

export default Skeleton;

