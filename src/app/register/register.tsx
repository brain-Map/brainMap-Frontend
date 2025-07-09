'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBarModel';
import CustomButton from '../../components/CustomButtonModel';
import { Mail, Lock, User, UploadCloud, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Register: React.FC = () => {
  const [role, setRole] = useState<'student' | 'mentor' | ''>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic here
    if (role === 'mentor') {
      console.log('Registering mentor:', { name, email, password, files });
    } else {
      console.log('Registering student:', { name, email, password });
    }
  };

  return (
    <>
      <NavBar />
      <div className={`min-h-screen bg-gray-100 flex items-center justify-center p-8${role === 'mentor' ? ' mt-6' : ''}`}>
        <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-2xl">
          <div className="min-h-[600px] flex">
            {/* Left Side - Logo and Description */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-secondary to-primary items-center justify-center px-12 rounded-l-2xl">
              <div className="text-center max-w-md">
                <div className="mb-8">
                  <Image
                    src="/image/BrainMap2.png"
                    alt="BrainMap Logo"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                </div>
                <h1 className="text-4xl font-bold text-[#3D52A0] mb-6">
                  Join BrainMap
                </h1>
                <p className="text-lg text-white leading-relaxed">
                  Start your journey with our comprehensive platform for academic collaboration, 
                  research management, and knowledge sharing. Connect with experts, manage your 
                  projects, and accelerate your learning journey.
                </p>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
              <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-black mb-2">Register</h2>
                  <p className="text-[#8697C4] text-lg">
                    Create your brainMap account
                  </p>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 focus:outline-none ${role === 'student' ? 'bg-primary text-white border-primary' : 'bg-[#EDE8F5] text-[#3D52A0] border-[#ADBBDA] hover:bg-primary hover:text-white'}`}
                    onClick={() => setRole('student')}
                    type="button"
                  >
                    Register as Student
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 focus:outline-none ${role === 'mentor' ? 'bg-primary text-white border-primary' : 'bg-[#EDE8F5] text-[#3D52A0] border-[#ADBBDA] hover:bg-primary hover:text-white'}`}
                    onClick={() => setRole('mentor')}
                    type="button"
                  >
                    Register as Mentor
                  </button>
                </div>

                {role && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8697C4]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#EDE8F5] text-[#3D52A0] rounded-lg border border-[#ADBBDA] focus:outline-none focus:ring-2 focus:ring-[#7091E6] placeholder-[#8697C4]"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8697C4]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#EDE8F5] text-[#3D52A0] rounded-lg border border-[#ADBBDA] focus:outline-none focus:ring-2 focus:ring-[#7091E6] placeholder-[#8697C4]"
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8697C4]" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full pl-12 pr-4 py-3 bg-[#EDE8F5] text-[#3D52A0] rounded-lg border border-[#ADBBDA] focus:outline-none focus:ring-2 focus:ring-[#7091E6] placeholder-[#8697C4]"
                      />
                    </div>
                    {role === 'mentor' && (
                      <div>
                        <label className="block text-[#3D52A0] mb-2 font-semibold">Upload Certifications / Proof / Experience</label>
                        <div className="flex items-center gap-2 bg-[#EDE8F5] rounded-lg border border-[#ADBBDA] px-4 py-3">
                          <UploadCloud className="w-5 h-5 text-[#8697C4]" />
                          <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="flex-1 text-[#3D52A0] bg-transparent focus:outline-none"
                          />
                        </div>
                        {files && files.length > 0 && (
                          <ul className="mt-2 text-[#3D52A0] text-sm">
                            {Array.from(files).map((file, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#8697C4]" /> {file.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <CustomButton
                      text="Register"
                      type="submit"
                      className="w-full bg-primary hover:bg-secondary text-white hover:text-black transition-colors duration-200"
                    />
                  </form>
                )}

                <div className="text-center text-[#8697C4]">
                  <p>
                    Already have an account?{' '}
                    <Link href="/login" className="text-black hover:text-primary font-medium transition-colors duration-200">
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register; 