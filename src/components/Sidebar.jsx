import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Monitor, 
  Database,
  CreditCard,
  User
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'GPU Marketplace', icon: ShoppingCart },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor },
    { id: 'environments', label: 'Environments', icon: Database },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-dark-surface border-r border-dark-border min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
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
    </aside>
  );
};

export default Sidebar;