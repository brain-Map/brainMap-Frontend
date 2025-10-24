"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Eye, Calendar, Tag, Code, HelpCircle, Reply, MoreHorizontal, ThumbsUp, Flag, Send, Smile, Loader2, Edit, Trash2 } from "lucide-react"
import { communityApi, PopularTag, TopCommenter } from "@/services/communityApi"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import DeleteModal from "@/components/modals/DeleteModal"
import { useDeleteModal } from "@/hooks/useDeleteModal"

interface Comment {
  id: string
  content: string
  postId?: string
  authorId?: string
  authorName?: string
  author?: {
    id?: string
    name: string
    avatar?: string
    role?: string
    verified?: boolean
  }
  likes?: number
  replies: Comment[] | null
  createdAt: string
  updatedAt?: string
  isLiked?: boolean
  parentCommentId?: string | null
  reply?: boolean
}

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
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

// Recursive Comment Component
const CommentComponent = ({ 
  comment, 
  onLike, 
  onReply, 
  replyingTo, 
  replyForms, 
  updateReplyForm, 
  handleSubmitReply, 
  router, 
  postId, 
  depth = 0 
}: {
  comment: Comment
  onLike: (id: string) => void
  onReply: (id: string) => void
  replyingTo: string | null
  replyForms: {[key: string]: string}
  updateReplyForm: (id: string, content: string) => void
  handleSubmitReply: (id: string) => void
  router: any
  postId: string
  depth?: number
}) => {
  const maxDepth = 3 // Limit nesting depth
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false)
  const replyEmojiRef = useRef<HTMLDivElement>(null)

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (replyEmojiRef.current && !replyEmojiRef.current.contains(event.target as Node)) {
        setShowReplyEmojiPicker(false)
      }
    }

    if (showReplyEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showReplyEmojiPicker])
 
  // Common emojis for reply picker
  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '😉', '😍', '🥰', '😘', '😗', '😙', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞',
    '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢',
    '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
    '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤐', '🥴',
    '😵', '🤤', '😪', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '🥳', '🤠', '🤡', '🥸', '🤑', '🤖', '👍', '👎', '👌', '✌️',
    '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋',
    '🤚', '🖐️', '🖖', '👋', '🤏', '💪', '🦾', '🖕', '✍️', '🙏',
    '🦶', '🦵', '🦿', '💄', '💋', '👄', '🦷', '👅', '👂', '🦻',
    '👃', '👣', '👁️', '👀', '🫀', '🫁', '🧠', '🗣️', '👤', '👥'
  ]

  // Add emoji to reply
  const addEmojiToReply = (emoji: string) => {
    if (replyingTo === comment.id) {
      updateReplyForm(comment.id, (replyForms[comment.id] || '') + emoji)
      setShowReplyEmojiPicker(false)
    }
  }

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l-2 border-gray-200 pl-4' : ''} mb-4`}>
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 border-2 border-gray-100 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {(comment.author?.name || comment.authorName || "A")
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 text-sm">
                {comment.author?.name || comment.authorName || "Anonymous"}
              </span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md font-normal">
                {comment.author?.role || "Student"}
              </span>
              <span className="text-xs text-gray-500">{comment.createdAt}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap mb-3">
              {comment.content}
            </p>
            
            {/* Comment Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 text-xs h-7 px-2 rounded hover:bg-gray-100 transition-colors ${
                  comment.isLiked ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? "fill-current" : ""}`} />
                {comment.likes || 0}
              </button>
              
              {depth < maxDepth && (
                <button
                  onClick={() => onReply(comment.id)}
                  className="flex items-center gap-1 text-xs h-7 px-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <textarea
                  placeholder="Write your reply..."
                  value={replyForms[comment.id] || ""}
                  onChange={(e) => updateReplyForm(comment.id, e.target.value)}
                  className="w-full min-h-[80px] p-3 border border-gray-200 rounded-md resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2 relative">
                    <button 
                      onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                      className="flex items-center gap-2 px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-sm"
                    >
                      <Smile className="w-3 h-3" />
                      Emoji
                    </button>
                    
                    {/* Reply Emoji Picker */}
                    {showReplyEmojiPicker && (
                      <div 
                        ref={replyEmojiRef}
                        className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4"
                      >
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Choose an emoji</h4>
                        <div className="grid grid-cols-10 gap-2 max-h-48 overflow-y-auto">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => addEmojiToReply(emoji)}
                              className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                              title={emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onReply(comment.id)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!(replyForms[comment.id] || "").trim()}
                      className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3">
                {comment.replies.map((reply) => (
                  <CommentComponent
                    key={reply.id}
                    comment={reply}
                    onLike={onLike}
                    onReply={onReply}
                    replyingTo={replyingTo}
                    replyForms={replyForms}
                    updateReplyForm={updateReplyForm}
                    handleSubmitReply={handleSubmitReply}
                    router={router}
                    postId={postId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PostPage() {
  const params = useParams()
  const postId = params.id
  const { user } = useAuth()
  const router = useRouter()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [replyForms, setReplyForms] = useState<{[key: string]: string}>({}) // For managing multiple reply forms
  const [sortBy, setSortBy] = useState("recent")
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [popularTags, setPopularTags] = useState<PopularTag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [topCommenters, setTopCommenters] = useState<TopCommenter[]>([])
  const [commentersLoading, setCommentersLoading] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)
  const emojiRef = useRef<HTMLDivElement>(null)

  const deleteModal = useDeleteModal({
    title: "Delete Post",
    confirmText: "Delete Post"
  })

  // Helper function to get tag color based on index
  const getTagColor = (index: number) => {
    const colors = [
      'bg-yellow-100 text-yellow-800',
      'bg-blue-100 text-blue-800', 
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800'
    ]
    return colors[index % colors.length]
  }

  // Fetch popular tags from API
  const fetchPopularTags = async () => {
    try {
      setTagsLoading(true)
      const data = await communityApi.getPopularTags()
      setPopularTags(data)
    } catch (err) {
      console.error("Error fetching popular tags:", err)
      // Fallback to empty array if API fails
      setPopularTags([])
    } finally {
      setTagsLoading(false)
    }
  }

  // Fetch top commenters for this post from API
  const fetchTopCommenters = async () => {
    if (!postId) return
    
    try {
      setCommentersLoading(true)
      const data = await communityApi.getTopCommenters(postId as string)
      setTopCommenters(data)
    } catch (err) {
      console.error("Error fetching top commenters:", err)
      // Fallback to empty array if API fails
      setTopCommenters([])
    } finally {
      setCommentersLoading(false)
    }
  }

  const handleEditPost = () => {
    setShowOptionsMenu(false)
    console.log("Edit post:", post?.id)
    router.push(`/community/post/${post?.id}/edit`)
  }

  const handleDeletePost = () => {
    setShowOptionsMenu(false)
    deleteModal.openModal(
      async (postId: string) => {
        await communityApi.deletePost(postId)
        router.push("/community")
      },
      [post?.id as string],
      post?.title
    )
  }

  // Handle post like/unlike
  const handleLike = async () => {
    if (!post) return
    
    try {
      console.log("❤️ Toggling like for post:", post.id)
      
      // Use unified like API for post
      const response = await communityApi.toggleLike(post.id, 'post')
      
      console.log("❤️ Post like response:", response)
      
      // Update post state immediately for instant feedback
      setPost(prev => prev ? {
        ...prev,
        isLiked: response.liked,           // Backend returns 'liked'
        likes: response.likesCount         // Backend returns 'likesCount'
      } : null)
      
      console.log("❤️ Post like updated successfully")
      
    } catch (error: any) {
      console.error("❤️ Error toggling post like:", error)
      // You might want to show a toast notification here
    }
  }

  // Handle bookmark toggle (placeholder for now)
  const handleBookmark = async () => {
    if (!post) return
    
    try {
      console.log("🔖 Toggling bookmark for post:", post.id)
      
      // This would be implemented when bookmark API is ready
      // const response = await communityApi.toggleBookmark(post.id)
      
      // For now, just toggle locally
      setPost(prev => prev ? {
        ...prev,
        isBookmarked: !prev.isBookmarked
      } : null)
      
      console.log("🔖 Bookmark toggled successfully")
      
    } catch (error: any) {
      console.error("🔖 Error toggling bookmark:", error)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false)
      }
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false)
      }
    }

    if (showOptionsMenu || showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOptionsMenu, showEmojiPicker])

  // Test function to check comment like status manually
  const testCommentLikeStatus = async (commentId: string) => {
    try {
      console.log("🧪 Testing comment like status for:", commentId)
      const response = await communityApi.getCommentLikeStatus(commentId)
      console.log("🧪 Comment like status response:", response)
    } catch (error) {
      console.error("🧪 Error testing comment like status:", error)
    }
  }

  // Emoji picker functionality
  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '😉', '😍', '🥰', '😘', '😗', '😙', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞',
    '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '🥺', '😢',
    '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱',
    '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤐', '🥴',
    '😵', '🤤', '😪', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
    '🥳', '🤠', '🤡', '🥸', '🤑', '🤖', '👍', '👎', '👌', '✌️',
    '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋',
    '🤚', '🖐️', '🖖', '👋', '🤏', '💪', '🦾', '🖕', '✍️', '🙏',
    '🦶', '🦵', '🦿', '💄', '💋', '👄', '🦷', '👅', '👂', '🦻',
    '👃', '👣', '👁️', '👀', '🫀', '🫁', '🧠', '🗣️', '👤', '👥'
  ]

  const addEmoji = (emoji: string) => {
    setNewComment(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Transform CommentResponse to Comment interface
  const transformComment = (comment: any): Comment => {
    return {
      id: comment.id,
      content: comment.content,
      postId: comment.postId,
      authorId: comment.authorId,
      authorName: comment.authorName,
      author: {
        id: comment.authorId,
        name: comment.authorName || "Anonymous",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Student",
        verified: false,
      },
      likes: comment.likesCount || 0,        // Backend returns likesCount
      replies: comment.replies ? comment.replies.map(transformComment) : null,
      createdAt: formatDate(comment.createdAt) || "Unknown",
      updatedAt: comment.updatedAt,
      isLiked: comment.liked || false,       // Backend returns liked
      parentCommentId: comment.parentCommentId,
      reply: comment.reply || false,
    }
  }

  // Fetch comments separately 
  const fetchComments = async () => {
    if (!postId) return
    
    try {
      const commentsData = await communityApi.getComments(postId as string)
      const transformedComments = commentsData.map(transformComment)
      setComments(transformedComments || [])
    } catch (err) {
      console.error("Error fetching comments:", err)
    }
  }

  // Fetch post data from API
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Test backend connection first
        const isConnected = await communityApi.testConnection()
        if (!isConnected) {
          throw new Error('Backend server is not responding. Please try again later.')
        }
        
        const data = await communityApi.getPost(postId as string)
        
        console.log("Full API Response:", data); // Debug log
        
        
        // Transform API data to match our interface
        const transformedPost: Post = {
          id: data.communityPostId || postId as string,
          title: data.title || "Untitled Post",
          content: data.content || "",
          author: {
            id: data.author?.id,
            name: data.author?.username || "Anonymous",
            avatar: data.author?.avatar || "/placeholder.svg?height=40&width=40",
            role: data.author?.role || "Student",
            verified: data.author?.verified || false,
          },
          category: data.type?.toLowerCase() || "discussion", // Map type to category
          tags: data.tags?.map((tag: any) => ({
            name: tag.name,
            id: tag.id
          })) || [],
          likes: data.likesCount || 0,        // Backend returns likesCount
          comments: data.comments || 0,       // Backend returns comments count directly
          views: data.views || 0,
          createdAt: formatDate(data.createdAt) || "Unknown",
          isLiked: data.liked || false,       // Backend returns liked
          isBookmarked: false,
          type: (data.type?.toLowerCase() as "discussion" | "project" | "help") || "discussion",
        }
        
        setPost(transformedPost)
        
        // Transform and set comments if they exist
        const responseWithComments = data as any // Type assertion to access comments property
        if (responseWithComments.comments && Array.isArray(responseWithComments.comments)) {
          // Transform comments to match frontend interface
          const transformedComments = responseWithComments.comments.map(transformComment)
          setComments(transformedComments)
        } else {
          // Fallback: fetch comments separately if not included in post response
          fetchComments()
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

  // Fetch popular tags on component mount
  useEffect(() => {
    fetchPopularTags()
  }, [])

  // Fetch top commenters when post is loaded
  useEffect(() => {
    if (postId) {
      fetchTopCommenters()
    }
  }, [postId])

  const handleBack = () => {
    // In a real app, this would use router.back() or navigate to community page
    
    console.log("Navigate back to community")
    router.push("/community")
  }

  // Comment related functions
  const handleSubmitComment = async () => {
    if (!newComment.trim() || !post) return

    try {
      console.log("💬 Submitting new comment...")
      
      const response = await communityApi.addComment(post.id, {
        content: newComment.trim()
      })

      console.log("💬 Comment API response:", response)
      
      // Create local comment object
      const newCommentObj: Comment = {
        id: response.id || Date.now().toString(),
        content: newComment.trim(),
        author: {
          name: response.author?.name || user?.name || "You",
          avatar: response.author?.avatar || "/placeholder.svg?height=32&width=32",
          role: user?.user_role || "Student",
          verified: false,
        },
        likes: 0,
        replies: [],
        createdAt: "Just now",
        isLiked: false,
      }

      // Add to comments list
      setComments([newCommentObj, ...comments])
      setNewComment("")
      
      // Update post comment count
      setPost({ ...post, comments: post.comments + 1 })
      
      // Refresh top commenters since a new comment was added
      fetchTopCommenters()
      
      console.log("💬 Comment added successfully")
      
    } catch (err) {
      console.error("💬 Error submitting comment:", err)
    }
  }

  // Helper function to handle reply submission for any comment (nested support)
  const handleSubmitReply = async (parentCommentId: string) => {
    const replyText = replyForms[parentCommentId]
    if (!replyText?.trim() || !post) return

    try {
      console.log("💬 Submitting reply to comment:", parentCommentId)
      
      const response = await communityApi.addComment(post.id, {
        content: replyText.trim(),
        parentCommentId: parentCommentId
      })

      console.log("💬 Reply API response:", response)
      
      // Refresh comments to get updated structure from backend
      fetchComments()
      
      // Clear reply form
      setReplyForms(prev => ({
        ...prev,
        [parentCommentId]: ""
      }))
      setReplyingTo(null)
      
      // Refresh top commenters since a new reply was added
      fetchTopCommenters()
      
      console.log("💬 Reply added successfully")
      
    } catch (err) {
      console.error("💬 Error submitting reply:", err)
    }
  }

  // Helper function to toggle reply form for any comment
  const toggleReplyForm = (commentId: string) => {
    if (replyingTo === commentId) {
      setReplyingTo(null)
    } else {
      setReplyingTo(commentId)
      // Initialize reply form if not exists
      if (!replyForms[commentId]) {
        setReplyForms(prev => ({
          ...prev,
          [commentId]: ""
        }))
      }
    }
  }

  // Helper function to update reply form content
  const updateReplyForm = (commentId: string, content: string) => {
    setReplyForms(prev => ({
      ...prev,
      [commentId]: content
    }))
  }

  const handleCommentLike = async (commentId: string) => {
    if (!post) return
    
    try {
      console.log("💬 Toggling like for comment:", commentId)
      
      // Use unified like API for comments/replies
      const response = await communityApi.toggleLike(commentId, 'comment', post.id)
      
      console.log("💬 Comment like response:", response)
      
      // Update the specific comment's like state locally for immediate feedback
      const updateCommentLikes = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: response.liked,         // Backend returns 'liked'
              likes: response.likesCount       // Backend returns 'likesCount'
            }
          }
          // Also check nested replies
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentLikes(comment.replies)
            }
          }
          return comment
        })
      }

      setComments(updateCommentLikes)
      
      console.log("💬 Comment like updated successfully")
      
    } catch (err) {
      console.error("💬 Error toggling comment like:", err)
      // Fallback to refresh all comments if local update fails
      fetchComments()
    }
  }

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
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => router.push('/community')} 
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Community
            </button>
          </div>
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
      
      <div className="top-0 z-50 ">
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
                {tagsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Loading tags...</span>
                  </div>
                ) : popularTags.length > 0 ? (
                  popularTags.map((tag, index) => (
                    <div key={tag.id || tag.name} className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-md text-sm font-medium ${getTagColor(index)}`}>
                        {tag.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {tag.postCount > 1000 ? `${(tag.postCount / 1000).toFixed(1)}k` : tag.postCount}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <span className="text-sm text-gray-500">No tags available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Commenters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <h3 className="font-semibold text-gray-900 mb-3">Top Commenters</h3>
              <div className="space-y-3">
                {commentersLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Loading commenters...</span>
                  </div>
                ) : topCommenters.length > 0 ? (
                  topCommenters.map((commenter) => (
                    <div key={commenter.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 border-2 border-gray-100 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {commenter.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{commenter.name}</div>
                        <div className="text-xs text-gray-500">
                          {commenter.commentCount} comment{commenter.commentCount !== 1 ? 's' : ''}
                          {commenter.role && (
                            <span className="ml-2 px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {commenter.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <span className="text-sm text-gray-500">No commenters yet</span>
                  </div>
                )}
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
                  
                  {/* Options Menu - Only show if user is the author */}
                  {user && post && user.id === post.author.id && (
                    <div className="relative" ref={menuRef}>
                      <button 
                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {showOptionsMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <div className="py-2">
                            <button
                              onClick={handleEditPost}
                              className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Post
                            </button>
                            <button
                              onClick={handleDeletePost}
                              className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Regular more options for non-authors */}
                  {(!user || !post || user.id !== post.author.id) && (
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-normal cursor-pointer transition-colors"
                    >
                      #{tag.name}
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
                      {comments.length} comments
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
                        <div className="flex items-center gap-2 relative">
                          <button 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="flex items-center gap-2 px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <Smile className="w-4 h-4" />
                            Emoji
                          </button>
                          
                          {/* Emoji Picker */}
                          {showEmojiPicker && (
                            <div 
                              ref={emojiRef}
                              className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4"
                            >
                              <h4 className="text-sm font-medium text-gray-700 mb-3">Choose an emoji</h4>
                              <div className="grid grid-cols-10 gap-2 max-h-48 overflow-y-auto">
                                {commonEmojis.map((emoji, index) => (
                                  <button
                                    key={index}
                                    onClick={() => addEmoji(emoji)}
                                    className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                                    title={emoji}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
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
                    <CommentComponent
                      key={comment.id}
                      comment={comment}
                      onLike={(id) => handleCommentLike(id)}
                      onReply={toggleReplyForm}
                      replyingTo={replyingTo}
                      replyForms={replyForms}
                      updateReplyForm={updateReplyForm}
                      handleSubmitReply={handleSubmitReply}
                      router={router}
                      postId={postId as string}
                    />
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

      {/* Delete Modal */}
      <DeleteModal {...deleteModal.modalProps} />
    </div>
  )
}