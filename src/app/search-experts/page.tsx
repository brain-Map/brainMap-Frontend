'use client';
import React, { useState } from 'react';
import { Search, Star, User, Filter, X, ChevronLeft, ChevronRight, MapPin, Clock, DollarSign } from 'lucide-react';
import Navbar from '@/components/NavBarModel';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<{
    expertise: string[];
    availability: string[];
    pricing: string[];
    rating: string[];
  }>({
    expertise: [],
    availability: [],
    pricing: [],
    rating: []
  });
  const itemsPerPage = 3;

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
    },
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
    ]
  };

  const filteredExperts = experts.filter((expert) =>
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available Now': return 'text-green-600 bg-green-50';
      case 'Available': return 'text-blue-600 bg-blue-50';
      case 'Busy': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <Navbar />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Find Domain Experts</h1>
          <p className="text-gray-600">Connect with verified experts across fields and topics.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex gap-6 p-6">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-20">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h2>
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Search Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Search Filters</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, Finance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Expertise Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Expertise</h3>
              <div className="space-y-2.5">
                {filterOptions.expertise.map((option) => (
                  <label key={option.name} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.expertise.includes(option.name)}
                        onChange={() => toggleFilter('expertise', option.name)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {option.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="space-y-2.5">
                {filterOptions.availability.map((option) => (
                  <label key={option.name} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.availability.includes(option.name)}
                        onChange={() => toggleFilter('availability', option.name)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {option.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing Range */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Pricing Range</h3>
              <div className="space-y-2.5">
                {[
                  { range: '$1 - $50/hour', count: 25 },
                  { range: '$51 - $100/hour', count: 45 },
                  { range: '$101 - $200/hour', count: 32 },
                  { range: '$200+/hour', count: 15 }
                ].map((option) => (
                  <label key={option.range} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.pricing?.includes(option.range)}
                        onChange={() => toggleFilter('pricing', option.range)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm text-gray-700">{option.range}</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {option.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
              <div className="space-y-2.5">
                {filterOptions.rating.map((option) => (
                  <label key={option.name} className="flex items-center justify-between hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.rating.includes(option.name)}
                        onChange={() => toggleFilter('rating', option.name)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="ml-3 flex items-center">
                        <span className="text-sm text-gray-700 mr-2">{option.name}</span>
                        <div className="flex">
                          {Array.from({ length: parseInt(option.name) }, (_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                          {option.name.includes('+') && (
                            <span className="text-xs text-gray-500 ml-1">& up</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {option.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Advanced Filters</h3>
              <div className="space-y-2.5">
                <label className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">Pro Badge</span>
                </label>
                <label className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">Verified Expert</span>
                </label>
                <label className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm text-gray-700">Fast Response</span>
                </label>
              </div>
            </div>

            {/* Apply Filters Button */}
            <button className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              {filteredExperts.length} experts found
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
              >
                <option>Relevance</option>
                <option>Rating</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="space-y-4">
            {paginatedExperts.map((expert) => (
              <div key={expert.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={expert.avatar}
                    alt={`${expert.name}'s avatar`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
                        <p className="text-blue-600 font-medium text-sm">{expert.expertise}</p>
                        <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {expert.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Responds in {expert.responseTime}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">{expert.rate}</div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(expert.availability)}`}>
                          {expert.availability}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                      {expert.experience}
                    </p>

                    <div className="flex items-center mt-3 space-x-4">
                      <div className="flex items-center">
                        {renderStars(expert.rating)}
                        <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {expert.completedProjects} projects completed
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-2">
                        {expert.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
                          View Profile
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * itemsPerPage >= filteredExperts.length}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;