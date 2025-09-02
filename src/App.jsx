import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GPUMarketplace from './components/GPUMarketplace';
import SessionManager from './components/SessionManager';
import EnvironmentTemplates from './components/EnvironmentTemplates';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'marketplace':
        return <GPUMarketplace />;
      case 'sessions':
        return <SessionManager />;
      case 'environments':
        return <EnvironmentTemplates />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default App;