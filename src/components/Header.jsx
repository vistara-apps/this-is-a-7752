import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-dark-surface border-b border-dark-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-dark-text">GPU Forge</h1>
          <span className="text-sm text-dark-text-secondary">
            Instantly rent and use powerful GPUs
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 text-dark-text-secondary hover:text-dark-text transition-colors">
            <Settings size={20} />
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Header;