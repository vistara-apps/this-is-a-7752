import React from 'react';
import { Play, Pause, Square, Clock, Cpu, DollarSign } from 'lucide-react';
import SessionStatus from './SessionStatus';

const SessionManager = () => {
  const sessions = [
    {
      id: '1',
      gpu: 'NVIDIA RTX 4090',
      environment: 'PyTorch',
      startTime: '2024-01-15T10:30:00Z',
      duration: '2h 34m',
      cost: '$12.50',
      status: 'active',
      utilization: 85,
    },
    {
      id: '2',
      gpu: 'NVIDIA A100',
      environment: 'TensorFlow',
      startTime: '2024-01-15T14:15:00Z',
      duration: '45m',
      cost: '$8.20',
      status: 'active',
      utilization: 92,
    },
    {
      id: '3',
      gpu: 'NVIDIA RTX 3090',
      environment: 'Blender',
      startTime: '2024-01-14T16:20:00Z',
      duration: '4h 12m',
      cost: '$22.40',
      status: 'ended',
      utilization: 78,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-dark-text mb-2">Session Manager</h2>
        <p className="text-dark-text-secondary">
          Monitor and manage your active GPU rental sessions
        </p>
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-dark-text">{session.gpu}</h3>
                <p className="text-sm text-dark-text-secondary">{session.environment}</p>
              </div>
              <SessionStatus status={session.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-dark-text-secondary" />
                <div>
                  <p className="text-sm text-dark-text-secondary">Duration</p>
                  <p className="text-sm font-medium text-dark-text">{session.duration}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-dark-text-secondary" />
                <div>
                  <p className="text-sm text-dark-text-secondary">Cost</p>
                  <p className="text-sm font-medium text-dark-text">{session.cost}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Cpu size={16} className="text-dark-text-secondary" />
                <div>
                  <p className="text-sm text-dark-text-secondary">Utilization</p>
                  <p className="text-sm font-medium text-dark-text">{session.utilization}%</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div>
                  <p className="text-sm text-dark-text-secondary">Started</p>
                  <p className="text-sm font-medium text-dark-text">
                    {new Date(session.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {session.status === 'active' && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-dark-text-secondary">GPU Utilization</span>
                  <span className="text-dark-text">{session.utilization}%</span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${session.utilization}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              {session.status === 'active' ? (
                <>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    <Square size={16} />
                    <span>Stop</span>
                  </button>
                </>
              ) : (
                <button className="flex items-center space-x-2 px-3 py-2 bg-accent text-white rounded-md hover:bg-blue-600 transition-colors">
                  <Play size={16} />
                  <span>Restart</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionManager;