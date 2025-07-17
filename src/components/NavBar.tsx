'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Upload,
  Search,
  Grid3X3,
  User,
  Users,
  ChevronDown,
  Menu,
  X,
  Bell,
  Settings,
  LayoutDashboard,
  LogOut,
  UserCircle,
  Plus,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: Array<{
    label: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
}

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  // Determine if we're in dashboard mode
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/project-member') || pathname.startsWith('/moderator')|| pathname.startsWith('/domain-expert');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.auth-dropdown')) {
        setIsAuthDropdownOpen(false);
      }
      // Updated condition to exclude the dropdown button
      if (!target.closest('.nav-dropdown') && !target.closest('[data-mobile-dropdown-button]') && activeDropdown !== null) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const publicNavItems: NavItem[] = [
    {
      label: 'Why brainMap?',
      href: '/why-brainMap',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Project Management', href: '/about', description: 'Smart tools & collaboration', icon: <Grid3X3 className="w-4 h-4" /> },
        { label: 'Expert Guidance', href: '/about', description: 'Connect with domain experts', icon: <User className="w-4 h-4" /> },
        { label: 'Community Network', href: '/about', description: 'Join 25,000+ project members', icon: <Users className="w-4 h-4" /> },
      ]
    },
    { label: 'Community', href: '/community' },
    { label: 'Become a Mentor', href: '/becomementor' },
    { label: 'Hire a Mentor', href: '/search-experts' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const dashboardNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Mentoring', href: '/admin/mentoring' },
    { label: 'Community', href: '/community' },
  ];

  const navItems = isDashboard ? dashboardNavItems : publicNavItems;

  const authDropdownItems = [
    { 
      label: 'Dashboard', 
      href: '/admin', 
      icon: <LayoutDashboard className="w-4 h-4" />,
      description: 'View your overview'
    },
    { 
      label: 'Profile', 
      href: '/profile', 
      icon: <UserCircle className="w-4 h-4" />,
      description: 'Manage your profile'
    },
    { 
      label: 'Settings', 
      href: '/settings', 
      icon: <Settings className="w-4 h-4" />,
      description: 'Account preferences'
    },
  ];

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if(!isMobileMenuOpen){
      setSearchQuery('');
    }
  };

  const handleAuthDropdownToggle = () => {
    setIsAuthDropdownOpen(!isAuthDropdownOpen);
  };

  const handleSignOut = () => {
    setIsAuthDropdownOpen(false);
    signOut();
  };

  return (
    <>
      <header className={`z-50 bg-white backdrop-blur-md  ${isDashboard? 'border-b border-gray-200' : 'shadow-lg border-b border-gray-200/50 fixed top-0 left-0 right-0'}`}>
        <nav className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <img
                    src="/image/BrainMap.png"
                    alt="BrainMap Logo"
                    className="w-32 h-12 object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              {!isDashboard && (
                <div className="hidden lg:flex items-center space-x-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    
                    return (
                      <div key={item.label} className="relative group nav-dropdown">
                        {item.hasDropdown ? (
                          <button
                            onClick={() => handleDropdownToggle(item.label)}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative
                              ${item.label === 'Become a Mentor' ? 'font-bold text-primary' : ''}
                              ${activeDropdown === item.label
                                ? 'text-primary bg-primary/10'
                                : isActive
                                  ? 'text-primary'
                                  : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}
                          >
                            {item.label}
                            <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`} />
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative
                              ${item.label === 'Become a Mentor' ? 'font-bold text-primary bg-primary/10 hover:bg-primary/20' : ''}
                              ${isActive
                                ? 'text-primary bg-primary/10'
                                : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}
                          >
                            {item.label}
                            {item.label === 'Become a Mentor' && <Zap className="ml-1 h-4 w-4" />}
                          </Link>
                        )}

                        {/* Dropdown */}
                        {item.hasDropdown && activeDropdown === item.label && (
                          <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                            <div className="p-2">
                              {item.dropdownItems?.map((dropdownItem, index) => (
                                <Link
                                  key={index}
                                  href={dropdownItem.href}
                                  className="flex items-start p-4 rounded-xl hover:bg-primary/10 transition-all duration-200 group"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20">
                                    {dropdownItem.icon}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900 group-hover:text-primary">{dropdownItem.label}</div>
                                    {dropdownItem.description && (
                                      <div className="text-xs text-gray-500 mt-1">{dropdownItem.description}</div>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Dashboard Quick Nav */}
              {isDashboard && (
                <div className="hidden lg:flex items-center space-x-1">
                  {dashboardNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'text-primary bg-primary/10' 
                            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Center Section - Search (Dashboard Mode) */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search projects, mentors, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              
              {/* Dashboard Actions */}
              {isDashboard && (
                <>
                  <button className="bg-primary hover:from-primary/90 hover:to-secondary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create</span>
                  </button>
                  
                  <button className="p-2.5 hover:bg-gray-100 rounded-lg relative transition-all duration-200 group">
                    <HelpCircle className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                  </button>
                </>
              )}

              {/* Notifications */}
              <button className="p-2.5 hover:bg-gray-100 rounded-lg relative transition-all duration-200 group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-primary" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Auth Section */}
              {user ? (
                <div className="relative auth-dropdown">
                  <button
                    onClick={handleAuthDropdownToggle}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <Avatar className='w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white font-semibold'>
                      <AvatarImage src="/default-avatar.png" alt="User Avatar" />
                      <AvatarFallback className="bg-primary">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                      isAuthDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Auth Dropdown */}
                  {isAuthDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
                        <div className="flex items-center gap-3">
                          <Avatar className='w-12 h-12 bg-primary text-white font-semibold'>
                            <AvatarImage src="/default-avatar.png" alt="User Avatar" />
                            <AvatarFallback className="bg-primary">
                              {user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900">{user.name ||user.email}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {authDropdownItems.map((item, index) => (
                          <Link
                            key={index}
                            href={item.href}
                            className="flex items-start p-3 rounded-xl hover:bg-primary/10 transition-all duration-200 group"
                            onClick={() => setIsAuthDropdownOpen(false)}
                          >
                            <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20">
                              {item.icon}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-primary">{item.label}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                            </div>
                          </Link>
                        ))}
                        
                        <div className="my-2 border-t border-gray-200"></div>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-start p-3 rounded-xl hover:bg-red-50 transition-all duration-200 group text-left"
                        >
                          <div className="flex-shrink-0 w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-red-600">Sign Out</div>
                            <div className="text-xs text-red-500 mt-0.5">End your session</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                pathname !== '/login' && pathname !== '/register' && (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Sign In
                    <User className="ml-2 h-4 w-4" />
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileMenuOpen && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200">
            <div className="px-4 py-6 space-y-2">

              {navItems.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <>
                        <button
                        data-mobile-dropdown-button
                          onClick={() => handleDropdownToggle(item.label)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                            isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">{item.label}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.label ? 'rotate-180' : ''
                          }`} />
                        </button>

                        {activeDropdown === item.label && (
                          <div className="ml-4 mt-2 space-y-1">
                            {item.dropdownItems?.map((dropdownItem, index) => (
                              <Link
                                key={index}
                                href={dropdownItem.href}
                                className="flex items-center p-3 text-sm text-gray-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                <div className="w-8 h-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mr-3">
                                  {dropdownItem.icon}
                                </div>
                                <div>
                                  <div className="font-medium">{dropdownItem.label}</div>
                                  {dropdownItem.description && (
                                    <div className="text-xs text-gray-500">{dropdownItem.description}</div>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                          isActive ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-100'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{item.label}</span>
                        {item.label === 'Become a Mentor' && <Zap className="ml-2 h-4 w-4" />}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {!user && (
                  <Link
                    href="/login"
                    className="flex items-center justify-center bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                    <User className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>


    {pathname.startsWith('/community')? <div className="h-16"></div>: null}

    </>
  );
};

export default NavBar;