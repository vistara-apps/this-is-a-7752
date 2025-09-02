import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, X, Zap } from 'lucide-react';
import GPUCard from './GPUCard';
import Button from './ui/Button';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import { useToastContext } from '../contexts/ToastContext';

const GPUMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  const { success } = useToastContext();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
    {
      id: '5',
      name: 'AMD Radeon Pro W7900',
      type: 'Professional',
      memory: '48GB GDDR6',
      price: 3.75,
      location: 'EU-West',
      availability: 'available',
      specs: {
        cores: 12288,
        baseClock: '1855 MHz',
        memoryBandwidth: '864 GB/s',
      },
    },
    {
      id: '6',
      name: 'NVIDIA RTX A6000',
      type: 'Professional',
      memory: '48GB GDDR6',
      price: 5.20,
      location: 'US-West',
      availability: 'limited',
      specs: {
        cores: 10752,
        baseClock: '1455 MHz',
        memoryBandwidth: '768 GB/s',
      },
    },
  ];

  const locations = ['US-East', 'US-West', 'EU-Central', 'EU-West', 'Asia-Pacific'];
  const types = ['Gaming', 'Enterprise', 'Professional'];

  // Filter GPUs based on search, type, price, and location
  const filteredGPUs = gpus.filter(gpu => {
    const matchesSearch = gpu.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || gpu.type.toLowerCase() === selectedType.toLowerCase();
    const matchesPrice = gpu.price >= priceRange[0] && gpu.price <= priceRange[1];
    const matchesLocation = selectedLocation === 'all' || gpu.location === selectedLocation;
    return matchesSearch && matchesType && matchesPrice && matchesLocation;
  });

  // Sort GPUs based on selected sort option
  const sortedGPUs = [...filteredGPUs].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'cores-desc':
        return b.specs.cores - a.specs.cores;
      case 'memory-desc':
        return parseInt(b.memory) - parseInt(a.memory);
      default:
        return a.price - b.price;
    }
  });

  const handleFilterReset = () => {
    setSearchTerm('');
    setSelectedType('all');
    setPriceRange([0, 10]);
    setSelectedLocation('all');
    setSortBy('price-asc');
    success('Filters have been reset');
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="h-full">
        <Card className="p-6 h-full">
          <div className="flex justify-between mb-3">
            <Skeleton width={100} height={24} rounded />
            <Skeleton width={80} height={24} rounded />
          </div>
          <Skeleton.Text lines={2} className="mb-4" />
          <div className="grid grid-cols-2 gap-3 mb-4 bg-dark-bg/40 p-3 rounded-md">
            <Skeleton height={40} rounded />
            <Skeleton height={40} rounded />
            <Skeleton height={40} rounded />
            <Skeleton height={40} rounded />
          </div>
          <div className="border-t border-dark-border pt-4">
            <div className="flex justify-between mb-4">
              <Skeleton width={80} height={30} rounded />
              <Skeleton width={100} height={30} rounded />
            </div>
            <Skeleton height={40} rounded />
          </div>
        </Card>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-dark-text mb-2">GPU Marketplace</h2>
        <p className="text-dark-text-secondary">
          Discover and rent powerful GPUs for your AI and rendering projects
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-secondary" />
            <input
              type="text"
              placeholder="Search GPUs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="default"
              icon={<SlidersHorizontal size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters {filteredGPUs.length !== gpus.length && `(${filteredGPUs.length})`}
            </Button>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="default"
                icon={<Filter size={16} />}
                iconPosition="left"
                className="flex items-center"
              >
                <span className="mr-1">Sort</span>
                <ChevronDown size={14} />
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                aria-label="Sort GPUs"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="cores-desc">Performance: High to Low</option>
                <option value="memory-desc">Memory: High to Low</option>
              </select>
            </div>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  GPU Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Price Range ($/hour)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    step="0.1"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseFloat(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="text-dark-text-secondary">to</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max="20"
                    step="0.1"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value)])}
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-md text-dark-text focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="ghost" 
                size="small"
                icon={<X size={14} />}
                onClick={handleFilterReset}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletons()}
        </div>
      ) : sortedGPUs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGPUs.map(gpu => (
            <GPUCard key={gpu.id} gpu={gpu} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Zap size={48} className="text-dark-text-secondary" />
          </div>
          <h3 className="text-xl font-semibold text-dark-text mb-2">No GPUs Found</h3>
          <p className="text-dark-text-secondary mb-4">
            We couldn't find any GPUs matching your search criteria.
          </p>
          <Button onClick={handleFilterReset}>Reset Filters</Button>
        </Card>
      )}
    </div>
  );
};

export default GPUMarketplace;
