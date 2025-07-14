'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Star,
  X,
  MapPin,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  Award,
  TrendingUp,
  Plus,
  CheckCircle
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
  const itemsPerPage = 5;

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
      experience: 'Leading researcher in machine learning with expertise in computer vision, NLP, and deep learning architectures. Published 50+ papers in top-tier conferences.',
      rating: 5.0,
      rate: '$85/hour',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      availability: 'Available Today',
      tags: ['Machine Learning', 'Computer Vision', 'NLP', 'Deep Learning'],
      responseTime: '1 hour',
      completedProjects: 47,
      verified: true,
      field: 'Technology'
    },
    {
      id: '2',
      name: 'Sarah Williams',
      expertise: 'Digital Marketing Strategist',
      experience: 'Growth marketing expert with 8+ years helping startups and enterprises scale. Specialized in conversion optimization and data-driven strategies.',
      rating: 4.9,
      rate: '$65/hour',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b83f4?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      availability: 'Available This Week',
      tags: ['Digital Marketing', 'SEO', 'Analytics', 'Growth Hacking'],
      responseTime: '2 hours',
      completedProjects: 132,
      verified: true,
      field: 'Marketing'
    },
    {
      id: '3',
      name: 'David Rodriguez',
      expertise: 'UI/UX Design Consultant',
      experience: 'Senior design leader with Fortune 500 experience. Expert in user research, design systems, and creating intuitive digital experiences.',
      rating: 4.0,
      rate: '$120/hour',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Austin, TX',
      availability: 'Busy',
      tags: ['UI/UX Design', 'Prototyping', 'Design Systems', 'User Research'],
      responseTime: '4 hours',
      completedProjects: 89,
      verified: false,
      field: 'Design'
    },
    {
      id: '4',
      name: 'Dr. Emily Thompson',
      expertise: 'Business Strategy Consultant',
      experience: 'Former McKinsey consultant specializing in digital transformation and operational excellence. Helped 100+ companies optimize their processes.',
      rating: 5.0,
      rate: '$150/hour',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      location: 'Chicago, IL',
      availability: 'Available Today',
      tags: ['Strategy', 'Operations', 'Digital Transformation', 'Process Optimization'],
      responseTime: '30 minutes',
      completedProjects: 78,
      verified: true,
      field: 'Business'
    },
    {
      id: '5',
      name: 'Prof. James Wilson',
      expertise: 'Financial Markets Analyst',
      experience: 'Investment banking veteran with 15+ years in quantitative analysis and portfolio management. Expert in risk assessment and financial modeling.',
      rating: 3.0,
      rate: '$95/hour',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      location: 'London, UK',
      availability: 'Available This Week',
      tags: ['Finance', 'Investment', 'Risk Analysis', 'Portfolio Management'],
      responseTime: '3 hours',
      completedProjects: 63,
      verified: false,
      field: 'Finance'
    },
    {
      id: '6',
      name: 'Lisa Martinez',
      expertise: 'Creative Director',
      experience: 'Award-winning creative director with expertise in brand development, visual storytelling, and multimedia campaigns for global brands.',
      rating: 4.5,
      rate: '$110/hour',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      location: 'Los Angeles, CA',
      availability: 'Available Today',
      tags: ['Creative Direction', 'Branding', 'Visual Design', 'Campaign Strategy'],
      responseTime: '2 hours',
      completedProjects: 94,
      verified: true,
      field: 'Arts & Design'
    },
    {
      id: '7',
      name: 'Dr. Ahmed Hassan',
      expertise: 'Cybersecurity Architect',
      experience: 'Cybersecurity expert with 12+ years protecting enterprise infrastructure. Specialized in threat assessment, penetration testing, and security compliance frameworks.',
      rating: 4.8,
      rate: '$130/hour',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
      location: 'Dubai, UAE',
      availability: 'Available Today',
      tags: ['Cybersecurity', 'Penetration Testing', 'Compliance', 'Risk Assessment'],
      responseTime: '45 minutes',
      completedProjects: 156,
      verified: true,
      field: 'Technology'
    },
    {
      id: '8',
      name: 'Maria Gonzalez',
      expertise: 'Product Management Lead',
      experience: 'Senior product manager with experience at Fortune 100 companies. Expert in product strategy, roadmapping, and cross-functional team leadership.',
      rating: 4.2,
      rate: '$115/hour',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      location: 'Barcelona, Spain',
      availability: 'Available This Week',
      tags: ['Product Management', 'Strategy', 'Agile', 'Team Leadership'],
      responseTime: '3 hours',
      completedProjects: 73,
      verified: true,
      field: 'Business'
    },
    {
      id: '9',
      name: 'Robert Kim',
      expertise: 'Data Science Consultant',
      experience: 'PhD in Statistics with expertise in machine learning, predictive modeling, and big data analytics. Helped 50+ companies leverage data for strategic decisions.',
      rating: 2.5,
      rate: '$140/hour',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Seoul, South Korea',
      availability: 'Busy',
      tags: ['Data Science', 'Machine Learning', 'Analytics', 'Python'],
      responseTime: '5 hours',
      completedProjects: 92,
      verified: false,
      field: 'Technology'
    },
    {
      id: '10',
      name: 'Sophie Laurent',
      expertise: 'Content Strategy Director',
      experience: 'Award-winning content strategist with 10+ years creating compelling narratives for global brands. Expert in content marketing and brand storytelling.',
      rating: 3.5,
      rate: '$90/hour',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b83f4?w=150&h=150&fit=crop&crop=face',
      location: 'Paris, France',
      availability: 'Available This Week',
      tags: ['Content Strategy', 'Brand Storytelling', 'Marketing', 'Creative Writing'],
      responseTime: '2 hours',
      completedProjects: 118,
      verified: true,
      field: 'Marketing'
    },
    {
      id: '11',
      name: 'Dr. Priya Sharma',
      expertise: 'Healthcare Innovation Consultant',
      experience: 'Medical doctor turned healthcare consultant specializing in digital health solutions and medical device development. Published researcher in health tech.',
      rating: 4.7,
      rate: '$160/hour',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      location: 'Mumbai, India',
      availability: 'Available Today',
      tags: ['Healthcare', 'Digital Health', 'Medical Devices', 'Innovation'],
      responseTime: '1 hour',
      completedProjects: 67,
      verified: true,
      field: 'Healthcare'
    },
    {
      id: '12',
      name: 'Thomas Mueller',
      expertise: 'Sustainability Consultant',
      experience: 'Environmental engineer with expertise in sustainable business practices, carbon footprint reduction, and green technology implementation.',
      rating: 1.5,
      rate: '$105/hour',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'Berlin, Germany',
      availability: 'Available This Week',
      tags: ['Sustainability', 'Environmental Consulting', 'Green Technology', 'Carbon Reduction'],
      responseTime: '4 hours',
      completedProjects: 45,
      verified: false,
      field: 'Environmental'
    }
  ];

  const filterOptions = {
    expertise: [
      { name: 'Technology', count: 3 },
      { name: 'Business', count: 2 },
      { name: 'Design', count: 1 },
      { name: 'Marketing', count: 2 },
      { name: 'Arts & Design', count: 1 },
      { name: 'Finance', count: 1 },
      { name: 'Healthcare', count: 1 },
      { name: 'Environmental', count: 1 }
    ],
    availability: [
      { name: 'Available Today', count: 5 },
      { name: 'Available This Week', count: 5 },
      { name: 'Busy', count: 2 }
    ],
    rating: [
      { name: '5 Stars', count: 2 },
      { name: '4+ Stars', count: 5 },
      { name: '3+ Stars', count: 2 },
      { name: '2+ Stars', count: 1 },
      { name: '1+ Stars', count: 1 }
    ],
    pricing: [
      { name: '$1 - $50/hour', count: 0 },
      { name: '$51 - $100/hour', count: 3 },
      { name: '$101 - $200/hour', count: 9 },
      { name: '$200+/hour', count: 0 }
    ]
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.expertise.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         expert.experience.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesExpertise = selectedFilters.expertise.length === 0 || 
                            selectedFilters.expertise.some(filter => expert.field === filter);
    
    const matchesAvailability = selectedFilters.availability.length === 0 || 
                               selectedFilters.availability.includes(expert.availability);
    
    const matchesPricing = selectedFilters.pricing.length === 0 || 
                          selectedFilters.pricing.some(priceRange => {
                            const rate = parseInt(expert.rate.replace('$', '').replace('/hour', ''));
                            switch(priceRange) {
                              case '$1 - $50/hour': return rate <= 50;
                              case '$51 - $100/hour': return rate > 50 && rate <= 100;
                              case '$101 - $200/hour': return rate > 100 && rate <= 200;
                              case '$200+/hour': return rate > 200;
                              default: return true;
                            }
                          });
    
    const matchesRating = selectedFilters.rating.length === 0 || 
                         selectedFilters.rating.some(ratingFilter => {
                           switch(ratingFilter) {
                             case '5 Stars': return expert.rating >= 5;
                             case '4+ Stars': return expert.rating >= 4;
                             case '3+ Stars': return expert.rating >= 3;
                             case '2+ Stars': return expert.rating >= 2;
                             case '1+ Stars': return expert.rating >= 1;
                             default: return true;
                           }
                         });
    
    return matchesSearch && matchesExpertise && matchesAvailability && matchesPricing && matchesRating;
  });

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
      <div className="relative" ref={dropdownRefs[category]}>
        <button
          onClick={() => setOpenDropdown(openDropdown === category ? '' : category)}
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex justify-between items-center text-sm text-gray-700 focus:ring-2 focus:ring-primary hover:border-gray-300 transition-colors"
        >
          <span className="truncate text-left">{label}</span>
          <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${openDropdown === category ? 'rotate-180' : ''}`} />
        </button>
        {openDropdown === category && (
          <div className="absolute mt-1 w-full z-20 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-hidden">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}`}
              value={searchTerm}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, [category]: e.target.value }))}
              className="w-full px-3 py-2 text-sm border-b border-gray-100 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="max-h-32 overflow-y-auto">
              {visibleOptions.map((opt: { name: string; count: number }) => (
                <label key={opt.name} className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedFilters[category].includes(opt.name)}
                      onChange={() => toggleFilter(category, opt.name)}
                      className="mr-2 flex-shrink-0 text-primary"
                    />
                    <span className="truncate text-gray-700">{opt.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">({opt.count})</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFilterBadges = () => {
    const hasFilters = Object.values(selectedFilters).some(filters => filters.length > 0);
    
    if (!hasFilters) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        {Object.entries(selectedFilters).flatMap(([category, values]) =>
          values.map(value => (
            <span key={`${category}-${value}`} className="bg-value3 text-primary text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
              {value}
              <button onClick={() => toggleFilter(category as keyof typeof selectedFilters, value)} className="ml-1 text-primary hover:text-primary/80">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 mt-16">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Users className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Hire Domain Experts</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search experts, skills, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <h3 className="font-semibold text-gray-900 mb-3">Expert Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Total Registered Experts</span>
                  </div>
                  <span className="font-semibold text-gray-900">{experts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Verified Experts</span>
                  </div>
                  <span className="font-semibold text-gray-900">{experts.filter(expert => expert.verified).length}</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </h3>
              <div className="space-y-4">
                {renderDropdown('Expertise', 'expertise', filterOptions.expertise)}
                {renderDropdown('Availability', 'availability', filterOptions.availability)}
                {renderDropdown('Hourly Rates', 'pricing', filterOptions.pricing)}
                {renderDropdown('Rating', 'rating', filterOptions.rating)}
                <button
                  onClick={clearAllFilters}
                  className="w-full text-sm text-primary hover:text-primary/80 px-3 py-2 border border-primary/20 rounded-md hover:bg-primary/5 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
              {renderFilterBadges()}
            </div>

            {/* Top Expertise Areas */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Expertise</h3>
              <div className="space-y-2">
                {filterOptions.expertise.map((field) => (
                  <div key={field.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{field.name}</span>
                    <span className="text-sm text-gray-500">{field.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header with Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Experts</h2>
                <p className="text-gray-600 text-sm mt-1">{filteredExperts.length} experts match your criteria</p>
              </div>
            </div>

            {/* Experts List */}
            <div className="space-y-4">
              {paginatedExperts.length > 0 ? (
                paginatedExperts.map(expert => (
                  <div key={expert.id} className="bg-white shadow-none border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <img 
                          src={expert.avatar} 
                          alt={expert.name} 
                          className="w-16 h-16 rounded-full object-cover flex-shrink-0 mx-auto sm:mx-0" 
                        />
                        
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
                            <div className="text-center sm:text-left">
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 flex items-center justify-center sm:justify-start gap-2">
                                {expert.name}
                                {expert.verified && (
                                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                )}
                              </h3>
                              <p className="text-sm text-primary font-medium">{expert.expertise}</p>
                            </div>
                            <div className="text-center sm:text-right">
                              <div className="text-xl font-bold text-gray-900">{expert.rate}</div>
                              <div className={`inline-block text-xs mt-1 px-3 py-1 rounded-full ${
                                expert.availability === 'Available Today' 
                                  ? 'bg-green-100 text-green-800' 
                                  : expert.availability === 'Available This Week' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {expert.availability}
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500 flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-4 mb-2 text-center sm:text-left">
                            <span className="flex items-center justify-center sm:justify-start">
                              <MapPin className="w-4 h-4 mr-1" />
                              {expert.location}
                            </span>
                            <span className="flex items-center justify-center sm:justify-start">
                              <Clock className="w-4 h-4 mr-1" />
                              Average response time: {expert.responseTime}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed mb-4 text-center sm:text-left">
                            {expert.experience}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                              {expert.tags.map((tag, idx) => (
                                <span 
                                  key={idx} 
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-gray-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-center sm:justify-end space-x-3 text-sm text-gray-500">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => {
                                  const starNumber = i + 1;
                                  const isFilled = starNumber <= Math.floor(expert.rating);
                                  const isPartial = starNumber === Math.ceil(expert.rating) && expert.rating % 1 !== 0;
                                  
                                  return (
                                    <div key={i} className="relative">
                                      <Star 
                                        className="w-4 h-4 text-gray-300" 
                                      />
                                      {(isFilled || isPartial) && (
                                        <Star 
                                          className={`w-4 h-4 text-yellow-400 fill-current absolute top-0 left-0 ${
                                            isPartial ? 'overflow-hidden' : ''
                                          }`}
                                          style={isPartial ? {
                                            width: `${(expert.rating % 1) * 100}%`,
                                            clipPath: `polygon(0 0, ${(expert.rating % 1) * 100}% 0, ${(expert.rating % 1) * 100}% 100%, 0 100%)`
                                          } : {}}
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                                <span className="text-sm text-gray-600 ml-1">{expert.rating}</span>
                              </div>
                              <span>•</span>
                              <span>{expert.completedProjects} projects</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start mt-4 pt-4 border-t border-gray-100 space-y-2 sm:space-y-0 sm:space-x-4">
                            <button className="w-full sm:w-auto bg-primary text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                              Contact Expert
                            </button>
                            <button 
                              onClick={() => handleViewProfile(expert.id)}
                              className="w-full sm:w-auto text-gray-500 text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">No experts found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery
                        ? "Try adjusting your search terms or browse different categories."
                        : "No experts match your current filters."}
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      <X className="w-4 h-4 mr-2 inline" />
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredExperts.length > itemsPerPage && (
              <div className="text-center mt-8">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: Math.ceil(filteredExperts.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        currentPage === page 
                          ? 'bg-primary text-white' 
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredExperts.length / itemsPerPage), currentPage + 1))}
                    disabled={currentPage === Math.ceil(filteredExperts.length / itemsPerPage)}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 mt-4">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredExperts.length)} of {filteredExperts.length} experts
                </div>
              </div>
            )}

            {/* Load More Button (alternative to pagination) */}
            {filteredExperts.length > paginatedExperts.length && currentPage * itemsPerPage < filteredExperts.length && (
              <div className="text-center mt-8">
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="text-blue-600 hover:text-blue-700 border border-blue-200 px-6 py-2 rounded-lg"
                >
                  Load More Experts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
