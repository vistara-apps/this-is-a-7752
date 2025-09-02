import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import GPUCard from './GPUCard';

const GPUMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const gpus = [
    {
      id: '1',
      name: 'NVIDIA RTX 4090',
      type: 'Gaming',
      memory: '24GB GDDR6X',
      price: 2.50,
      location: 'US-East',
      availability: 'available',
      specs: {
        cores: 16384,
        baseClock: '2230 MHz',
        memoryBandwidth: '1008 GB/s',
      },
    },
    {
      id: '2',
      name: 'NVIDIA A100',
      type: 'Enterprise',
      memory: '40GB HBM2',
      price: 4.20,
      location: 'US-West',
      availability: 'available',
      specs: {
        cores: 6912,
        baseClock: '1410 MHz',
        memoryBandwidth: '1555 GB/s',
      },
    },
    {
      id: '3',
      name: 'NVIDIA RTX 3090',
      type: 'Gaming',
      memory: '24GB GDDR6X',
      price: 1.80,
      location: 'EU-Central',
      availability: 'limited',
      specs: {
        cores: 10496,
        baseClock: '1695 MHz',
        memoryBandwidth: '936 GB/s',
      },
    },
    {
      id: '4',
      name: 'NVIDIA H100',
      type: 'Enterprise',
      memory: '80GB HBM3',
      price: 8.50,
      location: 'US-East',
      availability: 'unavailable',
      specs: {
        cores: 14592,
        baseClock: '1980 MHz',
        memoryBandwidth: '3352 GB/s',
      },
    },
  ];

  const filteredGPUs = gpus.filter(gpu => {
    const matchesSearch = gpu.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || gpu.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-dark-text mb-2">GPU Marketplace</h2>
        <p className="text-dark-text-secondary">
          Discover and rent powerful GPUs for your AI and rendering projects
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search GPUs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-md text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-dark-text-secondary" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-dark-surface border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Types</option>
            <option value="gaming">Gaming</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGPUs.map(gpu => (
          <GPUCard key={gpu.id} gpu={gpu} />
        ))}
      </div>
    </div>
  );
};

export default GPUMarketplace;