'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Star,
  X,
  MapPin,
  Clock,
  ChevronDown
} from 'lucide-react';

const Page = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    expertise: [] as string[],
    availability: [] as string[],
    pricing: [] as string[],
    rating: [] as string[]
  });
  const [openDropdown, setOpenDropdown] = useState('');
  const [searchTerms, setSearchTerms] = useState({
    expertise: '',
    availability: '',
    pricing: '',
    rating: ''
  });
  const itemsPerPage = 3;

  const dropdownRefs = {
    expertise: useRef<HTMLDivElement>(null),
    availability: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    rating: useRef<HTMLDivElement>(null)
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.values(dropdownRefs).every(ref =>
        ref.current && !ref.current.contains(event.target as Node)
      );
      if (clickedOutside) setOpenDropdown('');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const experts = [
    {
      id: '1',
      name: 'Dr. Michael Chen',
      expertise: 'AI/ML Research Scientist',
      experience: 'Expert in ML for computer vision, NLP, and natural language processing. 8+ years of experience and top-tier companies.',
      rating: 4.8,
      rate: '$85/hour',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      availability: 'Available Now',
      tags: ['Machine Learning', 'Computer Vision', 'NLP'],
      responseTime: '1 hour',
      completedProjects: 47
    },
    {
      id: '2',
      name: 'Sarah Williams',
      expertise: 'Digital Marketing Strategist',
      experience: 'Expert in B2B marketing, conversion optimization, and conversion optimization. Helped 200+ businesses grow their online presence.',
      rating: 4.9,
      rate: '$65/hour',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b83f4?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      availability: 'Available',
      tags: ['Digital Marketing', 'SEO', 'Analytics'],
      responseTime: '2 hours',
      completedProjects: 132
    },
    {
      id: '3',
      name: 'David Rodriguez',
      expertise: 'UI/UX Design Consultant',
      experience: 'Expert in user research, prototyping, and design systems. Over 10 years of experience, led design at Fortune 500 companies.',
      rating: 4.7,
      rate: '$120/hour',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Austin, TX',
      availability: 'Busy',
      tags: ['UI/UX Design', 'Prototyping', 'Design Systems'],
      responseTime: '4 hours',
      completedProjects: 89
    }
  ];

  const filterOptions = {
    expertise: [
      { name: 'Technology', count: 33 },
      { name: 'Business', count: 28 },
      { name: 'Design', count: 24 },
      { name: 'Marketing', count: 19 },
      { name: 'Arts & Design', count: 30 },
      { name: 'Finance', count: 45 }
    ],
    availability: [
      { name: 'Available Now', count: 31 },
      { name: 'This Week', count: 14 },
      { name: 'This Month', count: 8 },
      { name: 'Future', count: 20 }
    ],
    rating: [
      { name: '5 Stars', count: 12 },
      { name: '4+ Stars', count: 45 },
      { name: '3+ Stars', count: 28 },
      { name: '2+ Stars', count: 8 }
    ],
    pricing: [
      { name: '$1 - $50/hour', count: 25 },
      { name: '$51 - $100/hour', count: 45 },
      { name: '$101 - $200/hour', count: 32 },
      { name: '$200+/hour', count: 15 }
    ]
  };

  const filteredExperts = experts.filter(expert =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expert.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paginatedExperts = filteredExperts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      expertise: [],
      availability: [],
      pricing: [],
      rating: []
    });
  };

  const handleViewProfile = (expertId: string) => {
    router.push(`/search-experts/viewprofile?id=${expertId}`);
  };

  const renderDropdown = (label: string, category: keyof typeof selectedFilters, options: Array<{ name: string; count: number }>) => {
    const searchTerm = searchTerms[category];
    const visibleOptions = searchTerm
      ? options.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;

    return (
      <div className="relative w-44" ref={dropdownRefs[category]}>
        <button
          onClick={() => setOpenDropdown(openDropdown === category ? '' : category)}
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center text-sm text-gray-700 focus:ring-2 focus:ring-primary text-left"
        >
          <span>{label}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {openDropdown === category && (
          <div className="absolute mt-2 w-full z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}`}
              value={searchTerm}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, [category]: e.target.value }))}
              className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
            />
            <div className="max-h-44 overflow-y-auto">
              {visibleOptions.map((opt: { name: string; count: number }) => (
                <label key={opt.name} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters[category].includes(opt.name)}
                      onChange={() => toggleFilter(category, opt.name)}
                      className="mr-2"
                    />
                    <span>{opt.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{opt.count}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFilterBadges = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      {Object.entries(selectedFilters).flatMap(([category, values]) =>
        values.map(value => (
          <span key={`${category}-${value}`} className="bg-value3 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {value}
            <button onClick={() => toggleFilter(category as keyof typeof selectedFilters, value)} className="ml-1 text-primary hover:text-primary/80">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-value3/20 font-sans">
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      </div>
      <div className="bg-gradient-to-r from-primary to-secondary shadow-sm border-b border-gray-200 px-6 py-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Find Domain Experts</h1>
          <p className="text-white/90">Connect with verified experts across fields and topics.</p>
        </div>
      </div>
      <div className="w-full bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center">
          <div className="relative w-full md:w-1/4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search experts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-gray-50"
            />
          </div>
          {renderDropdown('Expertise', 'expertise', filterOptions.expertise)}
          {renderDropdown('Availability', 'availability', filterOptions.availability)}
          {renderDropdown('Pricing', 'pricing', filterOptions.pricing)}
          {renderDropdown('Rating', 'rating', filterOptions.rating)}
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 px-3 py-2 border border-value2 rounded-md hover:bg-value3"
          >
            Clear All
          </button>
          {renderFilterBadges()}
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {paginatedExperts.map(expert => (
          <div key={expert.id} className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-4 hover:shadow-lg transition-shadow">
            <div className="flex gap-4">
              <img src={expert.avatar} alt={expert.name} className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">{expert.name}</h2>
                <p className="text-sm text-primary font-medium">{expert.expertise}</p>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{expert.location}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" />Responds in {expert.responseTime}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{expert.experience}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(expert.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">{`${expert.completedProjects} projects completed`}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expert.tags.map((tag, idx) => (
                    <span key={idx} className="bg-value3 text-primary text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-3">
                <div className="text-xl font-bold text-gray-900">{expert.rate}</div>
                <div className={`inline-block text-xs mt-2 px-2 py-1 rounded-full ${expert.availability === 'Available Now' ? 'bg-success/20 text-success' : expert.availability === 'Available' ? 'bg-secondary/20 text-secondary' : 'bg-danger/20 text-danger'}`}>{expert.availability}</div>
                <div className="flex flex-col gap-3 mt-3 w-full min-w-[180px]">
                  <button className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg">
                    Contact Expert
                  </button>
                  <button 
                    onClick={() => handleViewProfile(expert.id)}
                    className="bg-value3 text-primary px-6 py-3 rounded-lg text-sm font-semibold hover:bg-value2 transition-colors border border-value2"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
