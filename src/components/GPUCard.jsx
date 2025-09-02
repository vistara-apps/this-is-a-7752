import React, { useState } from 'react';
import { MapPin, Clock, Cpu, MemoryStick, Zap, Award } from 'lucide-react';
import RentButton from './RentButton';
import RentalModal from './RentalModal';

const GPUCard = ({ gpu }) => {
  const [showRentalModal, setShowRentalModal] = useState(false);

  const getAvailabilityColor = () => {
    switch (gpu.availability) {
      case 'available':
        return 'bg-green-500/20 text-green-400';
      case 'limited':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'unavailable':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-dark-text-secondary';
    }
  };

  const getAvailabilityText = () => {
    switch (gpu.availability) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  // Determine performance tier based on specs
  const getPerformanceTier = () => {
    const { cores } = gpu.specs;
    if (cores >= 14000) return { label: 'Ultra', color: 'text-purple-400', bgColor: 'bg-purple-500/10' };
    if (cores >= 10000) return { label: 'High', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    if (cores >= 6000) return { label: 'Medium', color: 'text-teal-400', bgColor: 'bg-teal-500/10' };
    return { label: 'Standard', color: 'text-gray-400', bgColor: 'bg-gray-500/10' };
  };

  const performanceTier = getPerformanceTier();

  return (
    <>
      <div className={`card p-6 hover:border-accent transition-colors duration-200 ${gpu.availability === 'unavailable' ? 'opacity-60' : ''}`}>
        {/* Status badge and performance tier */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performanceTier.bgColor} ${performanceTier.color} mr-2`}>
              <Award size={12} className="mr-1" />
              {performanceTier.label}
            </span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </span>
        </div>
        
        {/* GPU Name and Type */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-dark-text">{gpu.name}</h3>
          <p className="text-sm text-dark-text-secondary">{gpu.type}</p>
        </div>

        {/* Key Specs - Highlighted */}
        <div className="grid grid-cols-2 gap-3 mb-4 bg-dark-bg/40 p-3 rounded-md">
          <div className="flex flex-col">
            <span className="text-xs text-dark-text-secondary mb-1">Memory</span>
            <div className="flex items-center">
              <MemoryStick size={14} className="text-accent mr-1.5" />
              <span className="text-sm font-medium text-dark-text">{gpu.memory}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-dark-text-secondary mb-1">Compute</span>
            <div className="flex items-center">
              <Cpu size={14} className="text-accent mr-1.5" />
              <span className="text-sm font-medium text-dark-text">{gpu.specs.cores.toLocaleString()} Cores</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-dark-text-secondary mb-1">Location</span>
            <div className="flex items-center">
              <MapPin size={14} className="text-accent mr-1.5" />
              <span className="text-sm font-medium text-dark-text">{gpu.location}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-dark-text-secondary mb-1">Performance</span>
            <div className="flex items-center">
              <Zap size={14} className="text-accent mr-1.5" />
              <span className="text-sm font-medium text-dark-text">{gpu.specs.baseClock}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-dark-text">${gpu.price}</span>
              <span className="text-sm text-dark-text-secondary ml-1">/hour</span>
            </div>
            {gpu.availability === 'available' && (
              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                Ready to deploy
              </span>
            )}
          </div>
          
          <RentButton
            variant={gpu.availability === 'available' ? 'primary' : 'secondary'}
            disabled={gpu.availability === 'unavailable'}
            onClick={() => setShowRentalModal(true)}
            className="w-full"
          >
            {gpu.availability === 'available' ? 'Rent Now' : 'View Details'}
          </RentButton>
        </div>
      </div>

      {showRentalModal && (
        <RentalModal
          gpu={gpu}
          onClose={() => setShowRentalModal(false)}
          onConfirm={() => {
            setShowRentalModal(false);
            // Handle rental confirmation
          }}
        />
      )}
    </>
  );
};

export default GPUCard;
