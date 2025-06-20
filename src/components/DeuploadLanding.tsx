'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, Upload, Users, Shield, Zap, Star, Globe, FileText, TrendingUp } from 'lucide-react';
import CustomButton from './CustomButton'

const DeuploadLanding: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleClick = (action: string) => {
    console.log(`${action} clicked`);
    // Add your navigation logic here
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add your search logic here
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
      

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-20 w-full">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Heading */}
          <div className="mb-12">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Star className="w-5 h-5 text-accent mr-2" />
              <span className="text-value3 font-medium">Trusted by 10,000+ researchers worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
              Connect, collaborate, and track{' '}
              <span className="bg-gradient-to-r from-accent via-info to-accent bg-clip-text text-transparent animate-gradient-x">
              <br />  academic work
              </span>{' '}
              
              with trusted domain experts
            </h1>
            
            <p className="text-xl md:text-xl text-value3 max-w-5xl mx-auto leading-relaxed font-light">
              Deupload is an innovative online file manager built on decentralized cloud storage and IPFS technology, 
              enabling secure storage, seamless sharing, and private collaboration without subscription fees.
            </p>
          </div>

          {/* Enhanced Search Bar */}
                 <div className="mb-10">
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                      <div className="flex items-center border border-gray-300 rounded-xl bg-white px-4 py-3 shadow-sm">
                        <Search className="w-5 h-5 text-gray-500 mr-3" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for files, people, or projects..."
                          className="flex-1 text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none text-base"
                        />
                        {/* <button
                          type="submit"
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition"
                        >
                          Search
                        </button> */}


                        
                        <CustomButton
                          text="Search"
                          type = 'submit'
                          backgroundColor="bg-gradient-to-r from-primary to-secondary"
                          textColor="text-white"
                          hoverBackgroundColor="hover:bg-value1 hover:text-black"
                          onClick={() => handleClick('Get Started')}
                        />
                      </div>
                    </form>
                  </div>

    


           

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <button
              onClick={() => handleClick('Get Started')}
              className="group relative px-10 py-5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl rounded-3xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-xl"
            >
              <span className="flex items-center">
                <Upload className="w-6 h-6 mr-3" />
                Get Started Free
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </button>
            
            <button
              onClick={() => handleClick('Pricing')}
              className="px-10 py-5 bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white font-bold text-xl rounded-3xl border-2 border-white/30 hover:border-accent/50 transition-all duration-500 transform hover:scale-110 shadow-xl"
            >
              <span className="flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                View Pricing
              </span>
            </button>
          </div>


          
        </div>
      </main>

    </div>
  );
};

export default DeuploadLanding;