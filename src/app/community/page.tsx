"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  FlameIcon as Fire,
  Clock,
  ChevronUp,
  ChevronDown,
  Loader2,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import { communityApi, PopularTag } from "@/services/communityApi"
import { StaticImageData } from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import DeleteModal from "@/components/modals/DeleteModal"
import { useDeleteModal } from "@/hooks/useDeleteModal"


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
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  originalCreatedAt: string
  isLiked: boolean
  isBookmarked: boolean
  type: "discussion" | "project" | "help"
  featured?: boolean
  trending?: boolean
}

export default function CommunityPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())
  const [popularTags, setPopularTags] = useState<PopularTag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const deleteModal = useDeleteModal({
    title: "Delete Post",
    confirmText: "Delete Post"
  })

  // Helper function to format date
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if API endpoint is reachable
        const data = await communityApi.getPosts()
        
        console.log("Posts Data: ", data)
        
        // Transform API data to match your Post interface
        const transformedPosts: Post[] = data.map((post: any) => ({
          id: post.communityPostId,
          title: post.title || "Untitled Post",
          content: post.content || "",
          author: {
            id: post.author?.id || post.userId,
            name: post.author?.username || "Anonymous",
            avatar: "/image/user_placeholder.jpg",
            role: post.author?.role || "Project Member",
            verified: post.author?.verified || false,
          },
          category: post.type?.toLowerCase() || "discussion",
          tags: post.tags?.map((tag: any) => tag.name) || [],
          likes: post.likesCount || 0,        // Backend returns likesCount
          comments: post.comments || 0, // Backend returns 'comments' field directly
          views: post.views || 0,
          createdAt: formatDate(post.createdAt),
          originalCreatedAt: post.createdAt, // Keep original date for sorting
          isLiked: post.liked || false,       // Backend returns liked
          isBookmarked: false,
          type: (post.type?.toLowerCase() as "discussion" | "project" | "help") || "discussion",
          featured: false,
          trending: false,
        }))
        
        console.log("Transformed Posts: ", transformedPosts) // Add debug log for transformed data
        
        setPosts(transformedPosts)
        
      } catch (err) {
        console.error("Error fetching posts:", err)
        let errorMessage = "Failed to fetch posts"
        
        if (err instanceof Error) {
          errorMessage = err.message
          // Check for specific URL construction error
          if (err.message.includes("Invalid URL")) {
            errorMessage = "API configuration error. Please check your environment variables."
          }
        } else if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosError = err as any
          errorMessage = axiosError.response?.data?.message || axiosError.message || errorMessage
        }
        
        setError(errorMessage)
        
        // Set empty posts array as fallback
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleLike = async (postId: string) => {
    // Prevent multiple simultaneous like requests for the same post
    if (likingPosts.has(postId)) {
      return
    }

    // Add post to liking set to prevent duplicate requests
    setLikingPosts(prev => new Set(prev).add(postId))

    // Find the current post to determine if we're liking or unliking
    const currentPost = posts.find(post => post.id === postId)
    if (!currentPost) {
      setLikingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
      return
    }

    const wasLiked = currentPost.isLiked
    const newLikeCount = wasLiked ? currentPost.likes - 1 : currentPost.likes + 1

    // Optimistically update the UI
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, isLiked: !wasLiked, likes: newLikeCount }
          : post
      )
    )

    try {
      // Make API call to toggle like using unified API
      const response = await communityApi.toggleLike(postId, 'post')
      
      // Update with the actual response data from server
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, isLiked: response.liked, likes: response.likesCount }
            : post
        )
      )
      
      // Optional: Show subtle feedback
      console.log(`Post ${response.liked ? 'liked' : 'unliked'} successfully`)
      
    } catch (error) {
      console.error('Error toggling like:', error)
      
      // Revert the optimistic update on error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, isLiked: wasLiked, likes: currentPost.likes }
            : post
        )
      )
      
      // Optional: Show error message to user
      // You can replace this with a toast notification
      console.warn('Failed to update like. Please try again.')
      
    } finally {
      // Remove post from liking set
      setLikingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)))
  }

  const handlePostClick = (postId: string) => {
    router.push(`/community/post/${postId}`)
  }

  const handleDeletePost = (postId: string, postTitle?: string) => {
    console.log('🗑️ [HANDLE DELETE] Delete initiated for post:', postId);
    console.log('🗑️ [HANDLE DELETE] Post title:', postTitle);
    console.log('🗑️ [HANDLE DELETE] Current user:', user);
    
    setShowOptionsMenu(null)
    deleteModal.openModal(
      async (id: string) => {
        console.log('🗑️ [DELETE MODAL] Delete confirmed, executing...');
        console.log('🗑️ [DELETE MODAL] Post ID to delete:', id);
        
        try {
          await communityApi.deletePost(id)
          console.log('✅ [DELETE MODAL] API call successful');
          
          // Remove post from state
          setPosts(prevPosts => {
            const filtered = prevPosts.filter(post => post.id !== id)
            console.log('✅ [DELETE MODAL] Post removed from state');
            console.log('✅ [DELETE MODAL] Remaining posts count:', filtered.length);
            return filtered
          })
          
          console.log('✅ [DELETE MODAL] Delete operation completed successfully');
        } catch (error) {
          console.error('❌ [DELETE MODAL] Delete operation failed:', error);
          throw error;
        }
      },
      [postId],
      postTitle
    )
    
    console.log('🗑️ [HANDLE DELETE] Delete modal opened');
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(null)
      }
    }

    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showOptionsMenu])


  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || post.type === activeTab
    return matchesSearch && matchesTab
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "trending":
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
      case "recent":
      default:
        // Sort by newest first (most recent dates first)
        return new Date(b.originalCreatedAt).getTime() - new Date(a.originalCreatedAt).getTime()
    }
  })

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

  // Fetch popular tags on component mount
  useEffect(() => {
    fetchPopularTags()
  }, [])

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


  return (
    <>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Community</span>
            </div>
            
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary hover:text-black font-medium"
              onClick={() => router.push("/community/create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Popular Tags */}
            <Card className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <CardTitle className="font-semibold text-gray-900 mb-3">Popular Tags</CardTitle>
              <div className="space-y-2">
                {tagsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">Loading tags...</span>
                  </div>
                ) : popularTags.length > 0 ? (
                  popularTags.map((tag, index) => (
                    <div key={tag.id || tag.name} className="flex items-center justify-between">
                      <Badge className={`px-2 py-1 rounded-md text-sm font-medium ${getTagColor(index)}`}>
                        {tag.name}
                      </Badge>
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
            </Card>

            {/* Sort Options */}
            <Card className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
              <CardTitle className="font-semibold text-gray-900 mb-3">Sort Posts</CardTitle>
              <div className="space-y-2">
                {[
                  { value: "recent", label: "Latest", icon: Clock },
                  { value: "popular", label: "Popular", icon: Heart },
                  { value: "trending", label: "Trending", icon: Fire },
                ].map(({ value, label, icon: Icon }) => (
                  <Button
                    key={value}
                    variant={sortBy === value ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSortBy(value)}
                    className={`w-full justify-start ${
                      sortBy === value ? "bg-primary text-white" : "text-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Recent Questions</h1>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 bg-gray-100 rounded-lg p-1">
                  <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
                  <TabsTrigger value="discussion" className="text-sm">Discussion</TabsTrigger>
                  <TabsTrigger value="project" className="text-sm">Projects</TabsTrigger>
                  <TabsTrigger value="help" className="text-sm">Help</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading posts...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="bg-red-50 border border-red-200 rounded-lg">
                <CardContent className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline"
                    className="text-red-600 border-red-300"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            {!loading && !error && (
              <div className="space-y-4">
                {sortedPosts.map((post) => (
                  <Card key={post.id} className="bg-white shadow-none border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Vote/Stats Column */}
                        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 min-w-0">
                          <div className="flex flex-col items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLike(post.id)
                              }}
                              disabled={likingPosts.has(post.id)}
                              className={`p-1 rounded-full transition-all duration-200 ${
                                post.isLiked 
                                  ? 'text-red-500 hover:text-red-600' 
                                  : 'text-gray-400 hover:text-red-500'
                              } ${
                                likingPosts.has(post.id) 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'cursor-pointer hover:bg-gray-100'
                              }`}
                            >
                              {likingPosts.has(post.id) ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <ChevronUp className="w-5 h-5" />
                              )}
                            </button>
                            <span className={`font-medium transition-colors duration-200 ${
                              post.isLiked ? 'text-red-600' : 'text-gray-700'
                            }`}>
                              {post.likes}
                            </span>
                            <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 flex items-start gap-2">
                              <h3 
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 cursor-pointer flex-1"
                                onClick={() => handlePostClick(post.id)}
                              >
                                {post.title}
                              </h3>
                              {post.trending && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-md">
                                  <Fire className="w-3 h-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </div>
                            
                            {/* More Options Menu - Only show for post author */}
                            {user && post.author.id === user.id && (
                              <div className="relative ml-2" ref={showOptionsMenu === post.id ? menuRef : null}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setShowOptionsMenu(showOptionsMenu === post.id ? null : post.id)
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                                
                                {showOptionsMenu === post.id && (
                                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <div className="py-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          console.log('🗑️ [DELETE BUTTON] Delete button clicked');
                                          console.log('🗑️ [DELETE BUTTON] Post ID:', post.id);
                                          console.log('🗑️ [DELETE BUTTON] Post title:', post.title);
                                          console.log('🗑️ [DELETE BUTTON] Post author ID:', post.author.id);
                                          console.log('🗑️ [DELETE BUTTON] Current user ID:', user?.id);
                                          handleDeletePost(post.id, post.title)
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 transition-colors text-sm"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Post
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <p className="mt-2 text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                            {post.content}
                          </p>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-gray-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center space-x-3 text-sm text-gray-500">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                <AvatarFallback className="text-xs">
                                  {post.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex items-center space-x-1">
                                <span className="font-medium text-gray-700">{post.author.name}</span>
                                {post.author.verified && (
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                )}
                              </div>
                              <span>•</span>
                              <span>{post.createdAt}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleLike(post.id)
                                }}
                                disabled={likingPosts.has(post.id)}
                                className={`text-xs transition-all duration-200 ${
                                  post.isLiked ? "text-red-600 hover:text-red-700" : "text-gray-500 hover:text-red-500"
                                } ${
                                  likingPosts.has(post.id) ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                {likingPosts.has(post.id) ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Heart className={`w-4 h-4 mr-1 transition-all duration-200 ${
                                    post.isLiked ? "fill-current" : ""
                                  }`} />
                                )}
                                {likingPosts.has(post.id) ? "Updating..." : `${post.likes}`}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 text-xs"
                                onClick={() => handlePostClick(post.id)}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {post.comments}
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleBookmark(post.id)
                                }}
                                className={`text-xs ${post.isBookmarked ? "text-blue-600" : "text-gray-500"}`}
                              >
                                <Bookmark className={`w-4 h-4 ${post.isBookmarked ? "fill-current" : ""}`} />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-gray-500 text-xs">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && !error && sortedPosts.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" className="text-blue-600 hover:text-blue-700 border-blue-200">
                  Load More Questions
                </Button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && sortedPosts.length === 0 && (
              <Card className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">No posts found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms or browse different categories."
                      : "Be the first to start a discussion!"}
                  </p>
                  <Button 
                    className="bg-primary hover:bg-blue-700 text-white"
                    onClick={() => router.push("/community/create")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Delete Modal */}
    <DeleteModal {...deleteModal.modalProps} />
    </>
  )
}