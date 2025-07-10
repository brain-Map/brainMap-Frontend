'use client';

import React, { useState } from 'react';
import { Plus, ChevronDown, MoreHorizontal } from 'lucide-react';

interface Task {
  id: number;
  task: string;
  done: boolean;
  progress: string;
}

interface ProgressOption {
  value: string;
  color: string;
  bgColor: string;
}

interface TaskRowProps {
  task: Task;
  onToggle: (id: number) => void;
  onUpdateProgress: (id: number, newProgress: string) => void;
  onDelete: (id: number) => void;
  getProgressStyle: (progress: string) => string;
  progressOptions: ProgressOption[];
}

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, task: "Complete literature review for machine learning chapter", done: false, progress: "In progress" },
    { id: 2, task: "Schedule meeting with Dr. Chen for thesis guidance", done: false, progress: "Not yet started" },
    { id: 3, task: "Submit research proposal to ethics committee", done: true, progress: "Done" },
    { id: 4, task: "Analyze dataset from healthcare AI project", done: false, progress: "In progress" },
    { id: 5, task: "Prepare presentation for research symposium", done: false, progress: "Not yet started" },
    { id: 6, task: "Review peer feedback on methodology section", done: false, progress: "Waiting on" },
    { id: 7, task: "Collect survey responses from 100 participants", done: false, progress: "In progress" },
    { id: 8, task: "Draft abstract for conference submission", done: false, progress: "Not yet started" },
    { id: 9, task: "Update bibliography with recent publications", done: false, progress: "Not yet started" },
    { id: 10, task: "Run statistical analysis on experimental data", done: false, progress: "Waiting on" },
    { id: 11, task: "Collaborate with team on research findings", done: false, progress: "In progress" },
    { id: 12, task: "Prepare final thesis defense presentation", done: false, progress: "Not yet started" },
  ]);

  const [newTask, setNewTask] = useState<string>("");
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const progressOptions: ProgressOption[] = [
    { value: "Not yet started", color: "bg-red-100 text-red-700", bgColor: "bg-red-50" },
    { value: "In progress", color: "bg-yellow-100 text-yellow-700", bgColor: "bg-yellow-50" },
    { value: "Waiting on", color: "bg-blue-100 text-blue-700", bgColor: "bg-blue-50" },
    { value: "Done", color: "bg-green-100 text-green-700", bgColor: "bg-green-50" }
  ];

  const getProgressStyle = (progress: string): string => {
    const option = progressOptions.find(opt => opt.value === progress);
    return option ? option.color : "bg-gray-100 text-gray-700";
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, done: !task.done, progress: !task.done ? "Done" : "Not yet started" }
        : task
    ));
  };

  const updateProgress = (id: number, newProgress: string): void => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, progress: newProgress, done: newProgress === "Done" }
        : task
    ));
  };

  const addTask = (): void => {
    if (newTask.trim()) {
      const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
      setTasks([...tasks, {
        id: newId,
        task: newTask.trim(),
        done: false,
        progress: "Not yet started"
      }]);
      setNewTask("");
      setIsAddingTask(false);
    }
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(task => task.done).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">To-Do List</h1>
          <p className="text-gray-600 text-lg italic">
            Track your tasks, milestones and collaboration activities with domain experts.
          </p>
        </div>

        {/* To Do Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Section Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                <div className="flex items-center space-x-2">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">COUNT</span>
                <span className="text-lg font-semibold text-gray-900">{tasks.length}</span>
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-1 flex items-center">
                <span className="mr-2">📄</span>
                Task
              </div>
              <div className="col-span-6"></div>
              <div className="col-span-1 flex items-center">
                <span className="mr-2">☑️</span>
                Done
              </div>
              <div className="col-span-3 flex items-center">
                <span className="mr-2">🔄</span>
                Progress
              </div>
              <div className="col-span-1"></div>
            </div>
          </div>

          {/* Task List */}
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onUpdateProgress={updateProgress}
                onDelete={deleteTask}
                getProgressStyle={getProgressStyle}
                progressOptions={progressOptions}
              />
            ))}
            
            {/* Add New Task Row */}
            {isAddingTask ? (
              <div className="px-6 py-4 bg-blue-50 border-l-4 border-blue-400">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-7">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      placeholder="Enter new research task..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      disabled
                    />
                  </div>
                  <div className="col-span-3">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                      Not yet started
                    </span>
                  </div>
                  <div className="col-span-1 flex space-x-2">
                    <button
                      onClick={addTask}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingTask(false);
                        setNewTask("");
                      }}
                      className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-4 bg-gray-50">
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add new research task</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <span>
            {completedCount} of {tasks.length} tasks completed
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 rounded-full"></div>
              <span>Not started: {tasks.filter(t => t.progress === "Not yet started").length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
              <span>In progress: {tasks.filter(t => t.progress === "In progress").length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
              <span>Waiting: {tasks.filter(t => t.progress === "Waiting on").length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              <span>Done: {completedCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskRow: React.FC<TaskRowProps> = ({ task, onToggle, onUpdateProgress, onDelete, getProgressStyle, progressOptions }) => {
  const [showProgressMenu, setShowProgressMenu] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);

  return (
    <div className={`px-6 py-4 hover:bg-gray-50 transition-colors ${task.done ? 'bg-green-50' : ''}`}>
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Task Name */}
        <div className="col-span-7">
          <span className={`text-gray-900 ${task.done ? 'line-through text-gray-500' : ''}`}>
            {task.task}
          </span>
        </div>

        {/* Done Checkbox */}
        <div className="col-span-1">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
          />
        </div>

        {/* Progress Status */}
        <div className="col-span-3 relative">
          <button
            onClick={() => setShowProgressMenu(!showProgressMenu)}
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors hover:opacity-80 ${getProgressStyle(task.progress)}`}
          >
            <span>{task.progress}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Progress Dropdown */}
          {showProgressMenu && (
            <div className="absolute top-8 left-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg min-w-[160px]">
              {progressOptions.map((option: ProgressOption) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onUpdateProgress(task.id, option.value);
                    setShowProgressMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    task.progress === option.value ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
                    {option.value}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="col-span-1 relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>

          {showActions && (
            <div className="absolute top-8 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px]">
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowActions(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete research task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showProgressMenu || showActions) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => {
            setShowProgressMenu(false);
            setShowActions(false);
          }}
        />
      )}
    </div>
  );
};

export default TodoList;