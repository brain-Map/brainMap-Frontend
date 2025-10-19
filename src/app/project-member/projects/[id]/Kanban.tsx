import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, User, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import api from '@/utils/api';


interface ApiColumn {
  columnId: string;
  type: string;
}

interface ApiTask {
  taskId: string;
  kanbanId: string;
  kanbanColumnId: string;
  title: string;
  description: string;
  createdDate: string;
  createdTime: string;
  dueDate?: string;
  priority?: 'Low' | 'Medium' | 'High';
  assignees?: string[];
}

interface UserData {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  avatar?: string;
  profilePicture?: string;
}

const kanbanFunction = {
  getKanban: async (projectId: string) => {
    try {
      const response = await api.get(`/project-member/projects/kanban-board/${projectId}`);
      console.log('kanban Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching kanban:', error);
      throw error;
    }
  },

    getCollaborators: async (projectId: string) => {
    try {
      const response = await api.get(`/project-member/projects/collaborators/${projectId}`);
      console.log('collaborators Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      throw error;
    }
  },

  addKanbanColumn: async (projectId: string, columnTitle: string) => {
    try {
      const columnData = { type: columnTitle };
      const response = await api.put(`/project-member/projects/kanban-board/${projectId}`, columnData);
      console.log('Added Kanban Column:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding kanban column:', error);
      throw error;
    }
  },

  deleteKanbanColumn: async (projectId: string, columnId: string) => {
    try {
      const columnData = { columnId: columnId };
      const response = await api.delete(`/project-member/projects/kanban-board/${projectId}`, {
        data: columnData
      });
      console.log('Deleted Kanban Column:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting kanban column:', error);
      throw error;
    }
  },

  addKanbanTask: async (kanbanId: string, taskData: {
    kanbanColumnId: string;
    title: string;
    description: string;
    priority?: 'Low' | 'Medium' | 'High';
    assignees?: string[];
    dueDate?: string;
  }) => {
    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const formattedTime = currentDate.toTimeString().split(' ')[0]; // HH:MM:SS
      
      const taskPayload = {
        kanbanId: kanbanId,
        kanbanColumnId: taskData.kanbanColumnId,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority || 'Medium',
        assignees: taskData.assignees || [],
        dueDate: taskData.dueDate || '',
        createdDate: formattedDate,
        createdTime: formattedTime
      };

      console.log('Task Payload:', taskPayload);
      
      const response = await api.post(`/api/tasks`, taskPayload);
      console.log('Added Kanban Task:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding kanban task:', error);
      throw error;
    }
  },

  getTasks: async (kanbanId: string) => {
    try {
      const response = await api.get(`/api/tasks/${kanbanId}`);
      console.log('Tasks Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getUser: async (userId: string) => {
    try {
      const response = await api.get(`/api/v1/users/${userId}`);
      console.log('User Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  updateTask: async (taskId: string, taskData: { title: string; description: string }) => {
    try {
      const response = await api.put(`/api/tasks/${taskId}`, taskData);
      console.log('Updated Task:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      const taskData = { taskId: taskId };
      const response = await api.delete(`/api/tasks`, {
        data: taskData
      });
      console.log('Deleted Task:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  updateTaskColumn: async (taskId: string, newColumnId: string) => {
     try {
      const response = await api.put(`/api/tasks/column/${taskId}`, { columnId: newColumnId });
      console.log('Updated Task Column:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating task column:', error);
      throw error;
    }
  }

};

const KanbanBoard: React.FC = () => {
    const params = useParams();
    const projectId = params.id as string; // Get the project ID from URL
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
    const [kanbanId, setKanbanId] = useState<string | null>(null);
    const [collaborators, setCollaborators] = useState<any[]>([]);
    const [userDetails, setUserDetails] = useState<Map<string, UserData>>(new Map());

    // Function to fetch user details for assignees
    const fetchUserDetails = async (assigneeIds: string[]) => {
      const newUserDetails = new Map(userDetails);
      const idsToFetch = assigneeIds.filter(id => !newUserDetails.has(id));
      
      if (idsToFetch.length === 0) return;

      try {
        const userPromises = idsToFetch.map(async (userId) => {
          try {
            const userData = await kanbanFunction.getUser(userId);
            return { id: userId, data: userData };
          } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return { id: userId, data: null };
          }
        });

        const userResults = await Promise.all(userPromises);
        
        userResults.forEach(({ id, data }) => {
          if (data) {
            newUserDetails.set(id, data);
          }
        });

        setUserDetails(newUserDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    useEffect(
      () => {
        const fetchKanbanData = async () => {
          try {
            console.log('Fetching kanban data for projectId:', projectId);
            const data = await kanbanFunction.getKanban(projectId);
            // console.log('Raw API response:', data);
            setKanbanId(data.kanbanId); // Assuming the API returns kanbanId
            
            // Check if data is an array (direct response) or has columns property
            const columnsArray = Array.isArray(data) ? data : data.columns;
            
            if (!Array.isArray(columnsArray)) {
              console.error('Expected array but got:', typeof columnsArray, columnsArray);
              return;
            }
            
            // Transform backend data to match our Column type
            const transformedColumns = columnsArray.map((column: ApiColumn) => ({
              id: column.columnId,
              title: column.type,
              count: 0, // Will be updated based on tasks
              tasks: [] // Initialize with empty tasks array
            }));
            
            setColumns(transformedColumns);
            console.log('Fetched Kanban Data:', transformedColumns);
          } catch (error: any) {
            console.error('Error fetching kanban data:', error);
            console.error('Error message:', error.message);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
          }
        };

        if (projectId) {
          fetchKanbanData();
        }
      },
      [projectId]
    );

    // Fetch tasks when kanbanId is available
    useEffect(() => {
      const fetchTasksAndOrganize = async () => {
        if (!kanbanId) return;
        
        try {
          console.log('Fetching tasks for kanbanId:', kanbanId);
          const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
          console.log('Fetched tasks:', tasks);

          // Collect all unique assignee IDs from all tasks
          const allAssigneeIds = tasks
            .flatMap(task => task.assignees || [])
            .filter((id, index, array) => array.indexOf(id) === index); // Remove duplicates
          
          // Fetch user details for all assignees
          if (allAssigneeIds.length > 0) {
            await fetchUserDetails(allAssigneeIds);
          }

          // Organize tasks by column
          setColumns(prevColumns => 
            prevColumns.map(column => {
              const columnTasks = tasks
                .filter(task => task.kanbanColumnId === column.id)
                .map(task => ({
                  id: task.taskId,
                  title: task.title,
                  description: task.description,
                  createdDate: task.createdDate,
                  createdTime: task.createdTime,
                  priority: task.priority || 'Medium',
                  assignees: task.assignees || [],
                  dueDate: task.dueDate || '',
                  progress: 0,
                  completed: false
                }));

              return {
                ...column,
                tasks: columnTasks,
                count: columnTasks.length
              };
            })
          );
        } catch (error) {
          console.error('Error fetching and organizing tasks:', error);
        }
      };

      fetchTasksAndOrganize();
    }, [kanbanId]); // Fetch tasks when kanbanId changes

  type Task = {
    id: string;
    title: string;
    description: string;
    priority?: 'Low' | 'Medium' | 'High';
    assignees?: string[];
    dueDate?: string;
    progress?: number;
    completed?: boolean;
    createdDate: string;
    createdTime: string;
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

  type EditTaskFormState = {
    taskId: string | null;
    isOpen: boolean;
    title: string;
    description: string;
  };

  type TaskDetailModalState = {
    isOpen: boolean;
    task: Task | null;
  };

  const [columns, setColumns] = useState<Column[]>([]);

  const [newTaskForm, setNewTaskForm] = useState<NewTaskFormState>({ columnId: null, isOpen: false });
  const [newColumnForm, setNewColumnForm] = useState<NewColumnFormState>({ isOpen: false, title: '' });
  const [editTaskForm, setEditTaskForm] = useState<EditTaskFormState>({ 
    taskId: null, 
    isOpen: false, 
    title: '', 
    description: '' 
  });
  const [taskDetailModal, setTaskDetailModal] = useState<TaskDetailModalState>({
    isOpen: false,
    task: null
  });

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const data = await kanbanFunction.getCollaborators(projectId);
        setCollaborators(data);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      }
    };

    if (projectId) {
      fetchCollaborators();
    }
  }, [projectId]);

  const getPriorityColor = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteCol = async (columnId: string) => {
    if (window.confirm('Are you sure you want to delete this column? This action cannot be undone.')) {
      try {
        await deleteColumn(columnId);
        setDropdownOpenId(null);
      } catch (error) {
        console.error('Failed to delete column:', error);
        alert('Failed to delete column. Please try again.');
      }
    }
  };

  const addTask = async (columnId: string, taskData: {
    title: string;
    description: string;
    priority?: 'Low' | 'Medium' | 'High';
    assignees?: string[];
    dueDate?: string;
  }) => {
    try {
      if (!kanbanId) {
        alert('Kanban ID not available. Please try again.');
        return;
      }

      await kanbanFunction.addKanbanTask(kanbanId, {
        kanbanColumnId: columnId,
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        assignees: taskData.assignees,
        dueDate: taskData.dueDate
      });
      
      // Refresh tasks by fetching them again
      const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
      
      // Collect all unique assignee IDs from all tasks
      const allAssigneeIds = tasks
        .flatMap(task => task.assignees || [])
        .filter((id, index, array) => array.indexOf(id) === index);
      
      // Fetch user details for all assignees
      if (allAssigneeIds.length > 0) {
        await fetchUserDetails(allAssigneeIds);
      }
      
      // Organize tasks by column
      setColumns(prevColumns => 
        prevColumns.map(column => {
          const columnTasks = tasks
            .filter(task => task.kanbanColumnId === column.id)
            .map(task => ({
              id: task.taskId,
              title: task.title,
              description: task.description,
              createdDate: task.createdDate,
              createdTime: task.createdTime,
              priority: task.priority || 'Medium',
              assignees: task.assignees || [],
              dueDate: task.dueDate || '',
              progress: 0,
              completed: false
            }));

          return {
            ...column,
            tasks: columnTasks,
            count: columnTasks.length
          };
        })
      );
      console.log('Fetched tasks after adding:', tasks);
      console.log('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const editTask = async (taskId: string, taskData: { title: string; description: string }) => {
    try {
      if (!kanbanId) {
        alert('Kanban ID not available. Please try again.');
        return;
      }

      await kanbanFunction.updateTask(taskId, taskData);
      
      // Refresh tasks by fetching them again
      const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
      
      // Collect all unique assignee IDs from all tasks
      const allAssigneeIds = tasks
        .flatMap(task => task.assignees || [])
        .filter((id, index, array) => array.indexOf(id) === index);
      
      // Fetch user details for all assignees
      if (allAssigneeIds.length > 0) {
        await fetchUserDetails(allAssigneeIds);
      }
      
      // Organize tasks by column
      setColumns(prevColumns => 
        prevColumns.map(column => {
          const columnTasks = tasks
            .filter(task => task.kanbanColumnId === column.id)
            .map(task => ({
              id: task.taskId,
              title: task.title,
              description: task.description,
              createdDate: task.createdDate,
              createdTime: task.createdTime,
              priority: task.priority || 'Medium',
              assignees: task.assignees || [],
              dueDate: task.dueDate || '',
              progress: 0,
              completed: false
            }));

          return {
            ...column,
            tasks: columnTasks,
            count: columnTasks.length
          };
        })
      );
      
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      if (!kanbanId) {
        alert('Kanban ID not available. Please try again.');
        return;
      }

      await kanbanFunction.deleteTask(taskId);
      
      // Refresh tasks by fetching them again
      const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
      
      // Collect all unique assignee IDs from all tasks
      const allAssigneeIds = tasks
        .flatMap(task => task.assignees || [])
        .filter((id, index, array) => array.indexOf(id) === index);
      
      // Fetch user details for all assignees
      if (allAssigneeIds.length > 0) {
        await fetchUserDetails(allAssigneeIds);
      }
      
      // Organize tasks by column
      setColumns(prevColumns => 
        prevColumns.map(column => {
          const columnTasks = tasks
            .filter(task => task.kanbanColumnId === column.id)
            .map(task => ({
              id: task.taskId,
              title: task.title,
              description: task.description,
              createdDate: task.createdDate,
              createdTime: task.createdTime,
              priority: task.priority || 'Medium',
              assignees: task.assignees || [],
              dueDate: task.dueDate || '',
              progress: 0,
              completed: false
            }));

          return {
            ...column,
            tasks: columnTasks,
            count: columnTasks.length
          };
        })
      );
      
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const addColumn = async (title: string) => {
    try {
      await kanbanFunction.addKanbanColumn(projectId, title);
      // Refresh the kanban data to get the updated columns
      const data = await kanbanFunction.getKanban(projectId);
      const columnsArray = Array.isArray(data) ? data : data.columns;
      
      const transformedColumns = columnsArray.map((column: ApiColumn) => ({
        id: column.columnId,
        title: column.type,
        count: 0,
        tasks: []
      }));
      
      setColumns(transformedColumns);
      
      // Fetch tasks if kanbanId is available
      if (kanbanId) {
        const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
        
        // Organize tasks by column
        setColumns(prevColumns => 
          prevColumns.map(column => {
            const columnTasks = tasks
              .filter(task => task.kanbanColumnId === column.id)
              .map(task => ({
                id: task.taskId,
                title: task.title,
                description: task.description,
                createdDate: task.createdDate,
                createdTime: task.createdTime,
                priority: 'Medium' as const,
                assignee: undefined,
                dueDate: undefined,
                progress: 0,
                completed: false
              }));

            return {
              ...column,
              tasks: columnTasks,
              count: columnTasks.length
            };
          })
        );
      }
      
      console.log('Column added successfully');
    } catch (error) {
      console.error('Error adding column:', error);
    }
  };

  const deleteColumn = async (columnId: string) => {
    try {
      await kanbanFunction.deleteKanbanColumn(projectId, columnId);
      // Refresh the kanban data to get the updated columns
      const data = await kanbanFunction.getKanban(projectId);
      const columnsArray = Array.isArray(data) ? data : data.columns;
      
      const transformedColumns = columnsArray.map((column: ApiColumn) => ({
        id: column.columnId,
        title: column.type,
        count: 0,
        tasks: []
      }));
      
      setColumns(transformedColumns);
      
      // Fetch tasks if kanbanId is available
      if (kanbanId) {
        const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
        
        // Organize tasks by column
        setColumns(prevColumns => 
          prevColumns.map(column => {
            const columnTasks = tasks
              .filter(task => task.kanbanColumnId === column.id)
              .map(task => ({
                id: task.taskId,
                title: task.title,
                description: task.description,
                createdDate: task.createdDate,
                createdTime: task.createdTime,
                priority: 'Medium' as const,
                assignee: undefined,
                dueDate: undefined,
                progress: 0,
                completed: false
              }));

            return {
              ...column,
              tasks: columnTasks,
              count: columnTasks.length
            };
          })
        );
      }
      
      console.log('Column deleted successfully');
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const getColumnTitle = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    return column ? column.title : '';
  };

  // Move a task to another column (with backend update)
  const moveTask = async (taskId: string, fromColumnId: string, toColumnId: string) => {
    try {
      // Update backend
      await kanbanFunction.updateTaskColumn(taskId, toColumnId);
      // Refresh tasks from backend
      if (kanbanId) {
        const tasks: ApiTask[] = await kanbanFunction.getTasks(kanbanId);
        
        // Collect all unique assignee IDs from all tasks
        const allAssigneeIds = tasks
          .flatMap(task => task.assignees || [])
          .filter((id, index, array) => array.indexOf(id) === index);
        
        // Fetch user details for all assignees
        if (allAssigneeIds.length > 0) {
          await fetchUserDetails(allAssigneeIds);
        }
        
        setColumns(prevColumns =>
          prevColumns.map(column => {
            const columnTasks = tasks
              .filter(task => task.kanbanColumnId === column.id)
              .map(task => ({
                id: task.taskId,
                title: task.title,
                description: task.description,
                createdDate: task.createdDate,
                createdTime: task.createdTime,
                priority: task.priority || 'Medium',
                assignees: task.assignees || [],
                dueDate: task.dueDate || '',
                progress: 0,
                completed: false
              }));
            return {
              ...column,
              tasks: columnTasks,
              count: columnTasks.length
            };
          })
        );
      }
    } catch (error) {
      console.error('Error moving task:', error);
      alert('Failed to move task. Please try again.');
    }
  };

  // const deleteTask = (taskId: number) => {

  // };

const TaskCard: React.FC<{ task: Task; currentColumnId: string }> = ({ task, currentColumnId }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    setEditTaskForm({
      taskId: task.id,
      isOpen: true,
      title: task.title,
      description: task.description
    });
    setShowMenu(false);
  };

  const handleCardClick = () => {
    setTaskDetailModal({
      isOpen: true,
      task: task
    });
  };

  // Move handler for TaskCard
  const handleMove = async (targetColumnId: string) => {
    if (targetColumnId !== currentColumnId) {
      await moveTask(task.id, currentColumnId, targetColumnId);
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
    setShowMenu(false);
  };

  

  return (
    <div 
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 text-sm">{task.title}</h3>

        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when clicking menu
              setShowMenu(!showMenu);
            }} 
            className="text-gray-500 hover:text-gray-700"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showMenu && (
            <div 
              className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-20 animate-fade-in"
              onClick={(e) => e.stopPropagation()} // Prevent card click when clicking menu items
            >
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
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                >
                  Edit Task
                </button>
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

      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority || 'Medium')}`}>
        {task.priority || 'Medium'}
      </span>

      <p className="text-gray-600 text-sm mb-3 mt-2">{task.description}</p>

      {(task.progress || 0) > 0 && (
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress || 0}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.assignees && task.assignees.length > 0 ? (
            <div className="flex items-center space-x-1">
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 3).map((assigneeId, index) => {
                  const user = userDetails.get(assigneeId);
                  const avatarUrl = user?.avatar || user?.profilePicture;
                  const userName = user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || user?.lastName || user?.userName || user?.email || 'Unknown';

                  return (
                    <div
                      key={assigneeId}
                      className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center overflow-hidden bg-blue-500"
                      title={userName}
                    >
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xs font-medium">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  );
                })}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      +{task.assignees.length - 3}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-700 ml-2">
                {task.assignees.length === 1 
                  ? (() => {
                      const user = userDetails.get(task.assignees[0]);
                      return user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.firstName || user?.lastName || user?.userName || 'Unknown';
                    })()
                  : `${task.assignees.length} assignees`
                }
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">Unassigned</span>
            </div>
          )}
        </div>
        <span className={`text-xs ${task.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
          {task.dueDate || task.createdDate}
        </span>
      </div>
    </div>
  );
};





  const TaskModalForm: React.FC<{
    columnId: string;
    columnTitle: string;
    onSubmit: (columnId: string, task: {
      title: string;
      description: string;
      priority?: 'Low' | 'Medium' | 'High';
      assignees?: string[];
      dueDate?: string;
    }) => void;
    onCancel: () => void;
    collaborators: any[];
  }> = ({ columnId, columnTitle, onSubmit, onCancel, collaborators }) => {
    const [formData, setFormData] = useState<{
      title: string;
      description: string;
      priority?: 'Low' | 'Medium' | 'High';
      assignees: string[];
      dueDate?: string;
    }>({
      title: '',
      description: '',
      priority: 'Medium',
      assignees: [],
      dueDate: ''
    });

    const handleSubmit = () => {
      if (formData.title.trim()) {
        onSubmit(columnId, formData);
        setFormData({ title: '', description: '', priority: 'Medium', assignees: [], dueDate: '' });
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

    const toggleAssignee = (assigneeId: string) => {
      setFormData(prev => ({
        ...prev,
        assignees: prev.assignees.includes(assigneeId)
          ? prev.assignees.filter(id => id !== assigneeId)
          : [...prev.assignees, assigneeId]
      }));
    };

    const getCollaboratorName = (collab: any) => {
      return collab.firstName && collab.lastName 
        ? `${collab.firstName} ${collab.lastName}`
        : collab.firstName || collab.lastName || collab.name || collab.userName || collab.email || 'Unknown';
    };

    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Add New Task to <span className="text-blue-600">{columnTitle}</span>
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-medium text-primary mb-4">Task Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter a clear and descriptive task title"
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
                        placeholder="Provide detailed description of the task, requirements, and any important notes..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-32 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="Low">🟢 Low Priority</option>
                          <option value="Medium">🟡 Medium Priority</option>
                          <option value="High">🔴 High Priority</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Team & Assignment */}
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-medium text-green-900 mb-4">Team Assignment</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Assign Team Members ({formData.assignees.length} selected)
                    </label>
                    
                    {collaborators && collaborators.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {collaborators.map((collab: any) => {
                          const collaboratorId = collab.id || collab.userId || collab.email;
                          const isSelected = formData.assignees.includes(collaboratorId);
                          const collaboratorName = getCollaboratorName(collab);
                          
                          return (
                            <div
                              key={collaboratorId}
                              onClick={() => toggleAssignee(collaboratorId)}
                              className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-blue-100 border-blue-300 shadow-sm' 
                                  : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {collaboratorName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{collaboratorName}</p>
                                  {collab.email && (
                                    <p className="text-xs text-gray-500">{collab.email}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No team members available</p>
                      </div>
                    )}
                    
                    {formData.assignees.length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border">
                        <p className="text-sm text-blue-700 font-medium">
                          Selected: {formData.assignees.length} team member{formData.assignees.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              <span className="text-red-500">*</span> Required fields
            </div>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.title.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  formData.title.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditTaskModalForm: React.FC<{
    onSubmit: (taskId: string, taskData: { title: string; description: string }) => void;
    onCancel: () => void;
    initialTitle: string;
    initialDescription: string;
  }> = ({ onSubmit, onCancel, initialTitle, initialDescription }) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);

    const handleSubmit = () => {
      if (title.trim() && editTaskForm.taskId) {
        onSubmit(editTaskForm.taskId, {
          title: title,
          description: description
        });
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
              Edit Task
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-24 resize-none"
              />
            </div>
          </div>
          
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-secondary hover:text-black transition-colors font-medium"
            >
              Update Task
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

  const TaskDetailModal: React.FC<{
    task: Task | null;
    onClose: () => void;
    userDetails: Map<string, UserData>;
  }> = ({ task, onClose, userDetails }) => {
    if (!task) return null;

    // Find the column name for this task
    const getTaskColumnName = () => {
      for (const column of columns) {
        if (column.tasks.some(t => t.id === task.id)) {
          return column.title;
        }
      }
      return 'Unknown';
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    const formatDate = (dateString: string) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatTime = (timeString: string) => {
      if (!timeString) return '';
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">
              Task Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Task Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
                </div>

                {/* Task Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border">
                    {task.description || 'No description provided'}
                  </p>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority || 'Medium')}`}>
                    {task.priority || 'Medium'}
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getTaskColumnName()}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Assignees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Assignees</label>
                  {task.assignees && task.assignees.length > 0 ? (
                    <div className="space-y-3">
                      {task.assignees.map((assigneeId) => {
                        const user = userDetails.get(assigneeId);
                        const avatarUrl = user?.avatar || user?.profilePicture;
                        const userName = user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.firstName || user?.lastName || 'Unknown User';
                        const userEmail = user?.email || '';
                        
                        return (
                          <div key={assigneeId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center">
                              {avatarUrl ? (
                                <img 
                                  src={avatarUrl} 
                                  alt={userName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-medium">
                                  {userName.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{userName}</p>
                              {userEmail && <p className="text-sm text-gray-600">{userEmail}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <p className="text-gray-600">No assignees</p>
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                      {formatDate(task.createdDate)}
                      {task.createdTime && (
                        <span className="block text-sm text-gray-600 mt-1">
                          at {formatTime(task.createdTime)}
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border">
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date set'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-h-screen w-full p-6">
      <div className="min-w-7xl rounded-lg">
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
                    onClick={async () => {
                      if (newColumnForm.title.trim()) {
                        await addColumn(newColumnForm.title);
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
          collaborators={collaborators}
        />
      )}

      {/* Edit Task Modal */}
      {editTaskForm.isOpen && (
        <EditTaskModalForm
          onSubmit={editTask}
          onCancel={() => setEditTaskForm({ taskId: null, isOpen: false, title: '', description: '' })}
          initialTitle={editTaskForm.title}
          initialDescription={editTaskForm.description}
        />
      )}

      {/* Task Detail Modal */}
      {taskDetailModal.isOpen && (
        <TaskDetailModal
          task={taskDetailModal.task}
          onClose={() => setTaskDetailModal({ isOpen: false, task: null })}
          userDetails={userDetails}
        />
      )}
    </div>
  );
};

export default KanbanBoard;