import React, { useState } from 'react';
import { MapPin, Clock, Cpu, MemoryStick } from 'lucide-react';
import RentButton from './RentButton';
import RentalModal from './RentalModal';

const GPUCard = ({ gpu }) => {
  const [showRentalModal, setShowRentalModal] = useState(false);

  const getAvailabilityColor = () => {
    switch (gpu.availability) {
      case 'available':
        return 'text-green-400';
      case 'limited':
        return 'text-yellow-400';
      case 'unavailable':
        return 'text-red-400';
      default:
        return 'text-dark-text-secondary';
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

  return (
    <>
      <div className={`card p-6 ${gpu.availability === 'unavailable' ? 'opacity-60' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-dark-text">{gpu.name}</h3>
            <p className="text-sm text-dark-text-secondary">{gpu.type}</p>
          </div>
          <span className={`text-sm font-medium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <MemoryStick size={16} className="text-dark-text-secondary" />
            <span className="text-sm text-dark-text">{gpu.memory}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Cpu size={16} className="text-dark-text-secondary" />
            <span className="text-sm text-dark-text">{gpu.specs.cores} Cores</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-dark-text-secondary" />
            <span className="text-sm text-dark-text">{gpu.location}</span>
          </div>
        </div>

        <div className="border-t border-dark-border pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-dark-text">${gpu.price}</span>
              <span className="text-sm text-dark-text-secondary">/hour</span>
            </div>
          </div>
          
          <RentButton
            variant={gpu.availability === 'available' ? 'primary' : 'secondary'}
            disabled={gpu.availability === 'unavailable'}
            onClick={() => setShowRentalModal(true)}
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