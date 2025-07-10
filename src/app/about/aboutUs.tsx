'use client';

import React from 'react';
import NavBar from '../../components/NavBarModel';
import CustomButton from '../../components/CustomButtonModel';
import { 
  ArrowRight, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Globe, 
  BookOpen,
  Lightbulb,
  Shield,
  TrendingUp,
  CheckCircle,
  Star,
  GraduationCap,
  Brain,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AboutUs: React.FC = () => {
  const handleClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked!`);
  };

  const stats = [
    { number: '10,000+', label: 'Active Project Members', icon: GraduationCap },
    { number: '2,500+', label: 'Domain Experts', icon: Users },
    { number: '50,000+', label: 'Managed Projects', icon: Award }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Ethical Collaboration',
      description: 'We maintain the highest standards of academic integrity while fostering meaningful connections between students and experts.'
    },
    {
      icon: Brain,
      title: 'Knowledge Excellence',
      description: 'Our platform connects students with top-tier domain experts to ensure high-quality academic guidance and mentorship.'
    },
    {
      icon: Heart,
      title: 'Student-Centric',
      description: 'Every feature is designed with students in mind, creating an environment that supports their academic growth and success.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge technology to create seamless collaboration experiences for modern academic needs.'
    }
  ];

  const timeline = [
    {
      year: '2020',
      title: 'The Vision',
      description: 'Founded with the mission to bridge the gap between students and domain experts in academic research.'
    },
    {
      year: '2021',
      title: 'First Launch',
      description: 'Launched beta version with 100 students and 25 domain experts across 5 universities.'
    },
    {
      year: '2022',
      title: 'Rapid Growth',
      description: 'Expanded to 50+ universities with over 1,000 successful project collaborations.'
    },
    {
      year: '2023',
      title: 'Global Reach',
      description: 'Reached 100+ universities worldwide and introduced advanced collaboration tools.'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Launched AI-powered matching system and real-time collaboration features.'
    },
    {
      year: '2025',
      title: 'Academic Excellence',
      description: 'Leading platform with 10,000+ students and comprehensive academic support ecosystem.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Co-Founder & CEO',
      image: '/image/user.jpg',
      description: 'Former Stanford professor with 15+ years in educational technology.'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Co-Founder & CTO',
      image: '/image/user.jpg',
      description: 'Ex-Google engineer passionate about academic collaboration platforms.'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of Academic Relations',
      image: '/image/user.jpg',
      description: 'Harvard PhD with expertise in student mentorship and academic integrity.'
    },
    {
      name: 'James Kim',
      role: 'Head of Product',
      image: '/image/user.jpg',
      description: 'Former Microsoft PM focused on educational user experience design.'
    }
  ];

  return (
    <>
      <NavBar />

      {/* Hero Section */}
      <div className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-primary via-secondary to-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
              <Heart className="w-5 h-5 text-accent mr-2" />
              <span className="text-value3 font-medium">Empowering Academic Excellence Since 2020</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
              About{' '}
              <span className="bg-gradient-to-r from-accent via-info to-accent bg-clip-text text-transparent">
                BrainMap
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-value3 max-w-4xl mx-auto leading-relaxed font-light mb-12">
              We're revolutionizing academic collaboration by connecting students with trusted domain experts, 
              fostering ethical learning environments, and empowering the next generation of researchers and scholars.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              

              <Link href="/community" >
                <CustomButton
                text="Join Our Community"
                backgroundColor="bg-white"
                textColor="text-primary"
                hoverBackgroundColor="hover:bg-value3"
                icon={ArrowRight}
                onClick={() => handleClick('Join Community')}
                />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/15 backdrop-blur-xl hover:bg-white/25 text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:border-accent/50 transition-all duration-500"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <stat.icon className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
                <Target className="w-5 h-5 text-primary mr-2" />
                <span className="text-primary font-semibold">Our Mission</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Bridging the gap between 
                <span className="text-primary"> students</span> and 
                <span className="text-secondary"> experts</span>
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                BrainMap was born from a simple yet powerful idea: every student deserves access to expert guidance 
                in their academic journey. We create meaningful connections that foster learning, maintain academic 
                integrity, and drive innovation in education.
              </p>

              <div className="space-y-4">
                {[
                  'Connect students with verified domain experts',
                  'Maintain highest standards of academic integrity',
                  'Provide tools for seamless collaboration',
                  'Track academic progress and achievements'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="w-24 h-24 text-primary mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Academic Collaboration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Star className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Our Values</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What drives us forward
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our core values shape every decision we make and every feature we build, 
              ensuring BrainMap remains a trusted platform for academic excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-xl mb-6">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Our Journey</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Five years of growth
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From a small idea to a global platform, here's how BrainMap has evolved 
              to serve the academic community better.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary to-secondary"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}>
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Users className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Our Team</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the minds behind BrainMap
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our diverse team brings together expertise in education, technology, and academic research 
              to create the best possible experience for our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-primary font-medium mb-4">{member.role}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to join our community?
          </h2>
          
          <p className="text-xl text-value3 mb-12 leading-relaxed">
            Whether you're a student seeking expert guidance or a domain expert wanting to share your knowledge, 
            BrainMap is the perfect platform to connect, collaborate, and achieve academic excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <CustomButton
              text="Get Started as Student"
              backgroundColor="bg-white"
              textColor="text-primary"
              hoverBackgroundColor="hover:bg-value3"
              icon={GraduationCap}
              onClick={() => handleClick('Student Signup')}
            />
            
            <CustomButton
              text="Become an Expert"
              backgroundColor="bg-white/15"
              textColor="text-white"
              hoverBackgroundColor="hover:bg-white hover:text-primary"
              icon={Users}
              onClick={() => handleClick('Expert Signup')}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;