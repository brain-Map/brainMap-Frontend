interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  time: string
  status?: "sent" | "delivered" | "read"
}

// Admin message management interface
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

export type { UserMessage, MessageStats };
export default Message;