import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Bell, Settings, ChevronDown, User, LogOut } from 'lucide-react';

const Header = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  return (
    <header className="bg-dark-surface border-b border-dark-border px-4 md:px-6 py-3 md:py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <h1 className="text-lg md:text-xl font-semibold text-dark-text">GPU Forge</h1>
          <span className="hidden sm:inline text-xs md:text-sm text-dark-text-secondary">
            Instantly rent and use powerful GPUs
          </span>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile-optimized connect button */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>
          
          <div className="md:hidden">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;
                
                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button 
                            onClick={openConnectModal} 
                            className="bg-accent text-white px-3 py-1.5 rounded-md text-sm font-medium"
                          >
                            Connect
                          </button>
                        );
                      }
                      
                      return (
                        <button
                          onClick={openAccountModal}
                          className="bg-dark-bg border border-dark-border text-dark-text px-2 py-1 rounded-md text-sm"
                        >
                          {account.displayName.substring(0, 4)}...
                        </button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <button 
              className="p-1.5 md:p-2 text-dark-text-secondary hover:text-dark-text transition-colors rounded-md hover:bg-dark-border"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            <div className="relative">
              <button 
                className="p-1.5 md:p-2 text-dark-text-secondary hover:text-dark-text transition-colors rounded-md hover:bg-dark-border"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-md shadow-lg py-1 z-50">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-dark-text hover:bg-dark-border">
                    <User size={16} className="mr-2 text-dark-text-secondary" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-dark-text hover:bg-dark-border">
                    <Settings size={16} className="mr-2 text-dark-text-secondary" />
                    Settings
                  </button>
                  <div className="border-t border-dark-border my-1"></div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-border">
                    <LogOut size={16} className="mr-2" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
