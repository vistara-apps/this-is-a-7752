import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Monitor, 
  Database,
  CreditCard,
  User,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'GPU Marketplace', icon: ShoppingCart },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor },
    { id: 'environments', label: 'Environments', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleMenuItemClick = (id) => {
    setActiveView(id);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Mobile menu toggle button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden fixed bottom-4 right-4 z-50 bg-accent text-white p-3 rounded-full shadow-lg"
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );

  // Collapsed sidebar with just icons
  const CollapsedSidebar = () => (
    <aside className="w-16 bg-dark-surface border-r border-dark-border min-h-screen flex-shrink-0 transition-all duration-300">
      <div className="p-2 flex justify-center border-b border-dark-border">
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-dark-text-secondary hover:text-dark-text rounded-md"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <nav className="p-2">
        <ul className="space-y-4 pt-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex justify-center">
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === item.id
                      ? 'bg-accent text-white'
                      : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
                  }`}
                  aria-label={item.label}
                  title={item.label}
                >
                  <Icon size={20} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );

  // Full sidebar with labels
  const FullSidebar = () => (
    <aside 
      className={`
        ${isMobile 
          ? 'fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out'
          : 'relative w-64 flex-shrink-0 transition-all duration-300'
        }
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        bg-dark-surface border-r border-dark-border min-h-screen
      `}
    >
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      
      <div className={`${isMobile ? 'z-40 relative w-64 min-h-screen bg-dark-surface' : ''}`}>
        <div className="p-4 flex justify-between items-center border-b border-dark-border">
          <h2 className="text-lg font-semibold text-dark-text">GPU Forge</h2>
          {!isMobile && (
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 text-dark-text-secondary hover:text-dark-text rounded-md"
              aria-label="Collapse sidebar"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      activeView === item.id
                        ? 'bg-accent text-white'
                        : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );

  return (
    <>
      {isOpen ? <FullSidebar /> : <CollapsedSidebar />}
      <MobileMenuButton />
    </>
  );
};

export default Sidebar;
