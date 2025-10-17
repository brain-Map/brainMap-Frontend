'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import KanbanBoard from './Kanban';
import ProjectOverview from './Project';

const Page = () => {
  const params = useParams();
  const projectId = params?.id as string;
  return (
    <>
      
      {/* <KanbanBoard /> */}

      <ProjectOverview params={{ id: projectId }} />
    </>
  );
};

export default Page;




