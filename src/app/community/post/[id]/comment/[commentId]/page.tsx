"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, X, Loader2, MessageCircle, User, Reply, Send, ThumbsUp, Flag, Edit, Trash2 } from "lucide-react"
import { communityApi } from "@/services/communityApi"
import { useAuth } from "@/contexts/AuthContext"

interface Comment {
  id: string
  content: string
  author: {
    id?: string
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
  author: {
    name: string
    role: string
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

export default function CommentPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const postId = params.id as string
  const commentId = params.commentId as string
  
  const [comment, setComment] = useState<Comment | null>(null)
  const [post, setPost] = useState<Post | null>(null)
  const [editContent, setEditContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Reply functionality state
  const [mode, setMode] = useState<'view' | 'edit' | 'reply'>('view')
  const [replyContent, setReplyContent] = useState("")
  const [submittingReply, setSubmittingReply] = useState(false)

  // Fetch comment and post data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log("🔧 Fetching comment and post data...")
        console.log("🔧 Post ID:", postId)
        console.log("🔧 Comment ID:", commentId)
        
        // Fetch post data first
        const postData = await communityApi.getPost(postId)
        console.log("🔧 Post data received:", postData)
        
        const transformedPost: Post = {
          id: postData.communityPostId || postId,
          title: postData.title || "Untitled Post",
          author: {
            name: postData.author?.username || "Anonymous",
            role: postData.author?.role || "Student",
          }
        }
        setPost(transformedPost)
        
        // Find the comment in the post's comments
        const responseWithComments = postData as any
        if (responseWithComments.comments && Array.isArray(responseWithComments.comments)) {
          const foundComment = responseWithComments.comments.find((c: any) => c.id === commentId)
          
          if (foundComment) {
            const transformedComment: Comment = {
              id: foundComment.id,
              content: foundComment.content || "",
              author: {
                id: foundComment.authorId || foundComment.author?.id,
                name: foundComment.authorName || foundComment.author?.username || "Anonymous",
                avatar: "/placeholder.svg?height=32&width=32",
                role: foundComment.author?.role || "Student",
                verified: foundComment.author?.verified || false,
              },
              likes: foundComment.likes || 0,
              replies: [],
              createdAt: formatDate(foundComment.createdAt) || "Unknown",
              isLiked: foundComment.isLiked || false,
            }
            
            setComment(transformedComment)
            setEditContent(transformedComment.content)
            console.log("🔧 Comment found and set:", transformedComment)
          } else {
            setError("Comment not found")
            console.log("🔧 Comment not found in post comments")
          }
        } else {
          setError("No comments found in post")
          console.log("🔧 No comments array in post data")
        }
        
      } catch (err) {
        console.error("🔧 Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch comment")
      } finally {
        setLoading(false)
      }
    }

    if (postId && commentId) {
      fetchData()
    }
  }, [postId, commentId])

  // Check if user can edit this comment
  const canEdit = user && comment && (
    comment.author.name === "You" || 
    comment.author.id === user.id ||
    user.user_role === "Admin" || 
    user.user_role === "Moderator"
  )

  const handleSave = async () => {
    if (!editContent.trim() || !comment || !post || editContent === comment.content) {
      return
    }

    try {
      setSaving(true)
      console.log("🔧 Saving comment changes...")
      console.log("🔧 Original content:", comment.content)
      console.log("🔧 New content:", editContent)
      
      // Call API to update comment
      await communityApi.updateComment(post.id, comment.id, editContent)
      
      console.log("🔧 Comment updated successfully")
      
      // Navigate back to the post
      router.push(`/community/post/${postId}`)
      
    } catch (err) {
      console.error("🔧 Error saving comment:", err)
      setError(err instanceof Error ? err.message : "Failed to save comment")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (mode === 'edit') {
      setMode('view')
      setEditContent(comment?.content || "")
    } else if (mode === 'reply') {
      setMode('view')
      setReplyContent("")
    } else {
      router.push(`/community/post/${postId}`)
    }
  }

  const handleReply = async () => {
    if (!replyContent.trim() || !comment || !post) return

    try {
      setSubmittingReply(true)
      console.log("💬 Submitting reply to comment:", comment.id)
      
      const response = await communityApi.addComment(post.id, {
        content: replyContent.trim(),
        parentCommentId: comment.id
      })

      console.log("💬 Reply submitted successfully:", response)
      
      // Navigate back to the post to see the new reply
      router.push(`/community/post/${postId}`)
      
    } catch (err) {
      console.error("💬 Error submitting reply:", err)
      setError(err instanceof Error ? err.message : "Failed to submit reply")
    } finally {
      setSubmittingReply(false)
    }
  }

  const handleLikeComment = async () => {
    if (!comment || !post) return

    try {
      console.log("💬 Toggling like for comment:", comment.id)
      
      const response = await communityApi.toggleCommentLike(post.id, comment.id)
      
      // Update local comment state
      setComment({
        ...comment,
        isLiked: response.liked,
        likes: response.likesCount
      })
      
      console.log("💬 Comment like updated successfully")
      
    } catch (err) {
      console.error("💬 Error toggling comment like:", err)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading comment...</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Post
          </button>
        </div>
      </div>
    )
  }

  // Comment not found
  if (!comment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Comment not found</h2>
          <p className="text-gray-600">The comment you're looking for doesn't exist.</p>
          <button 
            onClick={handleCancel}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Post
          </button>
        </div>
      </div>
    )
  }

  // Show view mode by default if user can't edit (they can still reply)
  const showViewMode = !canEdit || mode === 'view'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {mode === 'view' ? 'Back to Post' : 'Back'}
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Comment' : mode === 'reply' ? 'Reply to Comment' : 'Comment Details'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {mode === 'view' && (
                <>
                  {canEdit && (
                    <button
                      onClick={() => {
                        setMode('edit')
                        setEditContent(comment?.content || "")
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => setMode('reply')}
                    className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                </>
              )}
              {mode === 'edit' && (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !editContent.trim() || editContent === comment?.content}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
              {mode === 'reply' && (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={submittingReply}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={submittingReply || !replyContent.trim()}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                  >
                    {submittingReply ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {submittingReply ? "Posting..." : "Post Reply"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Post Context */}
          {post && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {mode === 'edit' ? 'Editing comment on:' : mode === 'reply' ? 'Replying to comment on:' : 'Comment on:'}
              </h3>
              <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                By {post.author.name} • {post.author.role}
              </p>
            </div>
          )}

          {/* Comment Display and Actions */}
          {comment && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 border-2 border-gray-100 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-gray-600">
                    {comment.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{comment.author.name}</span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-normal">
                      {comment.author.role}
                    </span>
                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
                  </div>
                  
                  {/* Comment Content */}
                  {mode === 'view' && (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleLikeComment}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
                            comment.isLiked 
                              ? "text-blue-600 bg-blue-50 hover:bg-blue-100" 
                              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`} />
                          {comment.likes} likes
                        </button>
                        
                        <button
                          onClick={() => setMode('reply')}
                          className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                        
                        <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Flag className="w-4 h-4" />
                          Report
                        </button>
                      </div>
                    </>
                  )}
                  
                  {/* Edit Mode */}
                  {mode === 'edit' && (
                    <>
                      <div className="text-sm text-gray-500 mb-4">
                        <strong>Original comment:</strong>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                          Edit your comment:
                        </label>
                        <div className="space-y-3">
                          <textarea
                            id="edit-content"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
                            placeholder="Edit your comment..."
                            autoFocus
                          />
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-500">
                              {editContent.length} characters
                            </div>
                            <div className="text-gray-500">
                              {editContent === comment.content ? "No changes made" : "Changes detected"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Reply Mode */}
                  {mode === 'reply' && (
                    <>
                      <div className="text-sm text-gray-500 mb-4">
                        <strong>Replying to:</strong>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 mb-4">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <label htmlFor="reply-content" className="block text-sm font-medium text-gray-700 mb-2">
                          Your reply:
                        </label>
                        <div className="space-y-3">
                          <textarea
                            id="reply-content"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none"
                            placeholder="Write your reply..."
                            autoFocus
                          />
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-500">
                              {replyContent.length} characters
                            </div>
                            <div className="text-gray-500">
                              {replyContent.trim() ? "Ready to post" : "Enter your reply"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
