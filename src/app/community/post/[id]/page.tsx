"use client"

import { useState } from "react"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Eye, Calendar, Tag, Code, HelpCircle, Reply, MoreHorizontal, ThumbsUp, Flag, Send, Smile } from "lucide-react"

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
    verified: boolean
  }
  likes: number
  replies: Comment[]
  createdAt: string
  isLiked: boolean
}

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
    verified: boolean
  }
  category: string
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  isLiked: boolean
  isBookmarked: boolean
  type: "discussion" | "project" | "help"
}

const mockPost: Post = {
  id: "1",
  title: "Building a Real-time Chat App with Next.js 14 and Socket.io",
  content: `Just completed an amazing real-time chat application using Next.js 14, Socket.io, and Prisma. This project has been a fantastic learning experience, and I wanted to share the journey with the community.

## Key Features Implemented:
- **Real-time messaging** with Socket.io
- **User authentication** using NextAuth.js
- **File sharing** with drag-and-drop support
- **Emoji reactions** and custom emoji picker
- **Group chats and direct messaging**
- **End-to-end encryption** for secure communication
- **Dark mode support** with theme persistence
- **Mobile-responsive design**

## Tech Stack:
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Socket.io, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Deployment**: Vercel + Railway

## Challenges Faced:
The biggest challenge was implementing real-time features while maintaining good performance. I had to optimize the Socket.io connections and implement proper room management for group chats.

## What I Learned:
This project taught me a lot about real-time web applications, WebSocket management, and scaling considerations. The authentication flow with NextAuth.js was also a great learning experience.

I've open-sourced the project on GitHub and would love to get feedback from the community. Feel free to ask any questions about the implementation!

**GitHub**: https://github.com/sarahchen/realtime-chat-app
**Live Demo**: https://chat-app-demo.vercel.app`,
  author: {
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Advanced Student",
    verified: true,
  },
  category: "Project Showcase",
  tags: ["Next.js", "Socket.io", "Real-time", "Chat", "TypeScript"],
  likes: 47,
  comments: 23,
  views: 342,
  createdAt: "2 hours ago",
  isLiked: false,
  isBookmarked: true,
  type: "project",
}

const mockComments: Comment[] = [
  {
    id: "1",
    content: "This is incredible work, Sarah! I've been trying to implement real-time features in my own project. Could you share more details about how you handled the Socket.io room management?",
    author: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Intermediate",
      verified: false,
    },
    likes: 8,
    replies: [
      {
        id: "1-1",
        content: "Thanks Alex! For room management, I created a custom hook that handles joining/leaving rooms based on the current chat context. I also implemented a cleanup function to prevent memory leaks. Happy to share the code snippet if you're interested!",
        author: {
          name: "Sarah Chen",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "Advanced Student",
          verified: true,
        },
        likes: 12,
        replies: [],
        createdAt: "1 hour ago",
        isLiked: false,
      },
      {
        id: "1-2",
        content: "That would be amazing! I'm particularly interested in the cleanup function part.",
        author: {
          name: "Alex Rodriguez",
          avatar: "/placeholder.svg?height=32&width=32",
          role: "Intermediate",
          verified: false,
        },
        likes: 3,
        replies: [],
        createdAt: "45 minutes ago",
        isLiked: true,
      },
    ],
    createdAt: "2 hours ago",
    isLiked: true,
  },
  {
    id: "2",
    content: "Great project! How did you handle the end-to-end encryption? I'm working on a similar project and security is a major concern for me.",
    author: {
      name: "Michael Kim",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Advanced Student",
      verified: true,
    },
    likes: 15,
    replies: [],
    createdAt: "1.5 hours ago",
    isLiked: false,
  },
  {
    id: "3",
    content: "The UI looks fantastic! Did you use any specific component library or is it all custom Tailwind? The dark mode implementation is particularly smooth.",
    author: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "Beginner",
      verified: false,
    },
    likes: 6,
    replies: [],
    createdAt: "1 hour ago",
    isLiked: false,
  },
]

const popularTags = [
  { name: "JavaScript", count: 2345, color: "bg-yellow-100 text-yellow-800" },
  { name: "React", count: 1890, color: "bg-blue-100 text-blue-800" },
  { name: "Python", count: 1456, color: "bg-green-100 text-green-800" },
  { name: "TypeScript", count: 987, color: "bg-blue-100 text-blue-800" },
  { name: "Node.js", count: 876, color: "bg-green-100 text-green-800" },
]

const topContributors = [
  { name: "Alex Chen", avatar: "👨‍💻", points: 12450 },
  { name: "Sarah Kim", avatar: "👩‍💻", points: 9876 },
  { name: "Mike Rodriguez", avatar: "👨‍🎓", points: 8234 },
  { name: "Emma Wilson", avatar: "👩‍🎓", points: 7654 },
]

