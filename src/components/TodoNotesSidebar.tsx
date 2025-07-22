import React, { useState } from 'react';
import { CheckSquare, Square, MoreHorizontal, FileText, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';



interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: Array<{
    text: string;
    color: string;
  }>;
}


const TodoNotesSidebar: React.FC = () => {
  const router = useRouter();
  

  const notes: Note[] = [
    {
      id: '1',
      title: 'ChatGPT tricks for business marketing',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ex mi. Fusce vitae blandit mauris. Duis sed enim vel dui cursus tincidunt mollis.',
      date: 'Apr 5, 2022',
      tags: [
        { text: 'Tools', color: 'bg-pink-100 text-pink-600' },
        { text: 'AI', color: 'bg-green-100 text-green-600' }
      ]
    },
    {
      id: '2',
      title: 'Notes on being a successful entrepreneur',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id ex mi. Fusce vitae blandit mauris. Duis sed enim vel dui cursus tincidunt mollis vel finibus ligula. Ut nec diam mauris consequat eleifend pharetra ut si amet.',
      date: 'Apr 3, 2022',
      tags: [
        { text: 'Business', color: 'bg-yellow-100 text-yellow-600' },
        { text: 'Self improvement', color: 'bg-blue-100 text-blue-600' }
      ]
    }
  ];





  const handlenavnote = () =>{
    router.push('/project-member/notes');
  }

  return (
    <div className="w-100  bg-white border-l border-gray-200 min-h-screen">
      
      {/* Notes Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Notes</h2>
          </div>
          <button onClick={() =>handlenavnote()} className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-800 text-sm leading-tight pr-2">
                  {note.title}
                </h3>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                {note.content}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoNotesSidebar;