import React from 'react';

const UsageChart = () => {
  const data = [
    { day: 'Mon', hours: 8 },
    { day: 'Tue', hours: 12 },
    { day: 'Wed', hours: 6 },
    { day: 'Thu', hours: 15 },
    { day: 'Fri', hours: 10 },
    { day: 'Sat', hours: 4 },
    { day: 'Sun', hours: 2 },
  ];

  const maxHours = Math.max(...data.map(d => d.hours));

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-dark-text mb-4">GPU Usage This Week</h3>
      <div className="flex items-end space-x-4 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-dark-border rounded-t-md relative">
              <div
                className="bg-accent rounded-t-md transition-all duration-300"
                style={{
                  height: `${(item.hours / maxHours) * 160}px`,
                  minHeight: '4px',
                }}
              />
            </div>
            <span className="text-sm text-dark-text-secondary mt-2">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageChart;