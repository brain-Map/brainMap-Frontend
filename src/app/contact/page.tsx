'use client';

import React, { useState } from 'react';
import CustomButton from '../../components/CustomButtonModel';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  HelpCircle,
  Users,
  Building,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Calendar,
  Shield,
  Heart,
  Zap
} from 'lucide-react';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after successful submission
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          message: ''
        });
      }, 3000);
    }, 2000);
  };

  const handleClick = (buttonName: string) => {
    console.log(`${buttonName} button clicked!`);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'support@brainmap.com',
      description: 'Get in touch with our support team',
      action: 'mailto:support@brainmap.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Speak directly with our team',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: '123 Innovation Drive, Tech Valley, CA 94025',
      description: 'Come visit our headquarters',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9AM-6PM PST',
      description: 'We\'re here to help during business hours',
      action: '#'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'project', label: 'Project Management Help' },
    { value: 'mentor', label: 'Become a Mentor' },
    { value: 'community', label: 'Community Support' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'enterprise', label: 'Enterprise Solutions' },
    { value: 'press', label: 'Press & Media' }
  ];

  const faqs = [
    {
      question: 'How do I get started with project management on BrainMap?',
      answer: 'Simply create an account, set up your first project with our Kanban boards and to-do lists, invite team members, and start collaborating. You can find domain experts anytime if you need guidance.'
    },
    {
      question: 'What qualifications do domain experts need?',
      answer: 'Domain experts must have proven expertise in their field, relevant professional experience, and pass our verification process. They come from various industries including business, technology, education, healthcare, and creative fields.'
    },
    {
      question: 'How does the community feature work?',
      answer: 'Users can create posts about domain-specific issues or questions in our community section. Other platform members can like, comment, and engage in discussions to help solve problems collectively.'
    },
    {
      question: 'Is BrainMap suitable for all types of projects?',
      answer: 'Absolutely! Whether you\'re a student working on assignments, an entrepreneur building a startup, a corporate team managing initiatives, or anyone with a project idea, BrainMap adapts to your needs.'
    },
    {
      question: 'How do experts earn money through mentoring?',
      answer: 'Domain experts can set their hourly rates and offer mentoring sessions. They get paid for consultations, project guidance, and ongoing mentorship arrangements through our secure payment system.'
    }
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat'
    },
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Browse our comprehensive knowledge base',
      availability: 'Self-service',
      action: 'Visit Help Center'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Ask questions and get help from other users and experts',
      availability: 'Always active',
      action: 'Join Community'
    }
  ];

  return (
    <>
      {/* Hero Section */}
  
      <div className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-secondary/50 via-value3/50 to-secondary/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid text-center items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 mb-8 border border-blue-100">
                <Heart className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-slate-700 font-medium">We're here to help you succeed</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Get in{' '}
                <span className="text-primary">
                   Touch
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed font-normal mb-12">
                Have questions about BrainMap? Need project management support? Want to become a mentor? 
              Looking for community guidance? We're here to assist you every step of the way in your project journey.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <CustomButton
                text="Start Live Chat"
                backgroundColor="bg-white"
                textColor="text-primary"
                hoverBackgroundColor="hover:bg-value3"
                icon={MessageCircle}
                onClick={() => handleClick('Live Chat')}
              />
              
              <a
                href="#contact-form"
                className="px-8 py-4 bg-white backdrop-blur-xl hover:bg-white/25 text-primary font-bold text-lg rounded-xl border-2 border-white/30 hover:border-secondary transition-all duration-500"
              >
                Send Message
              </a>
            </div>

            </div>




          </div>
        </div>
      </div>


      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Phone className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Contact Information</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Multiple ways to reach us
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for you. Our dedicated team is ready to assist 
              with any questions or support you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 group-hover:bg-primary/20 transition-colors">
                  <info.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
                <div className="text-primary font-semibold mb-2">{info.details}</div>
                <p className="text-gray-600 text-sm">{info.description}</p>
                
                {info.action !== '#' && (
                  <a
                    href={info.action}
                    className="inline-flex items-center mt-4 text-primary hover:text-secondary font-medium transition-colors"
                  >
                    Contact Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Send className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Send us a Message</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's start a conversation
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours. 
              We're committed to providing excellent support for our community.
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all duration-200"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white transition-all duration-200"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white resize-none transition-all duration-200"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-secondary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-success/10 rounded-full mb-6">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Thank you for contacting us. We've received your message and will respond within 24 hours.
                </p>
                <p className="text-sm text-gray-500">
                  You should receive a confirmation email shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <HelpCircle className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Support Channels</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get help your way
            </h2>
            
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Whether you prefer instant chat, self-service resources, or community support, 
              we have multiple channels to ensure you get the help you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                  <channel.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{channel.title}</h3>
                <p className="text-gray-600 mb-4">{channel.description}</p>
                <div className="text-sm text-primary font-medium mb-6">{channel.availability}</div>
                
                <CustomButton
                  text={channel.action}
                  backgroundColor="bg-primary"
                  textColor="text-white"
                  hoverBackgroundColor="hover:bg-secondary hover:text-black"
                  onClick={() => handleClick(channel.action)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Star className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Frequently Asked Questions</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Quick answers to common questions
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find instant answers to the most common questions about BrainMap. 
              Can't find what you're looking for? Contact us directly.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <CustomButton
              text="View All FAQs"
              backgroundColor="bg-primary"
              textColor="text-white"
              hoverBackgroundColor="hover:bg-secondary hover:text-black"
              icon={ArrowRight}
              onClick={() => handleClick('View All FAQs')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          
          <p className="text-xl text-value3 mb-12 leading-relaxed">
            Our team is standing by to help you succeed. Whether you need project management guidance, 
            expert mentorship, community support, or technical assistance – we're here to support your 
            journey every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <CustomButton
              text="Schedule a Call"
              backgroundColor="bg-white"
              textColor="text-primary"
              hoverBackgroundColor="hover:bg-value3"
              icon={Calendar}
              onClick={() => handleClick('Schedule Call')}
            />
            
            <CustomButton
              text="Join Community"
              backgroundColor="bg-white/15"
              textColor="text-white"
              hoverBackgroundColor="hover:bg-white hover:text-primary"
              icon={Users}
              onClick={() => handleClick('Join Community')}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;