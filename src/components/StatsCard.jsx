import React from 'react';

const StatsCard = ({ title, value, change, changeType, icon: Icon }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400';
      case 'negative':
        return 'text-red-400';
      default:
        return 'text-dark-text-secondary';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-text-secondary">{title}</p>
          <p className="text-2xl font-semibold text-dark-text mt-1">{value}</p>
          <p className={`text-sm mt-1 ${getChangeColor()}`}>
            {change} from last month
          </p>
        </div>
        <div className="p-3 bg-accent bg-opacity-20 rounded-lg">
          <Icon size={24} className="text-accent" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;