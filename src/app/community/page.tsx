"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { communityApi } from "@/services/communityApi"
import userPlaceholder from "@/../public/image/user_placeholder.jpg"
import { StaticImageData } from "next/image"


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
  featured?: boolean
  trending?: boolean
}

export default function CommunityPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

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
        const data = await communityApi.getPosts()
        
        console.log("Posts Data: ", data)
        
        // Transform API data to match your Post interface
        const transformedPosts: Post[] = data.map((post: any) => ({
          id: post.communityPostId,
          title: post.title || "Untitled Post",
          content: post.content || "",
          author: {
            name: post.author?.username || "Anonymous",
            avatar: "/image/user_placeholder.jpg",
            role: post.author?.role || "Project Member",
            verified: post.author?.verified || false,
          },
          category: post.type?.toLowerCase() || "discussion",
          tags: post.tags?.map((tag: any) => tag.name) || [],
          likes: post.likes || 0,
          comments: post.replies || 0,
          views: post.views || 0,
          createdAt: formatDate(post.createdAt),
          isLiked: post.isLiked || false,
          isBookmarked: false,
          type: (post.type?.toLowerCase() as "discussion" | "project" | "help") || "discussion",
          featured: false,
          trending: false,
        }))
        
        setPosts(transformedPosts)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts")
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)))
  }

  const handlePostClick = (postId: string) => {
    router.push(`/community/post/${postId}`)
  }


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
      default:
        return 0 // Keep original order for "recent"
    }
  })

  const popularTags = [
    { name: 'javascript', count: 1200, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'react', count: 859, color: 'bg-blue-100 text-blue-800' },
    { name: 'python', count: 743, color: 'bg-green-100 text-green-800' },
    { name: 'css', count: 621, color: 'bg-purple-100 text-purple-800' }
  ];


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
            <nav className="flex space-x-6">
              <button className="text-blue-600 font-medium">Questions</button>
              <button className="text-gray-600 hover:text-gray-900">Tags</button>
              <button className="text-gray-600 hover:text-gray-900">Users</button>
            </nav>
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
                {popularTags.map((tag) => (
                  <div key={tag.name} className="flex items-center justify-between">
                    <Badge className={`px-2 py-1 rounded-md text-sm font-medium ${tag.color}`}>
                      {tag.name}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {tag.count > 1000 ? `${(tag.count / 1000).toFixed(1)}k` : tag.count}
                    </span>
                  </div>
                ))}
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
                            <ChevronUp 
                              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" 
                              onClick={(e) => {
                                e.stopPropagation()
                                handleLike(post.id)
                              }}
                            />
                            <span className="font-medium text-gray-700">{post.likes}</span>
                            <ChevronDown className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 cursor-pointer"
                              onClick={() => handlePostClick(post.id)}
                            >
                              {post.title}
                            </h3>
                            {post.trending && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-md ml-2">
                                <Fire className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
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
                                className={`text-xs ${post.isLiked ? "text-red-600" : "text-gray-500"}`}
                              >
                                <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                                Like
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 text-xs"
                                onClick={() => handlePostClick(post.id)}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Comment
                                <span>{post.comments}</span>
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
    </>
  )
}