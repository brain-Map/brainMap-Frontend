"use client"

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Ban,
  Flag,
  User,
  Calendar,
  MoreVertical
} from 'lucide-react';

interface UserMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'student' | 'domain-expert' | 'project-member';
  messageType: 'support' | 'complaint' | 'inquiry' | 'report' | 'feedback';
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'in-review' | 'investigating' | 'resolved' | 'closed';
  timestamp: string;
  lastAction: string;
  actionBy?: string;
  flagged: boolean;
  attachments?: string[];
}

interface MessageStats {
  total: number;
  new: number;
  inReview: number;
  investigating: number;
  resolved: number;
  flagged: number;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<UserMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockMessages: UserMessage[] = [
      {
        id: '1',
        userId: 'usr_001',
        userName: 'John Smith',
        userEmail: 'john.smith@email.com',
        userRole: 'student',
        messageType: 'support',
        subject: 'Unable to access project dashboard',
        content: 'I\'ve been trying to access my project dashboard for the past 2 days but keep getting error messages. Can someone help me resolve this issue?',
        priority: 'high',
        status: 'new',
        timestamp: '2025-01-12T10:30:00Z',
        lastAction: 'Message received',
        flagged: false
      },
      {
        id: '2',
        userId: 'usr_002',
        userName: 'Sarah Johnson',
        userEmail: 'sarah.j@email.com',
        userRole: 'domain-expert',
        messageType: 'complaint',
        subject: 'Inappropriate behavior from a student',
        content: 'A student has been sending unprofessional messages and making inappropriate requests during our sessions. This needs immediate attention.',
        priority: 'urgent',
        status: 'investigating',
        timestamp: '2025-01-12T09:15:00Z',
        lastAction: 'Investigation started',
        actionBy: 'Admin Team',
        flagged: true
      },
      {
        id: '3',
        userId: 'usr_003',
        userName: 'Mike Davis',
        userEmail: 'mike.davis@email.com',
        userRole: 'project-member',
        messageType: 'inquiry',
        subject: 'Payment processing delay',
        content: 'My payment has been pending for over a week. When will it be processed?',
        priority: 'medium',
        status: 'in-review',
        timestamp: '2025-01-11T16:45:00Z',
        lastAction: 'Under review by finance team',
        actionBy: 'Finance Admin',
        flagged: false
      },
      {
        id: '4',
        userId: 'usr_004',
        userName: 'Emily Chen',
        userEmail: 'emily.chen@email.com',
        userRole: 'student',
        messageType: 'feedback',
        subject: 'Great experience with mentor',
        content: 'I wanted to share positive feedback about my mentor Dr. Wilson. The guidance has been exceptional.',
        priority: 'low',
        status: 'resolved',
        timestamp: '2025-01-11T14:20:00Z',
        lastAction: 'Feedback acknowledged',
        actionBy: 'Support Team',
        flagged: false
      },
      {
        id: '5',
        userId: 'usr_005',
        userName: 'David Brown',
        userEmail: 'david.brown@email.com',
        userRole: 'domain-expert',
        messageType: 'report',
        subject: 'Technical issues with video calls',
        content: 'Multiple students have reported audio/video quality issues during our sessions. This is affecting the learning experience.',
        priority: 'high',
        status: 'new',
        timestamp: '2025-01-11T11:30:00Z',
        lastAction: 'Report received',
        flagged: true
      }
    ];
    setMessages(mockMessages);
    setFilteredMessages(mockMessages);
  }, []);

  // Filter messages based on search and filters
  useEffect(() => {
    let filtered = messages.filter(message => {
      const matchesSearch = 
        message.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || message.messageType === typeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });

    setFilteredMessages(filtered);
  }, [messages, searchTerm, statusFilter, priorityFilter, typeFilter]);

  // Calculate stats
  const stats: MessageStats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    inReview: messages.filter(m => m.status === 'in-review').length,
    investigating: messages.filter(m => m.status === 'investigating').length,
    resolved: messages.filter(m => m.status === 'resolved').length,
    flagged: messages.filter(m => m.flagged).length,
  };

  const handleStatusChange = (messageId: string, newStatus: UserMessage['status']) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: newStatus, lastAction: `Status changed to ${newStatus}`, actionBy: 'Admin' }
        : msg
    ));
  };

  const handleFlagToggle = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, flagged: !msg.flagged, lastAction: msg.flagged ? 'Flag removed' : 'Message flagged', actionBy: 'Admin' }
        : msg
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage user messages, complaints, and inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inReview}</p>
            </div>
            <Eye className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investigating</p>
              <p className="text-2xl font-bold text-purple-600">{stats.investigating}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
            </div>
            <Flag className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search messages, users, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-review">In Review</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="support">Support</option>
              <option value="complaint">Complaint</option>
              <option value="inquiry">Inquiry</option>
              <option value="report">Report</option>
              <option value="feedback">Feedback</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{message.userName}</p>
                          {message.flagged && <Flag className="h-4 w-4 text-red-500" />}
                        </div>
                        <p className="text-sm text-gray-500">{message.userEmail}</p>
                        <p className="text-sm text-gray-900 font-medium mt-1">{message.subject}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{message.content}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {message.messageType}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                        {message.priority}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={message.status}
                      onChange={(e) => handleStatusChange(message.id, e.target.value as UserMessage['status'])}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(message.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="in-review">In Review</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{message.lastAction}</p>
                      {message.actionBy && (
                        <p className="text-sm text-gray-500">by {message.actionBy}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatTimestamp(message.timestamp)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleFlagToggle(message.id)}
                        className={`${message.flagged ? 'text-red-600 hover:text-red-900' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {showDetails && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-medium text-gray-900">Message Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">User Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedMessage.userName}</p>
                    <p><span className="font-medium">Email:</span> {selectedMessage.userEmail}</p>
                    <p><span className="font-medium">Role:</span> {selectedMessage.userRole}</p>
                    <p><span className="font-medium">User ID:</span> {selectedMessage.userId}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Message Information</h4>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Type:</span> {selectedMessage.messageType}</p>
                    <p><span className="font-medium">Priority:</span> {selectedMessage.priority}</p>
                    <p><span className="font-medium">Status:</span> {selectedMessage.status}</p>
                    <p><span className="font-medium">Flagged:</span> {selectedMessage.flagged ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900">Subject</h4>
                <p className="mt-2 text-gray-700">{selectedMessage.subject}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900">Message Content</h4>
                <div className="mt-2 p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900">Action History</h4>
                <div className="mt-2 space-y-2">
                  <p><span className="font-medium">Last Action:</span> {selectedMessage.lastAction}</p>
                  {selectedMessage.actionBy && (
                    <p><span className="font-medium">Action By:</span> {selectedMessage.actionBy}</p>
                  )}
                  <p><span className="font-medium">Timestamp:</span> {formatTimestamp(selectedMessage.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => handleFlagToggle(selectedMessage.id)}
                  className={`px-4 py-2 rounded-md ${
                    selectedMessage.flagged 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {selectedMessage.flagged ? 'Remove Flag' : 'Flag Message'}
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
