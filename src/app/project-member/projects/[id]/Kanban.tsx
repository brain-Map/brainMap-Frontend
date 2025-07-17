import React, { useState } from 'react';
import { Plus, MoreHorizontal, User, X } from 'lucide-react';

const KanbanBoard: React.FC = () => {
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  

  type Task = {
    id: number;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    assignee: string;
    dueDate: string;
    progress: number;
    completed?: boolean;
  };

  type Column = {
    id: string;
    title: string;
    count: number;
    tasks: Task[];
  };

  type NewTaskFormState = {
    columnId: string | null;
    isOpen: boolean;
  };

  type NewColumnFormState = {
    isOpen: boolean;
    title: string;
  };

  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      count: 3,
      tasks: [
        {
          id: 1,
          title: 'Design Homepage Layout',
          description: 'Create wireframes and mockups for the new homepage design',
          priority: 'High',
          assignee: 'Jane Smith',
          dueDate: 'Dec 15',
          progress: 0
        },
        {
          id: 2,
          title: 'User Research',
          description: 'Conduct user interviews for feature validation',
          priority: 'Medium',
          assignee: 'John Doe',
          dueDate: 'Dec 20',
          progress: 0
        },
        {
          id: 3,
          title: 'Database Schema',
          description: 'Design database structure for new features',
          priority: 'Low',
          assignee: 'Mike Johnson',
          dueDate: 'Dec 25',
          progress: 0
        }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      count: 2,
      tasks: [
        {
          id: 4,
          title: 'API Development',
          description: 'Building REST API endpoints for user management',
          priority: 'High',
          assignee: 'Mike Johnson',
          dueDate: 'Dec 18',
          progress: 60
        },
        {
          id: 5,
          title: 'Mobile App Testing',
          description: 'QA testing for iOS and Android applications',
          priority: 'Medium',
          assignee: 'Jane Smith',
          dueDate: 'Dec 22',
          progress: 40
        }
      ]
    },
    {
      id: 'review',
      title: 'Review',
      count: 1,
      tasks: [
        {
          id: 6,
          title: 'Landing Page Copy',
          description: 'Review and approve marketing copy for landing page',
          priority: 'Medium',
          assignee: 'Jane Smith',
          dueDate: 'Dec 16',
          progress: 100
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      count: 2,
      tasks: [
        {
          id: 7,
          title: 'Logo Design',
          description: 'Create brand logo and style guide',
          priority: 'Low',
          assignee: 'John Doe',
          dueDate: 'Completed',
          progress: 100,
          completed: true
        },
        {
          id: 8,
          title: 'User Authentication',
          description: 'Implement secure login and registration system',
          priority: 'High',
          assignee: 'Mike Johnson',
          dueDate: 'Completed',
          progress: 100,
          completed: true
        }
      ]
    }
  ]);

  const [newTaskForm, setNewTaskForm] = useState<NewTaskFormState>({ columnId: null, isOpen: false });
  const [newColumnForm, setNewColumnForm] = useState<NewColumnFormState>({ isOpen: false, title: '' });

  const getPriorityColor = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCol = (projectId:any) =>{

    // Implement your delete logic here
    alert(`Delete project ${projectId}`);
    setDropdownOpenId(null);

  }

  const addTask = (columnId: string, taskData: Omit<Task, 'id' | 'progress'>) => {
    const newTask: Task = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      assignee: taskData.assignee,
      dueDate: taskData.dueDate,
      progress: 0
    };

    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, tasks: [...col.tasks, newTask], count: col.count + 1 }
        : col
    ));
  };

  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: Date.now().toString(),
      title,
      count: 0,
      tasks: []
    };
    setColumns([...columns, newColumn]);
  };

  const getColumnTitle = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    return column ? column.title : '';
  };

  const moveTask = (taskId: number, fromColumnId: string, toColumnId: string) => {
    let movedTask: Task | null = null;

    const updatedColumns = columns.map((col) => {
      if (col.id === fromColumnId) {
        const taskIndex = col.tasks.findIndex((task) => task.id === taskId);
        if (taskIndex !== -1) {
          movedTask = col.tasks[taskIndex];
          const updatedTasks = [...col.tasks];
          updatedTasks.splice(taskIndex, 1);
          return { ...col, tasks: updatedTasks, count: updatedTasks.length };
        }
      }
      return col;
    });

    if (movedTask) {
      const finalColumns = updatedColumns.map((col) => {
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, movedTask!], count: col.tasks.length + 1 };
        }
        return col;
      });
      setColumns(finalColumns);
    }
  };

  const deleteTask = (taskId: number) => {

  };

