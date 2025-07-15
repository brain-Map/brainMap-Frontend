'use client';

import React, { useState } from 'react';
import CustomButton from '../components/CustomButtonModel';
import JoinCommunity from '../components/JoinCommunity';
import ExpertsFeatures from '../components/ExpertsFeatures';
import ConnectLearnAchieveHero from '../components/ConnectLearnAchievePoster';
import PopularServices from '../components/Carousel'
import { ArrowRight, PlayCircle, CheckCircle, Shield, Users,TrendingUp, Star
} from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'; // Adjust the import path as necessary


const Home: React.FC = () => {


    const [searchQuery, setSearchQuery] = useState<string>('');
    const { user } = useAuth(); // Access the user from AuthContext
    const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    console.log('Get started clicked');
  };

  const handleSubscribe = () => {
    console.log('Email subscription:', email);
  };

    
    const handleClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked!`);
  };

  // console.log(user);




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
    title: 'Streamlining Product Development with Expert Mentorship',
    image: '/image/research-mentor.jpeg',
    alt: 'Team collaborating on project with mentor support',
    readMoreLink: '/success-stories/product-development'
  },
  {
    id: '2',
    title: 'Managing Complex Projects with Kanban Boards',
    image: '/image/group-progress.jpg',
    alt: 'Team tracking project progress with kanban boards',
    readMoreLink: '/success-stories/project-management'
  },
  {
    id: '3',
    title: 'Accelerating Startup Growth with Domain Expert Guidance',
    image: '/image/thesis-writing.jpg',
    alt: 'Entrepreneurs receiving expert feedback on business strategy',
    readMoreLink: '/success-stories/startup-growth'
  }
];




  return (

    <>
{/* Hero section */}
 <div className="min-h-screen bg-gradient-to-br from-secondary/50 via-value3/50 to-secondary/50 flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid grid-cols-[2fr_1fr] gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Manage, collaborate, and track any project {' '}
                <span className="text-primary">with expert mentorship</span>
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                  BrainMap is the universal project management platform that connects any project team with verified domain experts.
                  </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </div>
                <div className="ml-2">
                  <div className="text-xl font-bold text-gray-900">64,739</div>
                  <div className="text-sm text-gray-500">Happy customers</div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="flex border-r border-gray-300 pr-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="ml-2">
                  <div className="text-xl font-bold text-gray-900 pl-5">4.9/5</div>
                  <div className="text-sm text-gray-500 pl-5">App Store Rating</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-primary hover:bg-secondary text-white hover:text-black font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Let's Start with BrainMap
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Mockup Section */}



          <div className="relative">
            {/* Browser Mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Browser Header */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 bg-white rounded-lg px-3 py-1 text-sm text-gray-500 flex-1">
                    app.brainmap.com
                  </div>
                </div>
              </div>

              {/* App Interface */}
              <div className="p-6 h-96 bg-gradient-to-br from-purple-50 to-blue-50">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Good Morning!</h3>
                    <p className="text-gray-600">Let's make today productive</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">JD</span>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-500">Active Projects</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-gray-500">Completion Rate</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">24</div>
                    <div className="text-sm text-gray-500">Team Members</div>
                  </div>
                </div>

                {/* Project List */}
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Website Redesign</div>
                        <div className="text-sm text-gray-500">Due in 3 days</div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold">75%</div>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-purple-600 rounded"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Mobile App MVP</div>
                        <div className="text-sm text-gray-500">Due in 1 week</div>
                      </div>
                    </div>
                    <div className="text-blue-600 font-semibold">45%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-60 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 rounded-full opacity-60 blur-xl"></div>
            
            {/* Floating notification */}
            <div className="absolute -right-8 top-20 bg-white rounded-xl shadow-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Task completed!</span>
              </div>
            </div>
          </div>





        </div>

        {/* Bottom Features */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ultimate features & amazing tools to boost your productivity
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Monitor your team seamlessly</h3>
              <p className="text-gray-600">Track team progress in real-time with detailed analytics and performance insights.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Boost productivity & efficiency</h3>
              <p className="text-gray-600">Streamline workflows and eliminate bottlenecks with intelligent automation.</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">All-in-one project health hub</h3>
              <p className="text-gray-600">Keep your projects on track with comprehensive health monitoring and expert guidance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>    {/* Hero section */}

    

<PopularServices className='mt-16'/>



{/* metor Join */}

<div className="py-16 min-h-screen bg-gray-50">
      {/* Top Section - Project Success Partner */}
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
                  Your project success partner — anytime, anywhere.
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Connect with verified domain experts for personalized project guidance, 
                  collaborate seamlessly in real-time with your team, and track your progress 
                  with powerful kanban boards and milestone tracking — all within a secure, 
                  intuitive platform designed to help any project succeed.
                </p>

                <CustomButton
                text="Learn More"
                backgroundColor="bg-primary"
                textColor="text-white"
                hoverBackgroundColor="hover:bg-secondary hover:text-black"
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
                Want to Become an Expert on brainMap?
              </h2>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Share your expertise across any domain, guide teams and individuals 
                on their projects, and build your reputation while earning income on 
                BrainMap's trusted platform for project mentorship.
              </p>

              <CustomButton
                text="Join Now"
                backgroundColor="bg-primary"
                textColor="text-white"
                hoverBackgroundColor="hover:bg-secondary hover:text-black"
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
                      <p className="text-gray-600 font-medium">Domain Expert</p>
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
            Real connections with verified experts, smarter project collaboration, 
            and a clear path toward your project goals — all within BrainMap.
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