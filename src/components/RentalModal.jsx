import React, { useState } from 'react';
import { X, Clock, DollarSign, Server, Cpu, Shield, Check, AlertCircle } from 'lucide-react';
import EnvironmentSelector from './EnvironmentSelector';
import { usePaymentContext } from '../hooks/usePaymentContext';

const RentalModal = ({ gpu, onClose, onConfirm }) => {
  const [duration, setDuration] = useState(1);
  const [selectedEnvironment, setSelectedEnvironment] = useState('pytorch');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Configuration, 2: Review, 3: Confirmation
  const { createSession } = usePaymentContext();

  const environments = [
    { id: 'pytorch', name: 'PyTorch', description: 'Deep learning framework', icon: Server },
    { id: 'tensorflow', name: 'TensorFlow', description: 'Machine learning platform', icon: Cpu },
    { id: 'cuda', name: 'CUDA', description: 'Raw CUDA environment', icon: Shield },
    { id: 'blender', name: 'Blender', description: '3D rendering software', icon: Server },
  ];

  const hourlyRate = gpu.price;
  const totalCost = (hourlyRate * duration).toFixed(2);
  const serviceFee = (totalCost * 0.05).toFixed(2); // 5% service fee
  const finalTotal = (parseFloat(totalCost) + parseFloat(serviceFee)).toFixed(2);

  const selectedEnv = environments.find(env => env.id === selectedEnvironment);

  const handleRent = async () => {
    setIsProcessing(true);
    try {
      await createSession();
      setCurrentStep(3); // Move to confirmation step
    } catch (error) {
      console.error('Payment failed:', error);
      // Show error state
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-accent text-white' : 'bg-dark-border text-dark-text-secondary'}`}>
        1
      </div>
      <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-accent' : 'bg-dark-border'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-accent text-white' : 'bg-dark-border text-dark-text-secondary'}`}>
        2
      </div>
      <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-accent' : 'bg-dark-border'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-accent text-white' : 'bg-dark-border text-dark-text-secondary'}`}>
        3
      </div>
    </div>
  );

  const renderConfigurationStep = () => (
    <div className="space-y-6">
      <div className="bg-dark-bg/40 p-4 rounded-md">
        <h4 className="font-medium text-dark-text mb-2">{gpu.name}</h4>
        <p className="text-sm text-dark-text-secondary">{gpu.memory} • {gpu.location}</p>
        <div className="mt-2 text-xs inline-flex items-center px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">
          <Check size={12} className="mr-1" /> Available Now
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">
          Duration (hours)
        </label>
        <div className="flex items-center">
          <input
            type="number"
            min="1"
            max="168"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <div className="ml-2 flex flex-col">
            <button 
              onClick={() => setDuration(prev => Math.min(prev + 1, 168))}
              className="bg-dark-bg border border-dark-border rounded-t-md px-2 py-1 text-dark-text hover:bg-dark-border"
            >
              +
            </button>
            <button 
              onClick={() => setDuration(prev => Math.max(prev - 1, 1))}
              className="bg-dark-bg border border-dark-border rounded-b-md px-2 py-1 text-dark-text hover:bg-dark-border"
            >
              -
            </button>
          </div>
        </div>
        <p className="text-xs text-dark-text-secondary mt-1">
          Maximum rental period: 168 hours (7 days)
        </p>
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

      <div className="pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-dark-bg/40 p-4 rounded-md">
        <h4 className="font-medium text-dark-text">Rental Summary</h4>
        
        <div className="mt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">GPU:</span>
            <span className="text-dark-text font-medium">{gpu.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Environment:</span>
            <span className="text-dark-text">{selectedEnv?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Duration:</span>
            <span className="text-dark-text">{duration} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Location:</span>
            <span className="text-dark-text">{gpu.location}</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-bg/40 p-4 rounded-md">
        <h4 className="font-medium text-dark-text mb-3">Cost Breakdown</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Hourly Rate:</span>
            <span className="text-dark-text">${hourlyRate.toFixed(2)}/hour</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Duration Cost:</span>
            <span className="text-dark-text">${totalCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Service Fee (5%):</span>
            <span className="text-dark-text">${serviceFee}</span>
          </div>
          <div className="border-t border-dark-border pt-2 mt-2 flex justify-between">
            <span className="text-dark-text font-medium">Total:</span>
            <span className="text-dark-text font-bold">${finalTotal}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="w-1/2 bg-dark-border text-dark-text py-2 rounded-md font-medium hover:bg-opacity-80 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleRent}
          disabled={isProcessing}
          className="w-1/2 bg-accent text-white py-2 rounded-md font-medium hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Confirm & Pay'}
        </button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <Check size={32} className="text-green-400" />
        </div>
      </div>
      
      <div>
        <h4 className="text-xl font-semibold text-dark-text">Rental Confirmed!</h4>
        <p className="text-dark-text-secondary mt-2">
          Your GPU is being provisioned and will be ready shortly.
        </p>
      </div>
      
      <div className="bg-dark-bg/40 p-4 rounded-md text-left">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">GPU:</span>
            <span className="text-dark-text">{gpu.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Environment:</span>
            <span className="text-dark-text">{selectedEnv?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Duration:</span>
            <span className="text-dark-text">{duration} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-text-secondary">Total Cost:</span>
            <span className="text-dark-text font-bold">${finalTotal}</span>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <button
          onClick={onConfirm}
          className="w-full bg-accent text-white py-2 rounded-md font-medium hover:bg-blue-600 transition-colors"
        >
          Go to Session Manager
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderConfigurationStep();
      case 2:
        return renderReviewStep();
      case 3:
        return renderConfirmationStep();
      default:
        return renderConfigurationStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-dark-text">
            {currentStep === 1 ? 'Configure Rental' : 
             currentStep === 2 ? 'Review & Confirm' : 
             'Rental Confirmed'}
          </h3>
          {currentStep !== 3 && (
            <button
              onClick={onClose}
              className="text-dark-text-secondary hover:text-dark-text"
            >
              <X size={24} />
            </button>
          )}
        </div>
        
        {renderStepIndicator()}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default RentalModal;
