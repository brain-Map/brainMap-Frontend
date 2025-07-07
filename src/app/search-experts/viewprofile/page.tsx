'use client';
import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  MessageCircle, 
  Phone, 
  Mail, 
  Award, 
  Briefcase, 
  GraduationCap,
  ChevronLeft,
  Heart,
  Share2,
  CheckCircle,
  Users,
  TrendingUp,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/NavBarModel';

const ExpertProfilePage = () => {
  const [activeTab, setActiveTab] = useState('about');

  const expertData = {
    name: 'Dr. Sarah Chen',
    title: 'AI & Machine Learning Expert',
    rating: 4.9,
    reviewCount: 127,
    completedProjects: 250,
    responseRate: 98,
    location: 'San Francisco, CA',
    responseTime: '1 hour',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b73b83f4?w=200&h=200&fit=crop&crop=face',
    hourlyRate: 120,
    availability: 'Available Now',
    languages: ['English', 'Mandarin'],
    expertise: [
      { skill: 'Machine Learning', level: 95 },
      { skill: 'Deep Learning', level: 90 },
      { skill: 'AI Ethics', level: 85 },
      { skill: 'Computer Vision', level: 88 },
      { skill: 'Data Science', level: 92 }
    ],
    about: `Dr. Sarah Chen is a leading expert in artificial intelligence and machine learning with over 10 years of experience in academia and industry. She holds a PhD in Computer Science from MIT and currently serves as Principal AI Architect at a Fortune 500 technology company.

Her research focuses on deep learning, natural language processing, and ethical AI development. She has published over 50 peer-reviewed papers and has been a keynote speaker at major conferences in the field. She also mentors startups and provides consulting services to Fortune 500 companies.`,
    
    experience: [
      {
        company: 'TechCorp AI',
        position: 'Principal AI Architect',
        duration: '2019 - Present',
        description: 'Leading AI initiatives and developing cutting-edge machine learning solutions for enterprise clients.'
      },
      {
        company: 'Stanford University',
        position: 'Research Scientist',
        duration: '2015 - 2019',
        description: 'Conducted groundbreaking research in deep learning and natural language processing.'
      },
      {
        company: 'Google DeepMind',
        position: 'Senior ML Engineer',
        duration: '2012 - 2015',
        description: 'Developed and deployed large-scale machine learning models for Google products.'
      }
    ],
    
    education: [
      {
        degree: 'PhD in Computer Science',
        institution: 'MIT',
        year: '2012'
      },
      {
        degree: 'MS in Artificial Intelligence',
        institution: 'Stanford University',
        year: '2008'
      }
    ],
    
    reviews: [
      {
        name: 'David Rodriguez',
        rating: 5,
        date: '2 weeks ago',
        review: 'Dr. Chen provided exceptional guidance on our AI implementation. Her expertise spanned all aspects of machine learning, and she was able to explain complex concepts clearly. Highly recommend!'
      },
      {
        name: 'Lisa Johnson',
        rating: 5,
        date: '1 month ago',
        review: 'Incredible depth of knowledge and ability to explain complex concepts clearly. Highly recommend!'
      }
    ],
    
    consultationRates: [
      {
        type: '1-Hour Consultation',
        price: 250,
        description: 'Perfect for quick questions and guidance'
      },
      {
        type: 'Project Review',
        price: 500,
        description: 'Comprehensive project analysis and recommendations'
      },
      {
        type: 'Ongoing Mentorship',
        price: 2000,
        description: 'Monthly retainer for continuous support'
      }
    ],

    recentProjects: [
      {
        title: 'E-commerce Recommendation System',
        client: 'RetailTech Solutions',
        duration: '3 months',
        completedDate: '2 weeks ago',
        description: 'Developed a machine learning-based recommendation system that increased user engagement by 40% and sales by 25%.',
        tags: ['Machine Learning', 'Python', 'TensorFlow', 'AWS'],
        outcome: 'Deployed successfully across 5 major retail platforms'
      },
      {
        title: 'Computer Vision for Quality Control',
        client: 'Manufacturing Corp',
        duration: '2 months',
        completedDate: '1 month ago',
        description: 'Built an automated quality control system using computer vision to detect defects in manufacturing processes.',
        tags: ['Computer Vision', 'OpenCV', 'Deep Learning', 'PyTorch'],
        outcome: 'Reduced defect detection time by 70% and improved accuracy to 99.2%'
      },
      {
        title: 'Natural Language Processing Chatbot',
        client: 'Financial Services Inc',
        duration: '4 months',
        completedDate: '6 weeks ago',
        description: 'Created an intelligent chatbot for customer service that handles 80% of common inquiries automatically.',
        tags: ['NLP', 'Transformers', 'BERT', 'Node.js'],
        outcome: 'Reduced customer service response time by 60% and improved satisfaction scores'
      }
    ]
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
    if (availability === 'Available Now') return 'text-green-600 bg-green-50 border-green-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-16">
        {/* Back Button */}
        <button className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to experts
        </button>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <img
                  src={expertData.avatar}
                  alt={expertData.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h1 className="text-xl font-bold text-gray-900 mb-1">{expertData.name}</h1>
                <p className="text-blue-600 font-medium mb-3">{expertData.title}</p>
                
                <div className="flex items-center justify-center mb-4">
                  {renderStars(expertData.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {expertData.rating} ({expertData.reviewCount} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{expertData.completedProjects}</div>
                    <div className="text-xs text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{expertData.responseRate}%</div>
                    <div className="text-xs text-gray-500">Response Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{expertData.reviewCount}</div>
                    <div className="text-xs text-gray-500">Reviews</div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Send Message
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Schedule Call
                  </button>
                </div>

                <div className="flex justify-center space-x-4">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAvailabilityColor(expertData.availability)}`}>
                    {expertData.availability}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time:</span>
                  <span className="text-sm font-medium text-gray-900">{expertData.responseTime}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-gray-900">{expertData.location}</span>
                </div>
              </div>

              {/* Weekly Calendar */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">This Week</h4>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="text-xs text-gray-500 p-1">{day}</div>
                  ))}
                  {[18, 19, 20, 21, 22, 23, 24].map((date, i) => (
                    <div key={date} className={`text-xs p-2 rounded ${i < 3 ? 'bg-green-100 text-green-700' : i < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {date}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Consultation Rates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Rates</h3>
              
              <div className="space-y-4">
                {expertData.consultationRates.map((rate, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{rate.type}</div>
                      <div className="text-sm text-gray-600">{rate.description}</div>
                    </div>
                    <div className="text-lg font-bold text-blue-600">${rate.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { key: 'about', label: 'About' },
                  { key: 'experience', label: 'Professional Experience' },
                  { key: 'reviews', label: 'Client Reviews' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {expertData.about}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas of Expertise</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {expertData.expertise.map((skill, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                              <span className="text-sm text-gray-600">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Experience</h3>
                      <div className="space-y-6">
                        {expertData.experience.map((exp, index) => (
                          <div key={index} className="flex space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                              <p className="text-blue-600 font-medium">{exp.company}</p>
                              <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                              <p className="text-gray-700">{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                      <div className="space-y-4">
                        {expertData.education.map((edu, index) => (
                          <div key={index} className="flex space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-green-600" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                              <p className="text-blue-600 font-medium">{edu.institution}</p>
                              <p className="text-sm text-gray-600">{edu.year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Client Reviews</h3>
                    <div className="space-y-6">
                      {expertData.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <img
                              src={`https://images.unsplash.com/photo-${index === 0 ? '1472099645785-5658abf4ff4e' : '1507003211169-0a1dd7228f2d'}?w=50&h=50&fit=crop&crop=face`}
                              alt={review.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex items-center mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-gray-700">{review.review}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recently Completed Projects */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recently Completed Projects</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                    View All Projects
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {expertData.recentProjects.map((project, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {project.client}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {project.duration}
                            </span>
                            <span className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                              Completed {project.completedDate}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">{project.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center text-green-800 text-sm">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              <span className="font-medium">Project Outcome:</span>
                            </div>
                            <p className="text-green-700 text-sm mt-1">{project.outcome}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;