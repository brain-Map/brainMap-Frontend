'use client';

import React, { useState } from 'react';
import NavBar from '../../components/NavBarModel';
import CustomButton from '../../components/CustomButtonModel';
import { Mail, Lock, User, UploadCloud, FileText } from 'lucide-react';
import Link from 'next/link';

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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register</h1>
            <p className="text-gray-500 mt-2">Create your brainMap account</p>
          </div>
          
          <div className="flex justify-center gap-3 mb-6">
            <button
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                role === 'student' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setRole('student')}
              type="button"
            >
              Project Member
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                role === 'mentor' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setRole('mentor')}
              type="button"
            >
              Mentor
            </button>
          </div>

          {role && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                />
              </div>
              
              {role === 'mentor' && (
                <div>
                  <label className="block text-gray-700 mb-2 font-medium text-sm">
                    Upload Certifications / Proof / Experience
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 transition-colors">
                    <UploadCloud className="w-5 h-5 text-gray-400" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="flex-1 text-gray-600 bg-transparent focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {files && files.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {Array.from(files).map((file, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                          <FileText className="w-4 h-4 text-blue-500" /> 
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Register
              </button>
            </form>
          )}
          
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;