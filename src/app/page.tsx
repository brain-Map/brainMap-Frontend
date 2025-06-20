'use client';

import React, { useState } from 'react';
import ErrorDialog from '../components/ErrorDialog';
import NavBar from '../components/NavBar'
import CustomButton from '../components/CustomButton';
import Card_1 from '@/components/Card-1';
import JoinCommunity from '../components/JoinCommunity';
import ExpertsFeatures from '../components/ExpertsFeatures';
import ConnectLearnAchieveHero from '../components/ConnectLearnAchieveHero';
import PopularServices from '../components/PopularServices'
import DeuploadLanding from '../components/DeuploadLanding'
import { ArrowRight, Download, Play, Plus, Heart,Star,Send, Settings,TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


const Home: React.FC = () => {

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





    const handleClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked!`);
  };

  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const handleOpenDialog = () => {
  //   setIsDialogOpen(true);
  // };

  // const handleCloseDialog = () => {
  //   setIsDialogOpen(false);
  // };

  // const handleSecondaryAction = () => {
  //   console.log('Secondary action clicked');
  //   setIsDialogOpen(false);
  // };

  // const handlePrimaryAction = () => {
  //   console.log('Primary action clicked');
  //   setIsDialogOpen(false);
  // };

  return (

    <>
    <NavBar/>
    
<DeuploadLanding/>

{/* <div className='flex size-auto justify-center '>
<div className="top-head">
  <img src="/image/freepik__a-38-year-old-caucasian-man-with-a-beard-and-glass__85832.png" alt="" className='w-full h-full object-cover opacity-15' />

  <div className='absolute flex flex-col justify-center items-center gap-5'>
    <h1 className='text-white text-6xl text-center font-bold'>Connect, collaborate, and track academic <br/> work with trusted domain experts.</h1>
    <h1 className='text-white text-xl text-center'>Deupload is a online file manager on decentralized cloud storage and IPFS that allows you <br/> storage, share, collect files privately and team collaboration without subscription.</h1>

    <div className='flex gap-3'>
              <CustomButton
                text="Get Started"
                backgroundColor="bg-secondary"
                textColor="text-gray-800"
                hoverBackgroundColor="hover:bg-info"
                icon={ArrowRight}
                onClick={() => handleClick('Get Started')}
              />

                <CustomButton
                text="Pricing"
                backgroundColor="none"
                border='border border-white'
                textColor="text-white"
                hoverBackgroundColor="hover:bg-white hover:text-black"
                icon={TrendingUp }
                onClick={() => handleClick('Get Started')}
              />
    </div>
  </div>

</div>
</div> */}

{/* 
<div className='w-full h-auto flex justify-center items-center mt-5 gap-5'>

    <Card_1 image='/icon/engineering.png' text='engineering' />
    <Card_1 image='/icon/engineering.png' text='Medicine' />
    <Card_1 image='/icon/engineering.png' text='Programming & Tech' />
    <Card_1 image='/icon/engineering.png' text='Digital Marketing' />
    <Card_1 image='/icon/engineering.png' text='engineering' />
    <Card_1 image='/icon/engineering.png' text='engineering' />
    <Card_1 image='/icon/engineering.png' text='engineering' />
    <Card_1 image='/icon/engineering.png' text='engineering' />

</div> */}

{/* <div className='w-full h-auto flex justify-center items-center bg-accent mt-10'>
  <div className='w-355 h-50 bg-amber-600 flex flex-col justify-center'>
    <h1 className='text-4xl font-semibold pt-2 pb-2'>Popular Services</h1>
    <div className='w-full h-full bg-amber-950'>

    </div>
  </div>
</div> */}

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
                
                {/* Decorative circles
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-100 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 -right-8 w-6 h-6 bg-blue-300 rounded-full opacity-50"></div> */}
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