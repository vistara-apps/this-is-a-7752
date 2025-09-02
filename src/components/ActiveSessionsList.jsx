import React from 'react';
import { Clock, Cpu, DollarSign } from 'lucide-react';

const ActiveSessionsList = () => {
  const sessions = [
    {
      id: '1',
      gpu: 'RTX 4090',
      environment: 'PyTorch',
      duration: '2h 34m',
      cost: '$12.50',
      status: 'active',
    },
    {
      id: '2',
      gpu: 'A100',
      environment: 'TensorFlow',
      duration: '45m',
      cost: '$8.20',
      status: 'active',
    },
    {
      id: '3',
      gpu: 'RTX 3090',
      environment: 'Blender',
      duration: '1h 12m',
      cost: '$5.40',
      status: 'active',
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-dark-text mb-4">Active Sessions</h3>
      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="border border-dark-border rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-dark-text">{session.gpu}</h4>
              <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded">
                {session.status}
              </span>
            </div>
            <p className="text-sm text-dark-text-secondary mb-3">{session.environment}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1 text-dark-text-secondary">
                <Clock size={14} />
                <span>{session.duration}</span>
              </div>
              <div className="flex items-center space-x-1 text-dark-text-secondary">
                <DollarSign size={14} />
                <span>{session.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveSessionsList;