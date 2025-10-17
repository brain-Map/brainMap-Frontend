'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MentorPublicProfile } from '@/types/mentor';

interface MentorAboutProps {
  mentor: MentorPublicProfile;
}

export const MentorAbout: React.FC<MentorAboutProps> = ({ mentor }) => {
  return (
    <Tabs defaultValue="bio" className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
        <TabsTrigger value="bio">Bio</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="expertise" className="hidden md:block">
          Expertise
        </TabsTrigger>
      </TabsList>

      {/* Bio Tab */}
      <TabsContent value="bio" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {mentor.bio}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Work Experience Tab */}
      <TabsContent value="experience" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {mentor.workExperience}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Education Tab */}
      <TabsContent value="education" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent>
            {mentor.educations && mentor.educations.length > 0 ? (
              <div className="space-y-4">
                {mentor.educations.map((education, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-lg">{education.degree}</h4>
                    <p className="text-gray-600">{education.school}</p>
                    <p className="text-gray-500 text-sm mt-1">{education.year}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No education information provided</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Expertise Tab */}
      <TabsContent value="expertise" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Areas of Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            {mentor.expertiseAreas && mentor.expertiseAreas.length > 0 ? (
              <div className="space-y-3">
                {mentor.expertiseAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800 capitalize">
                      {area.expertise.replace(/-/g, ' ')}
                    </span>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {area.experience} years
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No expertise areas specified</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
