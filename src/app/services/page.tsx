'use client';

import { useState, useEffect, useRef } from 'react';
import { ServiceCard } from "@/components/domainExpert/ServiceCard"
import { getExpertServices } from "@/services/expertServicesApi"
import { ServiceListCard } from "@/types/serviceListCard"
import { Search, X, ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceListCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    subject: [] as string[],
    priceRange: [] as string[],
    rating: [] as string[]
  });
  const [openDropdown, setOpenDropdown] = useState('');
  const [searchTerms, setSearchTerms] = useState({
    subject: '',
    priceRange: '',
    rating: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [serverSidePageSize, setServerSidePageSize] = useState(10);
  
  // Client-side pagination is used for filtered results
  const itemsPerPage = 6;

  const dropdownRefs = {
    subject: useRef<HTMLDivElement>(null),
    priceRange: useRef<HTMLDivElement>(null),
    rating: useRef<HTMLDivElement>(null)
  };

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching services from backend...");
        // Use 0-indexed page number for backend API
        const result = await getExpertServices(currentPage - 1, serverSidePageSize, 'title');
        console.log(`Received ${result.services.length} services from the API`);
        setServices(result.services);
        setTotalItems(result.totalElements);
        setTotalPages(result.totalPages);
        setServerSidePageSize(result.pageSize);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [currentPage]);

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

  // Generate filter options based on available services
  const getFilterOptions = () => {
    const subjects = new Map<string, number>();
    const priceRanges = new Map<string, number>();
    const ratings = new Map<string, number>();

    services.forEach(service => {
      // Count subjects
      const subject = service.subject;
      subjects.set(subject, (subjects.get(subject) || 0) + 1);

      // Count price ranges
      let priceRange = '';
      if (service.fee <= 50) priceRange = '$1 - $50/hr';
      else if (service.fee <= 100) priceRange = '$51 - $100/hr';
      else if (service.fee <= 200) priceRange = '$101 - $200/hr';
      else priceRange = '$200+/hr';
      priceRanges.set(priceRange, (priceRanges.get(priceRange) || 0) + 1);

      // Count ratings
      let ratingCategory = '';
      if (service.rating >= 5) ratingCategory = '5 Stars';
      else if (service.rating >= 4) ratingCategory = '4+ Stars';
      else if (service.rating >= 3) ratingCategory = '3+ Stars';
      else if (service.rating >= 2) ratingCategory = '2+ Stars';
      else ratingCategory = '1+ Stars';
      ratings.set(ratingCategory, (ratings.get(ratingCategory) || 0) + 1);
    });

    return {
      subject: Array.from(subjects.entries()).map(([name, count]) => ({ name, count })),
      priceRange: [
        { name: '$1 - $50/hr', count: priceRanges.get('$1 - $50/hr') || 0 },
        { name: '$51 - $100/hr', count: priceRanges.get('$51 - $100/hr') || 0 },
        { name: '$101 - $200/hr', count: priceRanges.get('$101 - $200/hr') || 0 },
        { name: '$200+/hr', count: priceRanges.get('$200+/hr') || 0 }
      ],
      rating: [
        { name: '5 Stars', count: ratings.get('5 Stars') || 0 },
        { name: '4+ Stars', count: ratings.get('4+ Stars') || 0 },
        { name: '3+ Stars', count: ratings.get('3+ Stars') || 0 },
        { name: '2+ Stars', count: ratings.get('2+ Stars') || 0 },
        { name: '1+ Stars', count: ratings.get('1+ Stars') || 0 }
      ]
    };
  };

  const filterOptions = getFilterOptions();

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.mentor.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedFilters.subject.length === 0 || 
                          selectedFilters.subject.includes(service.subject);
    
    const matchesPriceRange = selectedFilters.priceRange.length === 0 || 
                             selectedFilters.priceRange.some(priceRange => {
                               switch(priceRange) {
                                 case '$1 - $50/hr': return service.fee <= 50;
                                 case '$51 - $100/hr': return service.fee > 50 && service.fee <= 100;
                                 case '$101 - $200/hr': return service.fee > 100 && service.fee <= 200;
                                 case '$200+/hr': return service.fee > 200;
                                 default: return true;
                               }
                             });
    
    const matchesRating = selectedFilters.rating.length === 0 || 
                         selectedFilters.rating.some(ratingFilter => {
                           switch(ratingFilter) {
                             case '5 Stars': return service.rating >= 5;
                             case '4+ Stars': return service.rating >= 4;
                             case '3+ Stars': return service.rating >= 3;
                             case '2+ Stars': return service.rating >= 2;
                             case '1+ Stars': return service.rating >= 1;
                             default: return true;
                           }
                         });
    
    return matchesSearch && matchesSubject && matchesPriceRange && matchesRating;
  });

  // When we have filtering or search active, we use client-side pagination
  const hasActiveFilters = searchQuery !== '' || 
                          Object.values(selectedFilters).some(filters => filters.length > 0);

  // Use client-side pagination when filters are active
  const paginatedServices = hasActiveFilters
    ? filteredServices.slice(
        0,
        itemsPerPage
      )
    : services;

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      subject: [],
      priceRange: [],
      rating: []
    });
    setSearchQuery('');
    setCurrentPage(1);
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
              value={searchTerms[category]}
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
    const hasFilters = Object.values(selectedFilters).some(filters => filters.length > 0) || searchQuery !== '';
    
    if (!hasFilters) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        {searchQuery && (
          <span className="bg-value3 text-primary text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-medium">
            Search: {searchQuery}
            <button onClick={() => setSearchQuery('')} className="ml-1 text-primary hover:text-primary/80">
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Domain Expert Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with industry-leading experts across various domains to accelerate your projects and business
            growth.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services, subjects, or experts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when search changes
                }}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Services Statistics */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Service Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Services</span>
                  <span className="font-semibold text-gray-900">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Subjects</span>
                  <span className="font-semibold text-gray-900">{filterOptions.subject.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Page</span>
                  <span className="font-semibold text-gray-900">{currentPage} of {totalPages}</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </h3>
              <div className="space-y-4">
                {renderDropdown('Subject', 'subject', filterOptions.subject)}
                {renderDropdown('Price Range', 'priceRange', filterOptions.priceRange)}
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

            {/* Popular Subjects */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Subjects</h3>
              <div className="space-y-2">
                {filterOptions.subject
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((subject) => (
                    <div key={subject.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{subject.name}</span>
                      <span className="text-sm text-gray-500">{subject.count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Main Content - Services Grid */}
          <div className="lg:col-span-3">
            {/* Header with Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Services</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {hasActiveFilters 
                    ? `${filteredServices.length} services match your criteria` 
                    : `Showing ${paginatedServices.length} of ${totalItems} services`}
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : hasActiveFilters && filteredServices.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No services found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? "Try adjusting your search terms or browse different categories."
                    : "No services match your current filters."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && paginatedServices.length > 0 && (
              <div className="text-center mt-8">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Render pagination buttons - show a limited set for large number of pages */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Logic to show pagination around current page
                    let pageToShow = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageToShow = currentPage - 3 + i;
                      }
                      if (currentPage > totalPages - 2) {
                        pageToShow = totalPages - 4 + i;
                      }
                    }
                    // Don't render pages beyond total
                    if (pageToShow <= totalPages) {
                      return (
                        <button
                          key={pageToShow}
                          onClick={() => handlePageChange(pageToShow)}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageToShow 
                              ? 'bg-primary text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageToShow}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 mt-4">
                  {hasActiveFilters 
                    ? `Showing ${Math.min(itemsPerPage, filteredServices.length)} of ${filteredServices.length} filtered services`
                    : `Page ${currentPage} of ${totalPages} (${totalItems} total services)`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
