'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
      },
      {
        name: 'Michael Thompson',
        rating: 5,
        date: '3 weeks ago',
        review: 'Dr. Chen transformed our data analytics pipeline with her innovative ML solutions. Her strategic approach and attention to detail resulted in a 40% improvement in our prediction accuracy. She also provided excellent documentation and training for our team.'
      },

    ],
    
    consultationRates: [
      {
        type: 'Hourly Consultation',
        price: 250,
        period: 'per hour',
        description: 'Perfect for quick questions and guidance',
        popular: false
      },
      {
        type: 'Daily Intensive',
        price: 1800,
        period: 'per day',
        description: 'Full-day dedicated consulting session',
        popular: true
      },
      {
        type: 'Weekly Engagement',
        price: 6500,
        period: 'per week',
        description: 'Complete week-long consulting package',
        popular: false
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
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/search-experts')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to experts
        </button>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="bg-blue-50 border-b border-blue-100 p-6" style={{ backgroundColor: '#F0F4FF', borderColor: '#E0E8FF' }}>
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={expertData.avatar}
                      alt={expertData.name}
                      className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-white shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{expertData.name}</h1>
                  <p className="font-semibold text-lg mb-2" style={{ color: '#3D52A0' }}>{expertData.title}</p>
                  <div className="flex items-center justify-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{expertData.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-center bg-white rounded-lg px-4 py-2">
                    {renderStars(expertData.rating)}
                    <span className="text-sm font-medium text-gray-700 ml-2">
                      {expertData.rating} ({expertData.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors" style={{ '--hover-border-color': '#8B9DD6' } as React.CSSProperties}>
                    <div className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{expertData.completedProjects}</div>
                    <div className="text-xs text-gray-700 font-medium">Projects</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors" style={{ '--hover-border-color': '#8B9DD6' } as React.CSSProperties}>
                    <div className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{expertData.responseRate}%</div>
                    <div className="text-xs text-gray-700 font-medium">Response Rate</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors" style={{ '--hover-border-color': '#8B9DD6' } as React.CSSProperties}>
                    <div className="text-2xl font-bold" style={{ color: '#3D52A0' }}>{expertData.reviewCount}</div>
                    <div className="text-xs text-gray-700 font-medium">Reviews</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full text-white py-3 px-4 rounded-lg hover:opacity-90 transition-colors font-semibold shadow-sm border" style={{ backgroundColor: '#3D52A0', borderColor: '#3D52A0' }}>
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    Send Message
                  </button>
                  <button className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-gray-300">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Schedule a Meeting
                  </button>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                Availability
              </h3>                <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getAvailabilityColor(expertData.availability)}`}>
                    {expertData.availability}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Response Time:</span>
                  <span className="text-sm font-medium text-gray-900">{expertData.responseTime}</span>
                </div>
              </div>

              {/* Weekly Calendar */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" style={{ color: '#3D52A0' }} />
                  This Week
                </h4>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="text-xs text-gray-700 font-semibold p-2 bg-gray-100 rounded">{day}</div>
                  ))}
                  {[
                    { date: 18, status: 'available' },
                    { date: 19, status: 'available' },
                    { date: 20, status: 'medium' },
                    { date: 21, status: 'medium' },
                    { date: 22, status: 'busy' },
                    { date: 23, status: 'busy' },
                    { date: 24, status: 'available' }
                  ].map((day, i) => (
                    <div 
                      key={day.date} 
                      className={`text-xs p-3 rounded font-medium transition-all duration-200 ${
                        day.status === 'available'
                          ? 'bg-white text-gray-800 border border-gray-300' 
                          : day.status === 'medium'
                          ? 'bg-yellow-200 text-yellow-900 border border-yellow-300' 
                          : 'bg-red-200 text-red-900 border border-red-300'
                      }`}
                    >
                      {day.date}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm mr-2"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-200 border border-yellow-300 rounded-sm mr-2"></div>
                    <span className="text-gray-600">Limited</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-200 border border-red-300 rounded-sm mr-2"></div>
                    <span className="text-gray-600">Busy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consultation Rates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                Consultation Packages
              </h3>
              
              <div className="space-y-4">
                {expertData.consultationRates.map((rate, index) => (
                  <div 
                    key={index} 
                    className={`relative p-4 border-2 rounded-lg transition-all duration-300 ${
                      rate.popular 
                        ? 'border-orange-300 bg-orange-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Popular Badge */}
                    {rate.popular && (
                      <div className="absolute -top-2 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{rate.type}</h4>
                        <p className="text-sm text-gray-600">{rate.description}</p>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${rate.popular ? 'text-orange-600' : ''}`} style={!rate.popular ? { color: '#3D52A0' } : {}}>
                          ${rate.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{rate.period}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Custom Packages Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                  <h4 className="font-bold text-blue-900 mb-2">Need Something Custom?</h4>
                  <p className="text-sm text-blue-700">For tailored packages that fit your specific requirements, click "Schedule a Meeting" above to discuss your needs.</p>
                </div>
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
                  { key: 'projects', label: 'Recent Projects' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === tab.key
                        ? 'text-white border-b-2'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    style={activeTab === tab.key ? { 
                      borderBottomColor: '#3D52A0', 
                      color: '#3D52A0' 
                    } : {}}
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                        About
                      </h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {expertData.about}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Award className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                        Areas of Expertise
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {expertData.expertise.map((skill, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{skill.skill}</span>
                              <span className="text-sm font-semibold" style={{ color: '#3D52A0' }}>{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${skill.level}%`,
                                  backgroundColor: '#3D52A0'
                                }}
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                        Professional Experience
                      </h3>
                      <div className="space-y-6">
                        {expertData.experience.map((exp, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 border rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0F4FF', borderColor: '#B8C5E0' }}>
                                  <Briefcase className="w-6 h-6" style={{ color: '#3D52A0' }} />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                <p className="font-medium" style={{ color: '#3D52A0' }}>{exp.company}</p>
                                <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                                <p className="text-gray-700">{exp.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                        Education
                      </h3>
                      <div className="space-y-3">
                        {expertData.education.map((edu, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center">
                                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                <p className="font-medium" style={{ color: '#3D52A0' }}>{edu.institution}</p>
                                <p className="text-sm text-gray-600">{edu.year}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                        Recent Projects
                      </h3>
                      <button className="hover:opacity-80 text-sm font-medium flex items-center" style={{ color: '#3D52A0' }}>
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
                                  <span key={tagIndex} className="px-3 py-1 text-xs rounded-full text-white" style={{ backgroundColor: '#3D52A0' }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                <div className="flex items-center text-emerald-800 text-sm font-medium mb-1">
                                  <TrendingUp className="w-4 h-4 mr-2" />
                                  <span>Project Outcome:</span>
                                </div>
                                <p className="text-emerald-700 text-sm">{project.outcome}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Client Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 mr-2" style={{ color: '#3D52A0' }} />
                    Client Reviews
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{expertData.rating} • {expertData.reviewCount} reviews</span>
                    </div>
                    <button className="hover:opacity-80 text-sm font-medium flex items-center" style={{ color: '#3D52A0' }}>
                      View All Reviews
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {expertData.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={`https://images.unsplash.com/photo-${index === 0 ? '1472099645785-5658abf4ff4e' : index === 1 ? '1507003211169-0a1dd7228f2d' : index === 2 ? '1560250097-0b93528c311a' : '1519345182-7b85d5e24ec2'}?w=50&h=50&fit=crop&crop=face`}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfilePage;