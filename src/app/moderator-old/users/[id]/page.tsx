"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Mail, 
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Building,
  Award,
  BookOpen,
  Users,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Ban,
  Shield,
  GraduationCap,
  Briefcase,
  Star,
  TrendingUp,
  CreditCard,
  DollarSign
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'domain-expert' | 'project-member';
  status: 'active' | 'pending' | 'banned' | 'inactive';
  joinDate: string;
  lastActive: string;
  projects: number;
  verified: boolean;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  expertise?: ExpertiseItem[];
  achievements?: string[];
  rating?: number;
  totalSessions?: number;
  completedProjects?: number;
  mentorshipHours?: number;
  responseRate?: number;
  responseTime?: string;
  reviewCount?: number;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface ExpertiseItem {
  skill: string;
  level: number;
}

interface Project {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  members: number;
  progress: number;
  client?: string;
  duration?: string;
  description?: string;
  tags?: string[];
  outcome?: string;
}

interface Review {
  name: string;
  rating: number;
  date: string;
  review: string;
  avatar?: string;
}

interface ConsultationPackage {
  type: string;
  price: number;
  period: string;
  description: string;
  popular: boolean;
}

interface Activity {
  id: string;
  type: 'login' | 'project_created' | 'project_joined' | 'session_completed' | 'profile_updated';
  description: string;
  timestamp: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [consultationPackages, setConsultationPackages] = useState<ConsultationPackage[]>([]);
  const [hiredExperts, setHiredExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  type TabKey = 'overview' | 'experience' | 'projects' | 'activity' | 'reviews' | 'hired-experts';
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Only keep mock data for user, projects, reviews, consultationPackages, and activity
      const mockUser: User = {
        id: userId,
        name: userId === '2' ? 'Dr. Sarah Wilson' : 'John Doe',
        email: userId === '2' ? 'sarah.wilson@university.edu' : 'john.doe@email.com',
        role: userId === '2' ? 'domain-expert' : 'project-member',
        status: 'active',
        joinDate: '2024-01-15',
        lastActive: '2024-07-10',
        projects: userId === '2' ? 12 : 3,
        verified: true,
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        bio: userId === '2' 
          ? 'Dr. Sarah Wilson is a leading expert in artificial intelligence and machine learning with over 10 years of experience in academia and industry. She holds a PhD in Computer Science from MIT and currently serves as Principal AI Architect at a Fortune 500 technology company.\n\nHer research focuses on deep learning, natural language processing, and ethical AI development. She has published over 50 peer-reviewed papers and has been a keynote speaker at major conferences in the field. She also mentors startups and provides consulting services to Fortune 500 companies.'
          : 'Computer science student passionate about web development and machine learning. Currently working on several exciting projects and always eager to learn new technologies.',
        education: userId === '2' 
          ? [
              { degree: 'PhD in Computer Science', institution: 'MIT', year: '2012' },
              { degree: 'MS in Artificial Intelligence', institution: 'Stanford University', year: '2008' },
              { degree: 'BS in Computer Engineering', institution: 'UC Berkeley', year: '2006' }
            ]
          : [
              { degree: 'BS Computer Science (Expected)', institution: 'UC Santa Cruz', year: '2024' },
              { degree: 'High School Diploma', institution: 'Tech Prep Academy', year: '2020' }
            ],
        experience: userId === '2'
          ? [
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
            ]
          : [
              {
                company: 'StartupXYZ',
                position: 'Software Engineering Intern',
                duration: 'Summer 2023',
                description: 'Developed React components and REST APIs for the company\'s main product.'
              },
              {
                company: 'Freelance',
                position: 'Web Developer',
                duration: '2022 - Present',
                description: 'Building custom websites and web applications for small businesses.'
              }
            ],
        expertise: userId === '2'
          ? [
              { skill: 'Machine Learning', level: 95 },
              { skill: 'Deep Learning', level: 90 },
              { skill: 'AI Ethics', level: 85 },
              { skill: 'Computer Vision', level: 88 },
              { skill: 'Data Science', level: 92 }
            ]
          : [
              { skill: 'React', level: 80 },
              { skill: 'Node.js', level: 75 },
              { skill: 'Python', level: 85 },
              { skill: 'JavaScript', level: 90 },
              { skill: 'Database Design', level: 70 }
            ],
        achievements: userId === '2'
          ? ['Best Paper Award - ICML 2023', '50+ Publications in Top-tier Conferences', 'Google AI Research Excellence Award']
          : ['Dean\'s List - Fall 2023', 'Hackathon Winner - TechCrunch Disrupt 2023'],
        rating: userId === '2' ? 4.9 : 4.6,
        totalSessions: userId === '2' ? 150 : 25,
        completedProjects: userId === '2' ? 45 : 8,
        mentorshipHours: userId === '2' ? 300 : 50,
        responseRate: userId === '2' ? 98 : 85,
        responseTime: userId === '2' ? '1 hour' : '2 hours',
        reviewCount: userId === '2' ? 127 : 15
      };

      const mockProjects: Project[] = userId === '2' ? [
        { 
          id: '1', 
          title: 'AI-Powered Healthcare Analytics', 
          status: 'active', 
          startDate: '2024-06-01', 
          members: 4, 
          progress: 75,
          client: 'HealthTech Solutions',
          duration: '4 months',
          description: 'Developed a machine learning-based analytics system that processes patient data to predict health outcomes and optimize treatment plans.',
          tags: ['Machine Learning', 'Healthcare', 'Python', 'TensorFlow'],
          outcome: 'Improved diagnostic accuracy by 35% and reduced treatment planning time by 50%'
        },
        { 
          id: '2', 
          title: 'Natural Language Processing for Legal Documents', 
          status: 'completed', 
          startDate: '2024-03-15', 
          endDate: '2024-06-30', 
          members: 3, 
          progress: 100,
          client: 'LegalTech Corp',
          duration: '3 months',
          description: 'Built an intelligent document analysis system using NLP to extract key information from legal contracts and automate compliance checking.',
          tags: ['NLP', 'Legal Tech', 'BERT', 'Python'],
          outcome: 'Reduced document review time by 60% and improved compliance accuracy to 99.2%'
        },
        { 
          id: '3', 
          title: 'Computer Vision for Autonomous Vehicles', 
          status: 'active', 
          startDate: '2024-07-01', 
          members: 6, 
          progress: 30,
          client: 'AutoDrive Inc',
          duration: '6 months',
          description: 'Developing advanced computer vision algorithms for real-time object detection and path planning in autonomous vehicles.',
          tags: ['Computer Vision', 'Autonomous Vehicles', 'OpenCV', 'PyTorch'],
          outcome: 'Currently in development - targeting 99.9% object detection accuracy'
        }
      ] : [
        { 
          id: '4', 
          title: 'E-commerce Website Development', 
          status: 'active', 
          startDate: '2024-05-15', 
          members: 2, 
          progress: 60,
          client: 'RetailMax',
          duration: '3 months',
          description: 'Building a modern e-commerce platform with React frontend and Node.js backend, featuring real-time inventory management.',
          tags: ['React', 'Node.js', 'E-commerce', 'MongoDB'],
          outcome: 'Expected to launch in next month with projected 40% performance improvement'
        },
        { 
          id: '5', 
          title: 'Mobile App for Task Management', 
          status: 'completed', 
          startDate: '2024-02-01', 
          endDate: '2024-04-30', 
          members: 3, 
          progress: 100,
          client: 'ProductiveTech',
          duration: '3 months',
          description: 'Developed a cross-platform mobile application for team task management with real-time collaboration features.',
          tags: ['React Native', 'Mobile Development', 'Firebase', 'JavaScript'],
          outcome: 'Successfully launched with 500+ downloads in first week and 4.8-star rating'
        }
      ];

      const mockReviews = [
        {
          name: 'David Rodriguez',
          rating: 5,
          date: '2 weeks ago',
          review: 'Provided exceptional guidance on our project. Highly recommend!',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
        },
        {
          name: 'Lisa Johnson',
          rating: 4,
          date: '1 month ago',
          review: 'Great experience and very helpful throughout the process.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
        },
        {
          name: 'Michael Thompson',
          rating: 5,
          date: '3 weeks ago',
          review: 'Transformed our workflow with innovative solutions.',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face'
        }
      ];

      const mockConsultationPackages = [
        {
          type: 'Hourly Consultation',
          price: 150,
          period: 'per hour',
          description: 'Quick questions and guidance',
          popular: false
        },
        {
          type: 'Project Package',
          price: 1200,
          period: 'per project',
          description: 'Full project support and mentorship',
          popular: true
        },
        {
          type: 'Monthly Retainer',
          price: 3500,
          period: 'per month',
          description: 'Ongoing support and consulting',
          popular: false
        }
      ];

      const mockActivity: Activity[] = [
        { id: '1', type: 'login', description: 'Logged into the platform', timestamp: '2024-07-10T14:30:00Z' },
        { id: '2', type: 'session_completed', description: 'Completed mentorship session with Alex', timestamp: '2024-07-09T16:00:00Z' },
        { id: '3', type: 'project_joined', description: 'Joined "AI Healthcare Analytics" project', timestamp: '2024-07-08T10:15:00Z' },
        { id: '4', type: 'profile_updated', description: 'Updated profile information', timestamp: '2024-07-07T09:45:00Z' }
      ];

      setUser(mockUser);
      setUserProjects(mockProjects);
      setRecentActivity(mockActivity);
      setReviews(mockReviews);
      setConsultationPackages(mockConsultationPackages);
      // Mock hired experts for project members
      if (mockUser.role === 'project-member') {
        setHiredExperts([
          {
            id: '2',
            name: 'Dr. Sarah Wilson',
            expertise: ['Machine Learning', 'AI Ethics'],
            rating: 4.9,
            totalSessions: 12,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
            hiredDate: '2024-06-01',
            status: 'active',
            email: 'sarah.wilson@university.edu',
            responseRate: 98
          },
          {
            id: '3',
            name: 'Prof. Alan Turing',
            expertise: ['Data Science', 'Deep Learning'],
            rating: 4.8,
            totalSessions: 8,
            avatar: '',
            hiredDate: '2024-05-10',
            status: 'inactive',
            email: 'alan.turing@university.edu',
            responseRate: 95
          }
        ]);
      }
      setLoading(false);
    }, 500);
  }, [userId]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusBadge = (status: User['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      banned: 'destructive',
      inactive: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const colors = {
      'domain-expert': 'bg-purple-100 text-purple-800',
      'project-member': 'bg-green-100 text-green-800'
    };

    return (
      <Badge variant="outline" className={`${colors[role]} border-0`}>
        {role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  const getProjectStatusBadge = (status: Project['status']) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      paused: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'login': return <Eye className="h-4 w-4" />;
      case 'project_created': return <BookOpen className="h-4 w-4" />;
      case 'project_joined': return <Users className="h-4 w-4" />;
      case 'session_completed': return <CheckCircle className="h-4 w-4" />;
      case 'profile_updated': return <Edit className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus: User['status']) => {
    if (user) {
      setUser({ ...user, status: newStatus });
      // Here you would make an API call to update the user's status
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen max-w-7xl m-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen max-w-7xl m-auto">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pt-8">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to users
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="bg-blue-50 border-b border-blue-100 p-6" style={{ backgroundColor: '#F0F4FF', borderColor: '#E0E8FF' }}>
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mx-auto object-cover border-4 border-white shadow-sm flex items-center justify-center">
                      <span className="text-3xl font-bold text-blue-700">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-4 border-white rounded-full flex items-center justify-center ${
                      user.status === 'active' ? 'bg-green-500' : 
                      user.status === 'pending' ? 'bg-yellow-500' : 
                      user.status === 'banned' ? 'bg-red-500' : 'bg-gray-500'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2 flex items-center justify-center gap-2">
                    {user.name}
                    {user.role === 'domain-expert' && user.verified && (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    )}
                  </h1>
                  <div className="mb-2">{getRoleBadge(user.role)}</div>
                  <div className="flex items-center justify-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{user.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center justify-center bg-white rounded-lg px-4 py-2">
                    <span className="text-sm font-medium text-gray-700">
                      Status: {getStatusBadge(user.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complaints & Reports Section */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Complaints & Reports
                </h3>
                <div className="space-y-3">
                  {/* Mock complaints and reports (not outsourcing related) */}
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 mt-1"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Inappropriate language in forum post</div>
                      <div className="text-xs text-gray-500">Reported by: Jamie Patel • 2024-07-05</div>
                      <div className="text-xs text-gray-400">Status: Under Review</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Shared private information without consent</div>
                      <div className="text-xs text-gray-500">Reported by: Priya Chen • 2024-06-22</div>
                      <div className="text-xs text-gray-400">Status: Resolved</div>
                    </div>
                  </div>
                  {/* Add more mock complaints/reports as needed */}
                </div>
              </div>

              {/* Stats Section */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {/* Ongoing Projects Stat */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="text-2xl font-bold text-primary">
                      {userProjects.filter(p => p.status === 'active').length}
                    </div>
                    <div className="text-xs text-gray-700 font-medium">Ongoing Projects</div>
                  </div>
                  {/* Completed Projects Stat */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="text-2xl font-bold text-primary">
                      {userProjects.filter(p => p.status === 'completed').length}
                    </div>
                    <div className="text-xs text-gray-700 font-medium">Completed Projects</div>
                  </div>
                  {/* Keep domain expert stats if applicable */}
                  {user.role === 'domain-expert' && user.responseRate && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="text-2xl font-bold text-primary">{user.responseRate}%</div>
                      <div className="text-xs text-gray-700 font-medium">Response Rate</div>
                    </div>
                  )}
                  {user.role === 'domain-expert' && user.reviewCount && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="text-2xl font-bold text-primary">{user.reviewCount}</div>
                      <div className="text-xs text-gray-700 font-medium">Reviews</div>
                    </div>
                  )}
                  {user.role === 'domain-expert' && (
                    <>
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="text-2xl font-bold text-primary">{user.totalSessions}</div>
                        <div className="text-xs text-gray-700 font-medium">Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="text-2xl font-bold text-primary">{user.mentorshipHours}</div>
                        <div className="text-xs text-gray-700 font-medium">Hours</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="text-2xl font-bold text-primary">{user.rating}/5</div>
                        <div className="text-xs text-gray-700 font-medium">Rating</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-3" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span className="text-sm">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-3" />
                  <span className="text-sm">Last active {new Date(user.lastActive).toLocaleDateString()}</span>
                </div>
                {user.responseTime && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-3" />
                    <span className="text-sm">Response time: {user.responseTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Areas of Expertise */}
            {user.role === 'domain-expert' && user.expertise && user.expertise.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-primary" />
                  Areas of Expertise
                </h3>
                <div className="space-y-3">
                  {user.expertise.map((item, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 text-sm">{item.skill}</span>
                        <span className="text-xs font-semibold text-primary">{item.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${item.level}%`,
                            backgroundColor: 'var(--color-primary)'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {([
                  { key: 'overview', label: 'Overview' },
                  ...(user.role === 'domain-expert'
                    ? [{ key: 'experience', label: 'Experience & Education' }]
                    : []),
                  { key: 'projects', label: 'Projects' },
                  ...(user.role === 'project-member' ? [{ key: 'hired-experts', label: 'Hired Domain Experts' }] : []),
                  { key: 'activity', label: 'Activity' },
                  ...(user.role === 'domain-expert' && reviews.length > 0 ? [{ key: 'reviews', label: 'Reviews' }] : [])
                ] as { key: TabKey; label: string }[]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                      activeTab === tab.key
                        ? 'border-b-2'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    style={activeTab === tab.key ? { 
                      borderBottomColor: 'var(--color-primary)', 
                      color: 'var(--color-primary)' 
                    } : {}}
                  >
                    {tab.label}
                  </button>
                ))}
              {/* Hired Domain Experts Tab (project-member only) - move to tab content area */}
              </div>
              <div className="p-6">
                {activeTab === 'hired-experts' && user.role === 'project-member' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-primary" />
                      Hired Domain Experts
                    </h3>
                    {hiredExperts.length === 0 ? (
                      <div className="text-gray-600">No domain experts have been hired yet.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {hiredExperts.map((expert) => (
                          <div key={expert.id} className="border border-gray-200 rounded-lg p-6 bg-white flex gap-4 items-center">
                            <img
                              src={expert.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(expert.name)}
                              alt={expert.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 text-lg">{expert.name}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{expert.status}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {expert.expertise.map((skill: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{skill}</span>
                                ))}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                                <span>Rating: <span className="font-medium text-yellow-600">{expert.rating}</span></span>
                                <span>Sessions: <span className="font-medium text-blue-700">{expert.totalSessions}</span></span>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">Hired: {new Date(expert.hiredDate).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">Email: {expert.email}</div>
                              <div className="text-xs text-gray-500">Response Rate: {expert.responseRate}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {user.bio && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <User className="w-5 h-5 mr-2 text-primary" />
                          About
                        </h3>
                        <div className="text-gray-700 leading-relaxed">
                          {user.bio}
                        </div>
                      </div>
                    )}



                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-primary" />
                        Account Details
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">User ID</label>
                            <p className="text-gray-900 font-medium">{user.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Role</label>
                            <div className="mt-1">{getRoleBadge(user.role)}</div>
                          </div>
                          {user.role === 'domain-expert' && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Verified</label>
                              <p className="text-gray-900 font-medium">{user.verified ? 'Yes' : 'No'}</p>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Status</label>
                            <div className="mt-1">{getStatusBadge(user.status)}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Join Date</label>
                            <p className="text-gray-900 font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Last Active</label>
                            <p className="text-gray-900 font-medium">{new Date(user.lastActive).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics for Domain Experts */}
                    {user.role === 'domain-expert' && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-primary" />
                          Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Rating</span>
                              <span className="text-sm font-bold text-gray-900">{user.rating}/5.0</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Total Sessions</span>
                              <span className="text-sm font-bold text-gray-900">{user.totalSessions}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Completed Projects</span>
                              <span className="text-sm font-bold text-gray-900">{user.completedProjects}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-600">Mentorship Hours</span>
                              <span className="text-sm font-bold text-gray-900">{user.mentorshipHours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Experience Tab (domain-expert only) */}
                {activeTab === 'experience' && user.role === 'domain-expert' && (
                  <div className="space-y-6">
                    {/* Experience Section */}
                    {user.experience && user.experience.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-primary" />
                          Professional Experience
                        </h3>
                        <div className="space-y-4">
                          {user.experience.map((exp, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 border rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0F4FF', borderColor: '#B8C5E0' }}>
                                    <Briefcase className="w-6 h-6 text-primary" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                                  <p className="font-medium text-primary">{exp.company}</p>
                                  <p className="text-sm text-gray-600 mb-2">{exp.duration}</p>
                                  <p className="text-gray-700">{exp.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education Section */}
                    {user.education && user.education.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                          Education
                        </h3>
                        <div className="space-y-4">
                          {user.education.map((edu, index) => (
                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                              <div className="flex space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center">
                                    <GraduationCap className="w-6 h-6 text-emerald-600" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                                  <p className="font-medium text-primary">{edu.institution}</p>
                                  <p className="text-sm text-gray-600">{edu.year}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-primary" />
                        {user.role === 'domain-expert' ? 'Mentored Projects' : 'Participating Projects'}
                      </h3>
                    </div>
                    <div className="space-y-6">
                      {userProjects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Started {new Date(project.startDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {project.members} members
                                </span>
                                {project.client && (
                                  <span className="flex items-center">
                                    <Building className="w-4 h-4 mr-1" />
                                    {project.client}
                                  </span>
                                )}
                                {project.duration && (
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {project.duration}
                                  </span>
                                )}
                                <span className="flex items-center">
                                  {project.status === 'completed' && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                                  {getProjectStatusBadge(project.status)}
                                </span>
                              </div>

                              {project.description && (
                                <p className="text-gray-700 mb-4">{project.description}</p>
                              )}
                              
                              {project.tags && project.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {project.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="px-3 py-1 text-xs rounded-full text-white bg-primary">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{project.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${project.progress}%`,
                                      backgroundColor: 'var(--color-primary)'
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {project.outcome && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-4">
                                  <div className="flex items-center text-emerald-800 text-sm font-medium mb-1">
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    <span>Project Outcome:</span>
                                  </div>
                                  <p className="text-emerald-700 text-sm">{project.outcome}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-5">
                              <div className="text-primary">
                                {getActivityIcon(activity.type)}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">{activity.description}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && user.role === 'domain-expert' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-primary" />
                        Client Reviews
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{user.rating} • {user.reviewCount} reviews</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start space-x-4">
                            <img
                              src={review.avatar || `https://images.unsplash.com/photo-${index === 0 ? '1472099645785-5658abf4ff4e' : index === 1 ? '1507003211169-0a1dd7228f2d' : '1560250097-0b93528c311a'}?w=50&h=50&fit=crop&crop=face`}
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

            {/* Consultation Packages for Domain Experts */}
            {user.role === 'domain-expert' && consultationPackages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-primary" />
                    Consultation Packages
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {consultationPackages.map((pkg, index) => (
                      <div 
                        key={index} 
                        className={`relative p-6 border-2 rounded-lg transition-all duration-300 ${
                          pkg.popular 
                            ? 'border-orange-300 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Popular Badge */}
                        {pkg.popular && (
                          <div className="absolute -top-2 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Most Popular
                          </div>
                        )}
                        
                        <div className="text-center">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">{pkg.type}</h4>
                          <div className={`text-3xl font-bold mb-2 ${pkg.popular ? 'text-orange-600' : ''}`} style={!pkg.popular ? { color: 'var(--color-primary)' } : {}}>
                            ${pkg.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 mb-4">{pkg.period}</div>
                          <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Custom Packages Info */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                      <h4 className="font-bold text-primary mb-2">Custom Packages Available</h4>
                      <p className="text-sm text-blue-700">This expert allows custom packages tailored to specific requirements and project needs.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
