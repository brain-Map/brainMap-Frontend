"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Eye, Calendar, Tag, Code, HelpCircle, Reply, MoreHorizontal, ThumbsUp, Flag, Send, Smile, Loader2 } from "lucide-react"

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
  tags: Array<{
    name: string
    id: string
  }>
  likes: number
  comments: number
  views: number
  createdAt: string
  isLiked: boolean
  isBookmarked: boolean
  type: "discussion" | "project" | "help"
}

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

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    // Less than a minute ago
    if (diffInSeconds < 60) {
      return "Just now"
    }
    
    // Less than an hour ago
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }
    
    // Less than a day ago
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }
    
    // Less than a week ago
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
    
    // More than a week ago
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

export default function PostPage() {
  const params = useParams()
  const postId = params.id
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  // Fetch post data from API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:8080/api/v1/posts/${postId}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch post: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("Post Data: ", data);
        console.log("Post Title: ", data.title);
        
        
        // Transform API data to match our interface if needed
        const transformedPost: Post = {
          id: data.communityPostId || postId,
          title: data.title || "Untitled Post",
          content: data.content || "",
          author: {
            name: data.author?.username || "Anonymous",
            avatar: data.author?.avatar || "/placeholder.svg?height=40&width=40",
            role: data.author?.role || "Student",
            verified: data.author?.verified || false,
          },
          category: data.category || "General",
          tags: data.tags?.map(tag => ({
            name: tag.name,
            id: tag.id
          })) || [],
          likes: data.likes || 0,
          comments: data.comments || 0,
          views: data.views || 0,
          createdAt: formatDate(data.createdAt) || "Unknown",
          isLiked: data.isLiked || false,
          isBookmarked: data.isBookmarked || false,
          type: data.type?.toLowerCase() || "discussion",
        }
        
        setPost(transformedPost)
        
        // If the API response includes comments, set them
        if (data.commentsList) {
          setComments(data.commentsList)
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  const handleBack = () => {
    // In a real app, this would use router.back() or navigate to community page
    console.log("Navigate back to community")
  }

  const handleLike = async () => {
    if (!post) return
    
    try {
      const response = await fetch(`http://localhost:8080/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ liked: !post.isLiked }),
      })
      
      if (response.ok) {
        setPost({ 
          ...post, 
          isLiked: !post.isLiked, 
          likes: post.isLiked ? post.likes - 1 : post.likes + 1 
        })
      }
    } catch (err) {
      console.error("Error liking post:", err)
    }
  }

  const handleBookmark = async () => {
    if (!post) return
    
    try {
      const response = await fetch(`http://localhost:8080/posts/${post.id}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmarked: !post.isBookmarked }),
      })
      
      if (response.ok) {
        setPost({ ...post, isBookmarked: !post.isBookmarked })
      }
    } catch (err) {
      console.error("Error bookmarking post:", err)
    }
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

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post) return

    try {
      const response = await fetch(`http://localhost:8080/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })
      
      if (response.ok) {
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
    } catch (err) {
      console.error("Error submitting comment:", err)
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load post</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Post not found
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Post not found</h2>
          <p className="text-gray-600">The post you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

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
                        {post.type}
                        {/* <span>•</span> */}
                        {/* <Eye className="w-3 h-3" />
                        {post.views} views */}
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