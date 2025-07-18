import React from 'react';

export interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const SummaryCard: React.FC<DashboardCardProps> = ({ title, value, change, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-green-600">{change}</span>
        <span className="text-sm text-gray-600"> from last month</span>
      </div>
    </div>
  );
};

export default SummaryCard;
