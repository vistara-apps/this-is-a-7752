import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  position = 'bottom-right',
  showProgress = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (duration === Infinity) return;
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);
    
    // Progress bar animation
    if (showProgress) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress < 0 ? 0 : newProgress;
        });
      }, 100);
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
    
    return () => clearTimeout(timer);
  }, [duration, onClose, showProgress]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      progressColor: 'bg-green-500',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      textColor: 'text-red-400',
      progressColor: 'bg-red-500',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      progressColor: 'bg-yellow-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      progressColor: 'bg-blue-500',
    },
  };
  
  const { icon: Icon, bgColor, borderColor, textColor, progressColor } = typeConfig[type] || typeConfig.info;
  
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };
  
  return (
    <div 
      className={`fixed ${positionStyles[position] || positionStyles['bottom-right']} z-50 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto`}
      role="alert"
    >
      <div className={`${bgColor} border ${borderColor} rounded-lg overflow-hidden`}>
        <div className="p-4">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${textColor}`}>
              <Icon size={20} />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-dark-text">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                className="bg-transparent rounded-md inline-flex text-dark-text-secondary hover:text-dark-text"
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {showProgress && (
          <div className="h-1 w-full bg-dark-border">
            <div 
              className={`h-full ${progressColor} transition-all duration-100 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;

