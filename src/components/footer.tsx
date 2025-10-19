'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight,
  ChevronUp,
  Heart,
  Star,
  Users,
  Trophy,
  Shield,
  Zap
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const footerSections: FooterSection[] = [
    {
      title: 'Platform',
      links: [
        { label: 'Project Management', href: '/features/project-management' },
        { label: 'Expert Mentorship', href: '/features/mentorship' },
        { label: 'Community Forum', href: '/community' },
        { label: 'Kanban Boards', href: '/features/kanban' },
        { label: 'Progress Tracking', href: '/features/tracking' },
      ]
    },
    {
      title: 'For Teams',
      links: [
        { label: 'Startups', href: '/solutions/startups' },
        { label: 'Enterprises', href: '/solutions/enterprise' },
        { label: 'Students', href: '/solutions/students' },
        { label: 'Professionals', href: '/solutions/professionals' },
        { label: 'Pricing', href: '/pricing' },
      ]
    },
    {
      title: 'Experts',
      links: [
        { label: 'Become an Expert', href: '/becomeamentor' },
        { label: 'Expert Directory', href: '/search-experts' },
        { label: 'Success Stories', href: '/success-stories' },
        { label: 'Expert Resources', href: '/expert-resources' },
        { label: 'Certification', href: '/certification' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'API Documentation', href: '/docs/api' },
        { label: 'Blog', href: '/blog' },
        { label: 'Webinars', href: '/webinars' },
        { label: 'Templates', href: '/templates' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press Kit', href: '/press' },
        { label: 'Partners', href: '/partners' },
      ]
    }
  ];

  const socialLinks: SocialLink[] = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/brainmap',
      icon: <Facebook className="w-5 h-5" />,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/brainmap',
      icon: <Twitter className="w-5 h-5" />,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/brainmap',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'hover:text-blue-700'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/brainmap',
      icon: <Instagram className="w-5 h-5" />,
      color: 'hover:text-pink-600'
    }
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary to-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-accent to-info rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <Link href="/" className="inline-block group">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src="/image/BrainMap.png"
                        alt="BrainMap Logo"
                        width={160}
                        height={48}
                        className="object-contain transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </Link>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                The universal project management platform that connects teams with verified domain experts. 
                Transform your projects with intelligent collaboration and expert guidance.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span>123 ABC Street, Colombo</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-secondary" />
                  </div>
                  <span>011 2345 678</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <span>hello@brainmap.com</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-white font-semibold text-lg mb-6 relative">
                      {section.title}
                      <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                    </h4>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            target={link.isExternal ? '_blank' : undefined}
                            rel={link.isExternal ? 'noopener noreferrer' : undefined}
                            className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform duration-200">
                              {link.label}
                            </span>
                            {link.isExternal && <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright and Legal */}
            <div className="flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-400">
              <p>&copy; {currentYear} BrainMap Technologies Inc. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Social Links and Back to Top */}
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-200 hover:scale-110 backdrop-blur-sm`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>

              {/* Back to Top Button */}
              <button
                onClick={handleScrollToTop}
                className="w-10 h-10 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg group"
                aria-label="Back to top"
              >
                <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Made with Love Section */}
      <div className="relative z-10 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              Made with 
              <Heart className="w-4 h-4 text-red-500 animate-pulse" /> 
              by the BrainMap Team
              <Zap className="w-4 h-4 text-accent" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
