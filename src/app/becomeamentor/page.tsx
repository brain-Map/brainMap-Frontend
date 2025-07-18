'use client';
import React from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

const features = [
  {
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
        <span className="text-2xl">💵</span>
      </span>
    ),
    title: 'Earn Income',
    desc: 'Generate additional revenue by sharing your expertise with eager learners.',
  },
  {
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
        <span className="text-2xl">🧑‍💼</span>
      </span>
    ),
    title: 'Build Following',
    desc: 'Establish yourself as a thought leader and grow your professional network.',
  },
  {
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
        <span className="text-2xl">📖</span>
      </span>
    ),
    title: 'Share Knowledge',
    desc: 'Make a meaningful impact by guiding students and helping them achieve their goals.',
  },
  {
    icon: (
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
        <span className="text-2xl">📈</span>
      </span>
    ),
    title: 'Expand Skills',
    desc: 'Enhance your communication and leadership abilities while staying current.',
  },
];

export default function BecomeAMentor() {
  return (
    <>
      <NavBar />
      {/* Main content wrapper */}
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col items-center mt-18">
          <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-16">
            {/* Image Placeholder */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full h-auto max-w-2xl bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center border border-gray-200 overflow-hidden">
                <img src="/image/mentor.jpg" alt="Mentor" className="object-contain w-full h-auto rounded-2xl" />
              </div>
            </div>
            {/* Text Section */}
            <div className="w-full md:w-1/2 flex flex-col items-start">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-900 leading-tight">
                Why become a <br className="hidden md:block" /> mentor?
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Join our community of expert mentors and make a meaningful impact while growing your own career. Share your knowledge, build lasting connections, and create additional income streams.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center border border-gray-100">
                {f.icon}
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-base text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Info and Before You Begin Boxes Side by Side */}
          <div className="mt-10 w-full flex flex-col md:flex-row gap-8">
            {/* Info Box */}
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center text-center mb-6 md:mb-0">
              <h2 className="font-bold text-gray-800 text-3xl md:text-4xl mb-4">
                Transform lives while growing your career.
              </h2>
              <span className="text-gray-600 text-lg">
                As a mentor on BrainMap, you'll join industry professionals passionate about education. Set your own rates, build your personal brand, and make lasting impact on the next generation of professionals.
              </span>
            </div>
            {/* Before You Begin Box */}
            <div className="flex-1 bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-left shadow flex flex-col items-start">
              <h2 className="text-2xl font-bold text-yellow-800 mb-3">Before You Begin</h2>
              <p className="text-gray-700 mb-4">To become a mentor, you'll need to provide a few important details. Make sure you have the following ready:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-2">
                <li className="mb-1">Your qualifications (degrees, certifications, etc.)</li>
                <li className="mb-1">Proof documents like your CV or scanned certificates</li>
                <li className="mb-1">A brief personal bio to showcase your experience and passion</li>
              </ul>
              <p className="text-gray-700 mt-2">Having these ready will make the sign-up process smooth and quick!</p>
            </div>
          </div>
          {/* Mentor Register Image */}
          <div className="mt-8 w-full flex justify-center">
            <img
              src="/image/mentorregister.png"
              alt="Mentor Registration"
              className="w-full h-auto rounded-2xl shadow-lg border border-gray-200 object-contain"
            />
          </div>
          {/* buttons */}
          <div className="mt-8 flex gap-4">
            <Link href="/" className="px-10 py-4 rounded-2xl border border-gray-300 bg-white text-gray-700 font-bold text-xl hover:bg-gray-100 transition">&larr; Go Back</Link>
            <Link href="/register?role=Mentor" className="px-10 py-4 rounded-2xl bg-primary text-white font-bold text-xl transition-all duration-500 transform shadow-xl hover:bg-secondary hover:text-black">Become a Mentor</Link>
          </div>
        </div>
      </div>
    </>
  );
} 