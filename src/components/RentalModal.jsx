import React, { useState } from 'react';
import { X, Clock, DollarSign } from 'lucide-react';
import EnvironmentSelector from './EnvironmentSelector';
import { usePaymentContext } from '../hooks/usePaymentContext';

const RentalModal = ({ gpu, onClose, onConfirm }) => {
  const [duration, setDuration] = useState(1);
  const [selectedEnvironment, setSelectedEnvironment] = useState('pytorch');
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSession } = usePaymentContext();

  const environments = [
    { id: 'pytorch', name: 'PyTorch', description: 'Deep learning framework' },
    { id: 'tensorflow', name: 'TensorFlow', description: 'Machine learning platform' },
    { id: 'cuda', name: 'CUDA', description: 'Raw CUDA environment' },
    { id: 'blender', name: 'Blender', description: '3D rendering software' },
  ];

  const totalCost = (gpu.price * duration).toFixed(2);

  const handleRent = async () => {
    setIsProcessing(true);
    try {
      await createSession();
      onConfirm();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-dark-text">Rent GPU</h3>
          <button
            onClick={onClose}
            className="text-dark-text-secondary hover:text-dark-text"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-dark-text mb-2">{gpu.name}</h4>
            <p className="text-sm text-dark-text-secondary">{gpu.memory} • {gpu.location}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Duration (hours)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Environment
            </label>
            <EnvironmentSelector
              environments={environments}
              selected={selectedEnvironment}
              onSelect={setSelectedEnvironment}
            />
          </div>

          <div className="border-t border-dark-border pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-dark-text-secondary" />
                <span className="text-sm text-dark-text">{duration} hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign size={16} className="text-dark-text-secondary" />
                <span className="text-lg font-semibold text-dark-text">${totalCost}</span>
              </div>
            </div>
            
            <button
              onClick={handleRent}
              disabled={isProcessing}
              className="w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Confirm Rental'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;