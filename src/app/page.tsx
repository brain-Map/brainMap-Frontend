'use client';

import React, { useState } from 'react';
import ErrorDialog from '../components/modals/ErrorDialogModal';
import NavBar from '../components/NavBar.Model'
import CustomButton from '../components/CustomButtonModel';
import JoinCommunity from '../components/JoinCommunity';
import ExpertsFeatures from '../components/ExpertsFeatures';
import ConnectLearnAchieveHero from '../components/ConnectLearnAchievePoster';
import PopularServices from '../components/Carousel'
import { ArrowRight, Download, Play, Plus, Heart,Star,Send, Settings,TrendingUp,
  Search, ChevronRight, Upload, Users, Shield, Zap,  Globe, FileText
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';


const Home: React.FC = () => {


    const [searchQuery, setSearchQuery] = useState<string>('');
  
  
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Searching for:', searchQuery);
      // Add your search logic here
    };


    
    const handleClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked!`);
  };




  interface SuccessStory {
  id: string;
  title: string;
  image: string;
  alt: string;
  readMoreLink: string;
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    title: 'Mastering Research Methodologies with Mentor Support',
    image: '/image/research-mentor.jpeg',
    alt: 'Student working on laptop with mentor support',
    readMoreLink: '/success-stories/research-methodologies'
  },
  {
    id: '2',
    title: 'Tracking Academic Progress in Group Projects',
    image: '/image/group-progress.jpg',
    alt: 'Student tracking academic progress on laptop',
    readMoreLink: '/success-stories/group-projects'
  },
  {
    id: '3',
    title: 'Enhancing Thesis Writing with Real-Time Expert Feedback',
    image: '/image/thesis-writing.jpg',
    alt: 'Student writing thesis with expert feedback',
    readMoreLink: '/success-stories/thesis-writing'
  }
];




  return (

    <>
    <NavBar/>


{/* Hero section */}
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


    {/* Hero section */}

    

<PopularServices className='mt-16'/>



{/* metor Join */}

<div className="py-16 min-h-screen bg-gray-50">
      {/* Top Section - Academic Growth Partner */}
      <div className="bg-white ">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Left side - Image */}
            <div className="lg:w-1/2">
              <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Video Call Interface</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:w-1/2 space-y-6">
              <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  Your academic growth partner — anytime, anywhere.
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Connect with trusted domain experts for personalized academic guidance, 
                  collaborate seamlessly in real time on assignments and research, and monitor 
                  your academic progress — all within a simple, secure, and ethically-driven 
                  platform designed to support your learning journey.
                </p>

                <CustomButton
                text="Learn More"
                backgroundColor="bg-secondary"
                textColor="text-gray-800"
                hoverBackgroundColor="hover:bg-info"
                icon={ArrowRight}
                onClick={() => handleClick('Get Started')}
              />



              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Become a Mentor */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto ">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                Want to Become a Mentor on brainMap?
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Share your expertise, guide students ethically, and contribute to academic 
                success — all while growing your reputation and earning income on BrainMap's 
                trusted platform.
              </p>

              <CustomButton
                text="Join Now"
                backgroundColor="bg-secondary"
                textColor="text-gray-800"
                hoverBackgroundColor="hover:bg-info"
                icon={ArrowRight}
                onClick={() => handleClick('Get Started')}
              />

            </div>

            {/* Right side - Professional Image */}
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden shadow-xl">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">Professional Mentor</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  {/* mentor Join */}



{/* success strory */}
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What success on brainMap looks like
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real connections with trusted mentors, smarter project collaboration, 
            and a clear path toward your academic goals — all within BrainMap.
          </p>
        </div>

        {/* Success Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <div 
              key={story.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Image Container */}
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                  {story.title}
                </h3>
                
                <Link 
                  href={story.readMoreLink}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
                >
                  Readmore
                  <svg 
                    className="ml-2 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


  {/* success story */}


<JoinCommunity/>
<ExpertsFeatures/>
<ConnectLearnAchieveHero/>




    </>
  );
};

export default Home;