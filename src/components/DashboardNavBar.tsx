'use client';
import React, { useState } from 'react';
import { 
  Menu, 
  Grid3X3, 
  Search, 
  Plus, 
  Bell, 
  HelpCircle, 
  Settings,
  ChevronDown
} from 'lucide-react';

const DashboardNavBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Menu Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

    

          <div className="w-35 h-10 flex items-center justify-center">
                  <img
                  src="/image/BrainMap.png"
                  alt="BrainMap Logo"
                  className="w-40 h-16 object-contain"
                  style={{ background: 'transparent' }}
                  />
                </div>

        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Create Button */}
          <button className="bg-primary hover:bg-secondary text-white hover:text-black px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>

          {/* Notification Bell */}
          <button className="p-2 hover:bg-gray-100 rounded-md relative transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Help */}
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center">
            <button className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-md transition-colors">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">NM</span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavBar;