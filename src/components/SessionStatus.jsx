import React from 'react';
import { Activity, CheckCircle, AlertCircle, Clock, Pause } from 'lucide-react';

const SessionStatus = ({ status, size = 'default' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          text: 'Active',
          className: 'bg-green-500/20 text-green-400 border-green-500/30',
          icon: Activity,
          pulse: true
        };
      case 'ended':
        return {
          text: 'Ended',
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: CheckCircle,
          pulse: false
        };
      case 'error':
        return {
          text: 'Error',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
          icon: AlertCircle,
          pulse: false
        };
      case 'pending':
        return {
          text: 'Pending',
          className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          icon: Clock,
          pulse: true
        };
      case 'paused':
        return {
          text: 'Paused',
          className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
          icon: Pause,
          pulse: false
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
          icon: AlertCircle,
          pulse: false
        };
    }
  };

  const { text, className, icon: Icon, pulse } = getStatusConfig();
  
  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    default: 'text-xs px-2.5 py-1',
    large: 'text-sm px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${className} ${sizeClasses[size] || sizeClasses.default}`}>
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1.5">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${className}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${className}`}></span>
        </span>
      )}
      
      {!pulse && Icon && (
        <Icon size={size === 'small' ? 12 : size === 'large' ? 16 : 14} className="mr-1" />
      )}
      
      {text}
    </span>
  );
};

export default SessionStatus;