const TaskCard: React.FC<{ task: Task; currentColumnId: string }> = ({ task, currentColumnId }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMove = (targetColumnId: string) => {
    if (targetColumnId !== currentColumnId) {
      moveTask(task.id, currentColumnId, targetColumnId);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowMenu(false);
  };

  

  return (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20 animate-fade-in">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500">Move to</div>
              <div className="py-1">
                {columns
                  .filter((col) => col.id !== currentColumnId)
                  .map((col) => (
                    <button
                      key={col.id}
                      onClick={() => handleMove(col.id)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-150"
                    >
                      {col.title}
                    </button>
                  ))}
              </div>
              <div className="border-t border-gray-200">
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                >
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
        {task.priority}
      </span>

      <p className="text-gray-600 text-sm mb-3 mt-2">{task.description}</p>

      {task.progress > 0 && (
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm text-gray-700">{task.assignee}</span>
        </div>
        <span className={`text-xs ${task.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
          {task.dueDate}
        </span>
      </div>
    </div>
  );
};





  const TaskModalForm: React.FC<{
    columnId: string;
    columnTitle: string;
    onSubmit: (columnId: string, task: Omit<Task, 'id' | 'progress'>) => void;
    onCancel: () => void;
  }> = ({ columnId, columnTitle, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Task, 'id' | 'progress'>>({
      title: '',
      description: '',
      priority: 'Medium',
      assignee: '',
      dueDate: ''
    });

    const handleSubmit = () => {
      if (formData.title.trim()) {
        onSubmit(columnId, formData);
        setFormData({ title: '', description: '', priority: 'Medium', assignee: '', dueDate: '' });
        onCancel();
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    };

    return (
      <div 
        className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Add Task to {columnTitle}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-24 resize-none"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                <input
                  type="text"
                  placeholder="Enter assignee name"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="text"
                placeholder="Enter due date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-secondary hover:text-black transition-colors font-medium"
            >
              Add Task
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-screen w-full p-6">
      <div className="min-w-full rounded-lg">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <button
            onClick={() => setNewColumnForm({ isOpen: true, title: '' })}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary hover:text-black transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Column
          </button>
        </div>

        <div className="overflow-x-auto max-w-screen-2xl">
          <div className="flex gap-4 pb-6 w-full">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80 bg-value3 rounded-lg p-4 relative">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <h2 className="font-semibold text-gray-900">{column.title}</h2>
      <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
        {column.count}
      </span>
    </div>
    <div className="relative">
      <button
        onClick={() =>
          setDropdownOpenId(dropdownOpenId === column.id ? null : column.id)
        }
        className="text-gray-500 hover:text-gray-700"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {dropdownOpenId === column.id && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 text-left rounded-md transition duration-150 ease-in-out"
            onClick={() => handleDeleteCol(column.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  </div>

  <div className="space-y-3">
    {column.tasks.map((task) => (
      <TaskCard key={task.id} task={task} currentColumnId={column.id} />
    ))}

    <button
      onClick={() => setNewTaskForm({ columnId: column.id, isOpen: true })}
      className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Task
    </button>
  </div>
</div>
            ))}

            {newColumnForm.isOpen && (
              <div className="flex-shrink-0 w-80 bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
                <input
                  type="text"
                  placeholder="Column title"
                  value={newColumnForm.title}
                  onChange={(e) => setNewColumnForm({ ...newColumnForm, title: e.target.value })}
                  className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (newColumnForm.title.trim()) {
                        addColumn(newColumnForm.title);
                        setNewColumnForm({ isOpen: false, title: '' });
                      }
                    }}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-secondary hover:text-black transition-colors"
                  >
                    Add Column
                  </button>
                  <button
                    onClick={() => setNewColumnForm({ isOpen: false, title: '' })}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {newTaskForm.isOpen && newTaskForm.columnId && (
        <TaskModalForm
          columnId={newTaskForm.columnId}
          columnTitle={getColumnTitle(newTaskForm.columnId)}
          onSubmit={addTask}
          onCancel={() => setNewTaskForm({ columnId: null, isOpen: false })}
        />
      )}
    </div>
  );
};

export default KanbanBoard;