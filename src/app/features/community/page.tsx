'use client';

import React from 'react';
import CustomButton from '@/components/CustomButtonModel';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';

const CommunityPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-secondary/50 via-value3/50 to-secondary/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid text-center items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 mb-8 border border-blue-100">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-slate-700 font-medium">Join 25,000+ project members</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Community Network
              <span className="text-primary"> for project success</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed font-normal mb-12">
              Collaborate with project members and experts, share knowledge, and grow together in a supportive community.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/community/create">
                <CustomButton
                  text="Join Community"
                  backgroundColor="bg-primary"
                  textColor="text-white"
                  hoverBackgroundColor="hover:bg-secondary hover:text-black"
                  icon={ArrowRight}
                  onClick={() => {}}
                />
              </Link>
              <Link href="/project-member/notes" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-lg rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300">
                View Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
