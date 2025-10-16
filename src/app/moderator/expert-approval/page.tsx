'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Clock, 
  User, 
  GraduationCap, 
  Briefcase,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Mock data for expert approval requests
const mockExpertRequests = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "Boston, MA",
    profileImage: "/public/image/user.jpg",
    domain: "Machine Learning",
    specialization: "Computer Vision & Neural Networks",
    education: "Ph.D. in Computer Science - MIT",
    experience: "8 years",
    currentPosition: "Senior Research Scientist at Google AI",
    institution: "Google AI Research",
    submittedDate: "2024-01-15",
    status: "pending" as const,
    publications: 25,
    citations: 450,
    documents: [
      { name: "PhD Certificate", type: "pdf", verified: true },
      { name: "Research Portfolio", type: "pdf", verified: false },
      { name: "Reference Letter", type: "pdf", verified: true }
    ],
    bio: "Dr. Sarah Johnson is a leading researcher in computer vision and neural networks with over 8 years of experience. She has published extensively in top-tier conferences and journals.",
    researchAreas: ["Computer Vision", "Deep Learning", "Neural Networks", "AI Ethics"],
    achievements: [
      "Best Paper Award at CVPR 2023",
      "Google Research Excellence Award 2022",
      "IEEE Young Researcher Award 2021"
    ],
    projects: [
      {
        title: "Autonomous Vehicle Vision System",
        duration: "2022-2024",
        role: "Lead AI Researcher",
        description: "Developed computer vision algorithms for real-time object detection and tracking in autonomous vehicles, improving safety by 40%.",
        technologies: ["TensorFlow", "OpenCV", "Python", "CUDA"],
        outcome: "Deployed in production vehicles"
      },
      {
        title: "Medical Image Analysis Platform",
        duration: "2021-2022",
        role: "Senior Developer",
        description: "Built AI-powered diagnostic tools for analyzing medical scans, reducing diagnosis time by 60%.",
        technologies: ["PyTorch", "React", "Docker", "AWS"],
        outcome: "Used in 15+ hospitals"
      }
    ]
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    email: "m.chen@stanford.edu",
    phone: "+1 (555) 987-6543",
    location: "Stanford, CA",
    profileImage: "/public/image/user.jpg",
    domain: "Data Science",
    specialization: "Big Data Analytics & Statistical Modeling",
    education: "Ph.D. in Statistics - Stanford University",
    experience: "12 years",
    currentPosition: "Professor of Statistics",
    institution: "Stanford University",
    submittedDate: "2024-01-18",
    status: "pending" as const,
    publications: 40,
    citations: 680,
    documents: [
      { name: "Academic Credentials", type: "pdf", verified: true },
      { name: "Publication List", type: "pdf", verified: true },
      { name: "University Appointment Letter", type: "pdf", verified: false }
    ],
    bio: "Professor Chen is a renowned statistician specializing in big data analytics and statistical modeling with applications in healthcare and finance.",
    researchAreas: ["Big Data", "Statistical Modeling", "Healthcare Analytics", "Financial Statistics"],
    achievements: [
      "Fellow of the American Statistical Association",
      "Outstanding Teaching Award 2022",
      "NSF Career Award 2019"
    ],
    projects: [
      {
        title: "Healthcare Data Analytics Platform",
        duration: "2023-2024",
        role: "Principal Investigator",
        description: "Developed predictive models for patient outcome analysis using big data techniques, improving treatment success rates by 25%.",
        technologies: ["R", "Python", "Spark", "Hadoop"],
        outcome: "Adopted by Stanford Hospital"
      },
      {
        title: "Financial Risk Assessment System",
        duration: "2021-2023",
        role: "Lead Data Scientist",
        description: "Created machine learning models for credit risk assessment and fraud detection for major financial institutions.",
        technologies: ["SAS", "Python", "SQL", "Tableau"],
        outcome: "Reduced fraud by 35%"
      }
    ]
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    email: "e.rodriguez@biotech.com",
    phone: "+1 (555) 456-7890",
    location: "San Francisco, CA",
    profileImage: "/public/image/user.jpg",
    domain: "Biotechnology",
    specialization: "Genetic Engineering & Bioinformatics",
    education: "Ph.D. in Molecular Biology - UCSF",
    experience: "6 years",
    currentPosition: "Senior Biotech Researcher",
    institution: "Genentech Inc.",
    submittedDate: "2024-01-20",
    status: "under_review" as const,
    publications: 18,
    citations: 320,
    documents: [
      { name: "PhD Diploma", type: "pdf", verified: true },
      { name: "Industry Experience Certificate", type: "pdf", verified: true },
      { name: "Research Publications", type: "pdf", verified: true }
    ],
    bio: "Dr. Rodriguez is an expert in genetic engineering and bioinformatics, working on cutting-edge gene therapy research.",
    researchAreas: ["Genetic Engineering", "Bioinformatics", "Gene Therapy", "CRISPR Technology"],
    achievements: [
      "Breakthrough Research Award 2023",
      "Young Scientist Award in Biotechnology",
      "Patent holder for gene editing technique"
    ],
    projects: [
      {
        title: "CRISPR Gene Editing Platform",
        duration: "2023-2024",
        role: "Lead Researcher",
        description: "Developed next-generation CRISPR tools for precise gene editing in therapeutic applications.",
        technologies: ["CRISPR-Cas9", "Python", "Bioinformatics Tools"],
        outcome: "3 patents filed"
      },
      {
        title: "Cancer Immunotherapy Project",
        duration: "2022-2023",
        role: "Senior Scientist",
        description: "Engineered CAR-T cells for personalized cancer treatment with improved efficacy and reduced side effects.",
        technologies: ["Cell Culture", "Flow Cytometry", "R"],
        outcome: "Phase I clinical trials"
      }
    ]
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    email: "j.wilson@research.com",
    phone: "+1 (555) 321-0987",
    location: "Seattle, WA",
    profileImage: "/public/image/user.jpg",
    domain: "Artificial Intelligence",
    specialization: "Natural Language Processing",
    education: "Ph.D. in Computer Science - University of Washington",
    experience: "10 years",
    currentPosition: "Principal Research Scientist",
    institution: "Microsoft Research",
    submittedDate: "2024-01-25",
    status: "approved" as const,
    publications: 35,
    citations: 520,
    documents: [
      { name: "PhD Certificate", type: "pdf", verified: true },
      { name: "Research Portfolio", type: "pdf", verified: true },
      { name: "Reference Letter", type: "pdf", verified: true }
    ],
    bio: "Dr. Wilson is a leading expert in natural language processing with extensive experience in developing AI systems for real-world applications.",
    researchAreas: ["Natural Language Processing", "Machine Learning", "AI Safety", "Computational Linguistics"],
    achievements: [
      "ACL Outstanding Paper Award 2022",
      "Microsoft Research Excellence Award 2021",
      "Best Demo Award at EMNLP 2020"
    ],
    projects: [
      {
        title: "Enterprise AI Assistant Platform",
        duration: "2023-2024",
        role: "Principal Researcher",
        description: "Led development of advanced conversational AI system for enterprise applications, handling 10M+ queries daily.",
        technologies: ["Transformer Models", "Azure", "Python", "React"],
        outcome: "Deployed to 500+ companies"
      },
      {
        title: "Multilingual Translation System",
        duration: "2022-2023",
        role: "Technical Lead",
        description: "Built real-time translation system supporting 100+ languages with 95% accuracy for business communications.",
        technologies: ["BERT", "GPT", "TensorFlow", "Kubernetes"],
        outcome: "Integrated in Microsoft Teams"
      }
    ]
  },
  {
    id: 5,
    name: "Prof. Lisa Chang",
    email: "l.chang@university.edu",
    phone: "+1 (555) 654-3210",
    location: "New York, NY",
    profileImage: "/public/image/user.jpg",
    domain: "Cybersecurity",
    specialization: "Network Security & Cryptography",
    education: "Ph.D. in Computer Science - Columbia University",
    experience: "15 years",
    currentPosition: "Professor of Computer Science",
    institution: "Columbia University",
    submittedDate: "2024-01-12",
    status: "rejected" as const,
    publications: 28,
    citations: 380,
    documents: [
      { name: "Academic Credentials", type: "pdf", verified: false },
      { name: "Publication List", type: "pdf", verified: true },
      { name: "Reference Letter", type: "pdf", verified: false }
    ],
    bio: "Professor Chang specializes in network security and cryptography with a focus on developing secure communication protocols.",
    researchAreas: ["Network Security", "Cryptography", "Blockchain", "Privacy"],
    achievements: [
      "IEEE Security & Privacy Award 2021",
      "NSF CAREER Award 2018",
      "Outstanding Teaching Award 2019"
    ],
    projects: [
      {
        title: "Blockchain Security Framework",
        duration: "2022-2024",
        role: "Principal Investigator",
        description: "Developed comprehensive security framework for blockchain applications, addressing smart contract vulnerabilities.",
        technologies: ["Solidity", "Ethereum", "Python", "Cryptographic Libraries"],
        outcome: "Adopted by 10+ DeFi platforms"
      },
      {
        title: "Quantum-Resistant Cryptography",
        duration: "2020-2022",
        role: "Research Lead",
        description: "Created post-quantum cryptographic algorithms to secure communications against quantum computer threats.",
        technologies: ["Lattice Cryptography", "C++", "Mathematical Analysis"],
        outcome: "Published NIST standard"
      }
    ]
  },
  {
    id: 6,
    name: "Dr. Rachel Kim",
    email: "r.kim@medtech.com",
    phone: "+1 (555) 789-0123",
    location: "San Diego, CA",
    profileImage: "/public/image/user.jpg",
    domain: "Healthcare Technology",
    specialization: "Digital Health & Telemedicine",
    education: "Ph.D. in Biomedical Engineering - Johns Hopkins University",
    experience: "7 years",
    currentPosition: "Senior Health Tech Researcher",
    institution: "Qualcomm Health",
    submittedDate: "2024-01-28",
    status: "pending" as const,
    publications: 22,
    citations: 340,
    documents: [
      { name: "PhD Certificate", type: "pdf", verified: true },
      { name: "Medical Device Certifications", type: "pdf", verified: true },
      { name: "Industry Reference Letter", type: "pdf", verified: false }
    ],
    bio: "Dr. Kim specializes in developing innovative digital health solutions and telemedicine platforms that improve patient outcomes and healthcare accessibility.",
    researchAreas: ["Digital Health", "Telemedicine", "IoT Healthcare", "Medical Devices"],
    achievements: [
      "FDA Breakthrough Device Designation 2023",
      "Digital Health Innovation Award 2022",
      "Young Innovator in Healthcare 2021"
    ],
    projects: [
      {
        title: "Remote Patient Monitoring System",
        duration: "2023-2024",
        role: "Project Lead",
        description: "Developed IoT-based system for continuous patient monitoring with AI-powered alerts, reducing hospital readmissions by 30%.",
        technologies: ["IoT Sensors", "Machine Learning", "React Native", "AWS"],
        outcome: "FDA approved and deployed in 20+ hospitals"
      },
      {
        title: "AI-Powered Diagnostic Assistant",
        duration: "2022-2023",
        role: "Senior Developer",
        description: "Created AI system to assist healthcare providers in diagnosis, improving accuracy by 25% in rural healthcare settings.",
        technologies: ["TensorFlow", "Python", "FHIR", "Node.js"],
        outcome: "Pilot program in 50+ clinics"
      }
    ]
  },
  {
    id: 7,
    name: "Prof. David Martinez",
    email: "d.martinez@aerospace.edu",
    phone: "+1 (555) 234-5678",
    location: "Pasadena, CA",
    profileImage: "/public/image/user.jpg",
    domain: "Aerospace Engineering",
    specialization: "Spacecraft Systems & Propulsion",
    education: "Ph.D. in Aerospace Engineering - Caltech",
    experience: "14 years",
    currentPosition: "Professor of Aerospace Engineering",
    institution: "California Institute of Technology",
    submittedDate: "2024-01-30",
    status: "under_review" as const,
    publications: 45,
    citations: 720,
    documents: [
      { name: "Academic Credentials", type: "pdf", verified: true },
      { name: "NASA Collaboration Agreement", type: "pdf", verified: true },
      { name: "Research Portfolio", type: "pdf", verified: true }
    ],
    bio: "Professor Martinez is a leading expert in spacecraft propulsion systems with extensive experience in NASA missions and commercial space ventures.",
    researchAreas: ["Spacecraft Propulsion", "Mission Design", "Space Systems", "Orbital Mechanics"],
    achievements: [
      "NASA Exceptional Achievement Medal 2023",
      "AIAA Associate Fellow 2022",
      "Best Paper Award AIAA 2021"
    ],
    projects: [
      {
        title: "Mars Mission Propulsion System",
        duration: "2022-2024",
        role: "Principal Investigator",
        description: "Designed next-generation propulsion system for Mars exploration missions, reducing travel time by 40%.",
        technologies: ["Ion Propulsion", "MATLAB", "CFD Analysis", "CAD"],
        outcome: "Selected for NASA Artemis program"
      },
      {
        title: "CubeSat Constellation Network",
        duration: "2021-2022",
        role: "Technical Director",
        description: "Developed autonomous navigation system for CubeSat constellations for Earth observation missions.",
        technologies: ["C++", "Embedded Systems", "RF Communication"],
        outcome: "Launched 12 satellites successfully"
      }
    ]
  },
  {
    id: 8,
    name: "Dr. Amanda Foster",
    email: "a.foster@envirotech.org",
    phone: "+1 (555) 345-6789",
    location: "Portland, OR",
    profileImage: "/public/image/user.jpg",
    domain: "Environmental Science",
    specialization: "Climate Modeling & Sustainability",
    education: "Ph.D. in Environmental Science - University of Washington",
    experience: "9 years",
    currentPosition: "Senior Climate Scientist",
    institution: "Environmental Protection Agency",
    submittedDate: "2024-02-01",
    status: "pending" as const,
    publications: 31,
    citations: 480,
    documents: [
      { name: "PhD Diploma", type: "pdf", verified: false },
      { name: "EPA Employment Verification", type: "pdf", verified: true },
      { name: "Publication List", type: "pdf", verified: true }
    ],
    bio: "Dr. Foster specializes in climate modeling and developing sustainable solutions for environmental challenges, with focus on carbon reduction technologies.",
    researchAreas: ["Climate Modeling", "Carbon Capture", "Renewable Energy", "Environmental Policy"],
    achievements: [
      "EPA Scientific Achievement Award 2023",
      "Climate Research Excellence Award 2022",
      "Green Technology Innovation Prize 2021"
    ],
    projects: [
      {
        title: "Carbon Capture Optimization Platform",
        duration: "2023-2024",
        role: "Lead Scientist",
        description: "Developed AI-driven optimization system for carbon capture facilities, improving efficiency by 35%.",
        technologies: ["Python", "Machine Learning", "Data Analytics", "GIS"],
        outcome: "Implemented in 15+ facilities"
      },
      {
        title: "Climate Impact Prediction Model",
        duration: "2022-2023",
        role: "Principal Researcher",
        description: "Created predictive models for climate change impacts on coastal regions with 90% accuracy.",
        technologies: ["R", "Statistical Modeling", "Satellite Data", "HPC"],
        outcome: "Used by NOAA for coastal planning"
      }
    ]
  },
  {
    id: 9,
    name: "Dr. Alex Thompson",
    email: "a.thompson@robotics.tech",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    profileImage: "/public/image/user.jpg",
    domain: "Robotics",
    specialization: "Autonomous Systems & Human-Robot Interaction",
    education: "Ph.D. in Robotics - Carnegie Mellon University",
    experience: "11 years",
    currentPosition: "Principal Robotics Engineer",
    institution: "Tesla Robotics Division",
    submittedDate: "2024-02-03",
    status: "under_review" as const,
    publications: 38,
    citations: 590,
    documents: [
      { name: "PhD Certificate", type: "pdf", verified: true },
      { name: "Tesla Employment Letter", type: "pdf", verified: true },
      { name: "Patent Portfolio", type: "pdf", verified: false }
    ],
    bio: "Dr. Thompson is an expert in autonomous robotics systems with extensive experience in developing human-robot interaction technologies for industrial and consumer applications.",
    researchAreas: ["Autonomous Robotics", "Human-Robot Interaction", "Machine Learning", "Computer Vision"],
    achievements: [
      "IEEE Robotics Excellence Award 2023",
      "Innovation in Automation Award 2022",
      "Best Demo Award ICRA 2021"
    ],
    projects: [
      {
        title: "Humanoid Assistant Robot",
        duration: "2023-2024",
        role: "Technical Lead",
        description: "Developed advanced humanoid robot for home assistance with natural language processing and emotional intelligence.",
        technologies: ["ROS", "Deep Learning", "Computer Vision", "NLP"],
        outcome: "Product launch scheduled 2025"
      },
      {
        title: "Autonomous Manufacturing System",
        duration: "2021-2023",
        role: "Senior Engineer",
        description: "Created fully autonomous manufacturing line for electric vehicle production, reducing defects by 50%.",
        technologies: ["Industrial Robotics", "Machine Vision", "PLC", "AI"],
        outcome: "Deployed in 3 Tesla factories"
      }
    ]
  },
  {
    id: 10,
    name: "Dr. Priya Patel",
    email: "p.patel@quantum.research",
    phone: "+1 (555) 567-8901",
    location: "Cambridge, MA",
    profileImage: "/public/image/user.jpg",
    domain: "Quantum Computing",
    specialization: "Quantum Algorithms & Error Correction",
    education: "Ph.D. in Physics - MIT",
    experience: "6 years",
    currentPosition: "Quantum Research Scientist",
    institution: "IBM Quantum Network",
    submittedDate: "2024-02-05",
    status: "pending" as const,
    publications: 19,
    citations: 280,
    documents: [
      { name: "PhD Diploma", type: "pdf", verified: true },
      { name: "IBM Research Agreement", type: "pdf", verified: true },
      { name: "Quantum Certification", type: "pdf", verified: true }
    ],
    bio: "Dr. Patel is a quantum computing researcher focused on developing practical quantum algorithms and error correction methods for near-term quantum devices.",
    researchAreas: ["Quantum Algorithms", "Error Correction", "Quantum Hardware", "Quantum Software"],
    achievements: [
      "IBM Quantum Achievement Award 2023",
      "Young Researcher in Quantum Computing 2022",
      "Best Paper Award Quantum Week 2021"
    ],
    projects: [
      {
        title: "Quantum Error Correction Protocol",
        duration: "2023-2024",
        role: "Lead Researcher",
        description: "Developed novel quantum error correction codes that reduce error rates by 60% in NISQ devices.",
        technologies: ["Qiskit", "Python", "Quantum Circuits", "Error Analysis"],
        outcome: "Published in Nature Quantum"
      },
      {
        title: "Quantum Machine Learning Platform",
        duration: "2022-2023",
        role: "Senior Developer",
        description: "Built quantum machine learning algorithms for optimization problems with quantum advantage.",
        technologies: ["Quantum Computing", "Machine Learning", "Optimization"],
        outcome: "Open-sourced on GitHub"
      }
    ]
  }
];

