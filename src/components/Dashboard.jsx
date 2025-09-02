import React from 'react';
import { TrendingUp, Clock, DollarSign, Zap } from 'lucide-react';
import StatsCard from './StatsCard';
import UsageChart from './UsageChart';
import ActiveSessionsList from './ActiveSessionsList';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Spent',
      value: '$247.50',
      change: '+12%',
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      title: 'Hours Used',
      value: '156.2h',
      change: '+8%',
      changeType: 'positive',
      icon: Clock,
    },
    {
      title: 'Active Sessions',
      value: '3',
      change: '0%',
      changeType: 'neutral',
      icon: Zap,
    },
    {
      title: 'Performance',
      value: '94.2%',
      change: '+2%',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-dark-text mb-2">Dashboard</h2>
        <p className="text-dark-text-secondary">
          Monitor your GPU usage and manage your compute resources
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UsageChart />
        </div>
        <div>
          <ActiveSessionsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;