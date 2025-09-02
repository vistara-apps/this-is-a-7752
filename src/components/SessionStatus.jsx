import React from 'react';

const SessionStatus = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          text: 'Active',
          className: 'bg-green-500 bg-opacity-20 text-green-400',
        };
      case 'ended':
        return {
          text: 'Ended',
          className: 'bg-gray-500 bg-opacity-20 text-gray-400',
        };
      case 'error':
        return {
          text: 'Error',
          className: 'bg-red-500 bg-opacity-20 text-red-400',
        };
      default:
        return {
          text: 'Unknown',
          className: 'bg-gray-500 bg-opacity-20 text-gray-400',
        };
    }
  };

  const { text, className } = getStatusConfig();

  return (
    <span className={`px-2 py-1 text-xs rounded ${className}`}>
      {text}
    </span>
  );
};

export default SessionStatus;