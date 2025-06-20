'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

// SVG Icons as components
const ChevronDownIcon = () => (
  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const GridIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
); 

const UserIcon = () => (
  <svg
  className="ml-2 h-4 w-4"
  fill="none"
  stroke="currentColor"
  strokeWidth={2}
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
</svg>


);

const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { label: 'Why brainMap?', href: '/why-brainmap', hasDropdown: true },
    { label: 'Features', href: '/features', hasDropdown: true },
    { label: 'Community', href: '/community', hasDropdown: true },
    { label: 'brainMap Blog', href: '/blog', hasDropdown: true },
    { label: 'Pricing', href: '/pricing', hasDropdown: true },
  ];

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <nav className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between ">
        <div className="flex items-center h-16 ">
          {/* Logo */}
          <div className=" w-35 h-16  flex items-center justify-center">
            <Link href="/" className="flex items-center flex-col">
              
              <img src="/image/BrainMap.png" alt="brainMap.logo" className="w-full h-full" />
              
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => item.hasDropdown && handleDropdownToggle(item.label)}
                    className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDownIcon />
                    )}
                  </button>
                  
                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          href={`${item.href}/option1`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Option 1
                        </Link>
                        <Link
                          href={`${item.href}/option2`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Option 2
                        </Link>
                        <Link
                          href={`${item.href}/option3`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Option 3
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <GridIcon />
            </button>
          </div>
        </div>

        {/* Right side icons and sign in */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-black hover:text-gray-600 bg-gray-100 p-2 rounded-md transition-colors duration-200">
              <SearchIcon />
            </button>

            {/* Grid Icon */}
            <button className="text-black hover:text-gray-600 bg-gray-100 p-2 rounded-md transition-colors duration-200">
              <GridIcon />
            </button>

            {/* Sign In Button */}
            <Link
              href="/signin"
              className="flex items-center bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Sign In
              <UserIcon />
            </Link>
          </div>

      </nav>
    </header>
  );
};

export default Navbar;