interface ExpertRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  domain: string;
  specialization: string;
  education: string;
  experience: string;
  currentPosition: string;
  institution: string;
  submittedDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  publications: number;
  citations: number;
  documents: Array<{
    name: string;
    type: string;
    verified: boolean;
  }>;
  bio: string;
  researchAreas: string[];
  achievements: string[];
  projects: Array<{
    title: string;
    duration: string;
    role: string;
    description: string;
    technologies: string[];
    outcome: string;
  }>;
}

export default function ExpertApprovalPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<ExpertRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<ExpertRequest[]>(mockExpertRequests);

  // Reset filter to "all" if it's set to "approved" or "rejected" since we don't show those requests
  useEffect(() => {
    if (selectedTab === "approved" || selectedTab === "rejected") {
      setSelectedTab("all");
    }
  }, [selectedTab]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      under_review: { color: "bg-blue-100 text-blue-800", label: "Under Review" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const handleApproveRequest = (id: number) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'approved' as const } : req
      )
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: 'approved' as const } : null);
    }
  };

  const handleRejectRequest = (id: number) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'rejected' as const } : req
      )
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: 'rejected' as const } : null);
    }
  };

  const handleReviewRequest = (id: number) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: 'under_review' as const } : req
      )
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: 'under_review' as const } : null);
    }
  };

  const filteredRequests = requests.filter(request => {
    // Exclude approved and rejected requests from the list
    if (request.status === 'approved' || request.status === 'rejected') return false;
    
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && request.status === selectedTab;
  });

  const getTabCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      under_review: requests.filter(r => r.status === 'under_review').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
  };

  const tabCounts = getTabCounts();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expert Profile Verification</h1>
          <p className="text-gray-600 mt-1">Review and approve domain expert registration requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{tabCounts.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 text-white">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-yellow-600">Awaiting review</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">{tabCounts.under_review}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <Eye className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-blue-600">In progress</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{tabCounts.approved}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500 text-white">
              <Check className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-green-600">Verified experts</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{tabCounts.rejected}</p>
            </div>
            <div className="p-3 rounded-full bg-red-500 text-white">
              <X className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-red-600">Declined applications</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Request List */}
        <div className="lg:col-span-1">
          <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Expert Requests
              </CardTitle>
              
              {/* Search and Filter */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search experts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  />
                </div>
                <div className="relative min-w-[140px]">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm appearance-none"
                    value={selectedTab}
                    onChange={(e) => setSelectedTab(e.target.value)}
                  >
                    <option value="all">All ({tabCounts.all - tabCounts.approved - tabCounts.rejected})</option>
                    <option value="pending">Pending ({tabCounts.pending})</option>
                    <option value="under_review">Review ({tabCounts.under_review})</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Request List */}
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredRequests.map((request, index) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request)}
                      className={`p-5 ${index !== filteredRequests.length - 1 ? 'border-b border-gray-100' : ''} cursor-pointer hover:bg-gray-50 transition-all duration-200 group ${
                        selectedRequest?.id === request.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage src={request.profileImage} alt={request.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">{request.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-sm truncate group-hover:text-gray-700 transition-colors">{request.name}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          
                          <p className="text-xs text-gray-600 mb-1 font-medium">{request.domain}</p>
                          <p className="text-xs text-gray-500 truncate leading-relaxed">{request.specialization}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Detailed View */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 shadow-sm">
                      <AvatarImage src={selectedRequest.profileImage} alt={selectedRequest.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-semibold text-lg">{selectedRequest.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{selectedRequest.name}</CardTitle>
                      <p className="text-gray-600 font-medium">{selectedRequest.currentPosition}</p>
                      <p className="text-sm text-gray-500">{selectedRequest.institution}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(selectedRequest.status)}
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-mono">#{selectedRequest.id}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Profile</TabsTrigger>
                    <TabsTrigger value="documents" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Documents</TabsTrigger>
                    <TabsTrigger value="research" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Past Projects</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="mt-6">
                    <div className="space-y-6">
                      {/* Contact Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                          <User className="h-4 w-4" />
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{selectedRequest.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{selectedRequest.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{selectedRequest.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">Applied: {new Date(selectedRequest.submittedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                          <Briefcase className="h-4 w-4" />
                          Professional Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Domain:</span>
                            <p className="text-gray-600">{selectedRequest.domain}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Experience:</span>
                            <p className="text-gray-600">{selectedRequest.experience}</p>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-700">Specialization:</span>
                            <p className="text-gray-600">{selectedRequest.specialization}</p>
                          </div>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-900">
                          <GraduationCap className="h-4 w-4" />
                          Education
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.education}</p>
                      </div>

                      {/* Biography */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 text-gray-900">Biography</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{selectedRequest.bio}</p>
                      </div>

                      {/* Research Areas */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Research Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.researchAreas.map((area, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 border border-blue-200 text-xs font-medium px-3 py-1">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Achievements */}
                      <div>
                        <h3 className="font-semibold mb-3 text-gray-900">Key Achievements</h3>
                        <ul className="space-y-2">
                          {selectedRequest.achievements.map((achievement, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2 leading-relaxed">
                              <span className="text-green-500 mt-1 font-bold">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="documents" className="mt-6">
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                        <FileText className="h-4 w-4" />
                        Submitted Documents
                      </h3>
                      <div className="space-y-3">
                        {selectedRequest.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 bg-white">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500 uppercase font-medium">{doc.type} file</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {doc.verified ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-200 font-medium">Verified</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 font-medium">Pending</Badge>
                              )}
                              <Button variant="outline" size="sm" className="text-xs px-3 py-2 hover:bg-gray-50">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="research" className="mt-6">
                    <div className="space-y-6">
                      {/* Project Portfolio */}
                      <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                          <Briefcase className="h-4 w-4" />
                          Project Portfolio
                        </h3>
                        <div className="space-y-4">
                          {selectedRequest.projects?.map((project, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-1">{project.title}</h4>
                                  <p className="text-sm text-blue-600 font-medium">{project.role}</p>
                                </div>
                                <Badge className="bg-gray-100 text-gray-700 text-xs">
                                  {project.duration}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{project.description}</p>
                              
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Technologies Used:</p>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech, techIndex) => (
                                    <Badge key={techIndex} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="pt-3 border-t border-gray-100">
                                <p className="text-xs font-medium text-gray-700 mb-1">Outcome:</p>
                                <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                  {project.outcome}
                                </p>
                              </div>
                            </div>
                          )) || (
                            <div className="text-center py-8 text-gray-500">
                              <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                              <p>No projects listed</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Research Impact */}
                      <div>
                        <h3 className="font-semibold mb-4 text-gray-900">Research Impact</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900 mb-1">{selectedRequest.publications}</p>
                            <p className="text-sm text-gray-600">Publications</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-gray-900 mb-1">{selectedRequest.citations}</p>
                            <p className="text-sm text-gray-600">Citations</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                {selectedRequest.status === 'pending' || selectedRequest.status === 'under_review' ? (
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                    {selectedRequest.status === 'pending' && (
                      <Button
                        onClick={() => handleReviewRequest(selectedRequest.id)}
                        variant="outline"
                        className="flex-1 text-xs px-4 py-2 font-medium transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Start Review
                      </Button>
                    )}
                    <Button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      className="flex-1 text-white text-xs px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      className="flex-1 text-xs px-4 py-2 font-medium transition-all duration-200 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 bg-white border"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">
                        This request has been {selectedRequest.status === 'approved' ? 'approved' : 'rejected'}.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Expert Selected</h3>
                  <p className="text-gray-600">Select an expert request from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}