export default function PostPage() {
  const [post, setPost] = useState<Post>(mockPost)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const handleBack = () => {
    // In a real app, this would use router.back() or navigate to community page
    console.log("Navigate back to community")
  }

  const handleLike = () => {
    setPost({ ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 })
  }

  const handleBookmark = () => {
    setPost({ ...post, isBookmarked: !post.isBookmarked })
  }

  const handleCommentLike = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(
        comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === commentId
                    ? { ...reply, isLiked: !reply.isLiked, likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1 }
                    : reply,
                ),
              }
            : comment,
        ),
      )
    } else {
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
            : comment,
        ),
      )
    }
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Student",
        verified: false,
      },
      likes: 0,
      replies: [],
      createdAt: "Just now",
      isLiked: false,
    }

    setComments([comment, ...comments])
    setNewComment("")
    setPost({ ...post, comments: post.comments + 1 })
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      content: replyContent,
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Student",
        verified: false,
      },
      likes: 0,
      replies: [],
      createdAt: "Just now",
      isLiked: false,
    }

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
    setReplyContent("")
    setReplyingTo(null)
  }

  const CommentComponent = ({
    comment,
    isReply = false,
    parentId,
  }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? "ml-6 mt-3" : ""}`}>
      <div className="flex gap-3">
        <div className="relative flex-shrink-0">
          <div className={`${isReply ? "w-7 h-7" : "w-9 h-9"} border-2 border-gray-100 rounded-full bg-gray-200 flex items-center justify-center`}>
            <span className="text-xs font-medium text-gray-600">
              {comment.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          {comment.author.verified && (
            <div className="absolute -bottom-0.5 -right-0.5 bg-blue-500 rounded-full p-0.5">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 text-sm">{comment.author.name}</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-normal">
                {comment.author.role}
              </span>
              <span className="text-xs text-gray-500">{comment.createdAt}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 ml-2">
            <button
              onClick={() => handleCommentLike(comment.id, isReply, parentId)}
              className={`flex items-center gap-1 text-xs h-7 px-2 rounded hover:bg-gray-100 transition-colors ${comment.isLiked ? "text-blue-600" : "text-gray-500"}`}
            >
              <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} />
              {comment.likes}
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-xs h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>
            )}
            <button className="flex items-center gap-1 text-xs h-7 px-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded transition-colors">
              <Flag className="w-3 h-3" />
              Report
            </button>
          </div>
          {replyingTo === comment.id && (
            <div className="mt-3 ml-2">
              <div className="space-y-2">
                <textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full min-h-[70px] p-3 border border-gray-200 rounded-md resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setReplyingTo(null)} 
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          )}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentComponent key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      <div className="sticky top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 py-4 mt-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 text-white bg-primary hover:bg-secondary hover:text-black rounded-md transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Community
            </button>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              {post.type === "project" && (
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <Code className="w-4 h-4 text-purple-600" />
                </div>
              )}
              {post.type === "help" && (
                <div className="p-1.5 bg-green-100 rounded-md">
                  <HelpCircle className="w-4 h-4 text-green-600" />
                </div>
              )}
              {post.type === "discussion" && (
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
              )}
              <span className="text-sm text-gray-600 font-medium">{post.category}</span>
            </div>
          </div>
        </div>
      </div>

      

      <div className="max-w-7xl mx-auto px-4 py-6">
    
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Tags</h3>
              <div className="space-y-2">
                {popularTags.map((tag) => (
                  <div key={tag.name} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-md text-sm font-medium ${tag.color}`}>
                      {tag.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tag.count > 1000 ? `${(tag.count / 1000).toFixed(1)}k` : tag.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <h3 className="font-semibold text-gray-900 mb-3">Top Contributors</h3>
              <div className="space-y-3">
                {topContributors.map((contributor) => (
                  <div key={contributor.name} className="flex items-center space-x-3">
                    <div className="text-2xl">{contributor.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{contributor.name}</div>
                      <div className="text-xs text-gray-500">{contributor.points.toLocaleString()} points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            
          </div>



          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Post Content */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-none">
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 border-2 border-gray-100 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-semibold text-gray-700">
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      {post.author.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-normal">
                          {post.author.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {post.createdAt}
                        <span>•</span>
                        <Tag className="w-3 h-3" />
                        {post.category}
                        <span>•</span>
                        <Eye className="w-3 h-3" />
                        {post.views} views
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-normal cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</div>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-red-50 transition-all duration-200 ${
                        post.isLiked ? "text-red-600 bg-red-50" : "text-gray-600"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`} />
                      {post.likes} likes
                    </button>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-5 h-5" />
                      {post.comments} comments
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBookmark}
                      className={`p-2 rounded-md hover:bg-yellow-50 transition-all duration-200 ${
                        post.isBookmarked ? "text-yellow-600 bg-yellow-50" : "text-gray-600"
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${post.isBookmarked ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-all duration-200">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-none">
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Comments ({comments.length})
                  </h2>
                </div>
              </div>
              <div className="px-6 pb-6 space-y-6">
                {/* Add Comment */}
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 border-2 border-gray-100 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600">Y</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Share your thoughts or ask a question..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full min-h-[90px] p-3 border border-gray-200 rounded-md resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            <Smile className="w-4 h-4" />
                            Emoji
                          </button>
                        </div>
                        <button
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim()}
                          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md transition-colors"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentComponent key={comment.id} comment={comment} />
                  ))}
                </div>

                {comments.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">No comments yet</h3>
                    <p className="text-gray-600">Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}