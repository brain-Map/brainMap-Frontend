"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/NavBarModel"
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

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Building a Real-time Chat App with Next.js 14 and Socket.io",
    content:
      "Just completed an amazing real-time chat application using Next.js 14, Socket.io, and Prisma. The app features real-time messaging, user authentication, file sharing, and emoji reactions. I've implemented both group chats and direct messaging with end-to-end encryption. The UI is built with Tailwind CSS and includes dark mode support. Would love to get feedback from the community and answer any questions about the implementation!",
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
    featured: true,
    trending: true,
  },
  {
    id: "2",
    title: "Help: Deployment issues with Vercel and Prisma",
    content:
      "I'm experiencing some strange behavior when deploying my Next.js app to Vercel. The Prisma client works perfectly in development, but I'm getting connection timeout errors in production. I've checked my environment variables and database connection string multiple times. Has anyone encountered similar issues?",
    author: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Beginner",
      verified: false,
    },
    category: "Help & Support",
    tags: ["Vercel", "Prisma", "Deployment", "Database", "Production"],
    likes: 12,
    comments: 18,
    views: 156,
    createdAt: "4 hours ago",
    isLiked: true,
    isBookmarked: false,
    type: "help",
  },
  {
    id: "3",
    title: "State Management Patterns: Zustand vs Redux Toolkit in 2024",
    content:
      "After working with both Zustand and Redux Toolkit on several projects, I wanted to share my thoughts on when to use each. Zustand shines for smaller to medium applications with its simplicity and minimal boilerplate, while RTK is still king for complex state management scenarios. What's your experience been like?",
    author: {
      name: "Michael Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Intermediate",
      verified: true,
    },
    category: "Discussion",
    tags: ["React", "State Management", "Zustand", "Redux", "Architecture"],
    likes: 34,
    comments: 29,
    views: 287,
    createdAt: "6 hours ago",
    isLiked: false,
    isBookmarked: false,
    type: "discussion",
    trending: true,
  },
]

export default function CommunityPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

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

  const topContributors = [
    { name: 'John Smith', points: 2843, avatar: '👨‍💻' },
    { name: 'Sarah Johnson', points: 1876, avatar: '👩‍💼' },
    { name: 'Jake Chen', points: 1654, avatar: '👨‍🎓' }
  ];

  return (
    <>
      <Navbar/>
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
                onClick={() => router.push("/community/new")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
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

              {/* Top Contributors */}
              <Card className="bg-white rounded-lg border border-gray-200 p-4 shadow-none">
                <CardTitle className="font-semibold text-gray-900 mb-3">Top Contributors</CardTitle>
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

              {/* Posts List */}
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
                          <div className="flex space-x-3 mt-2 text-xs">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2">
                                {post.title}
                              </h3>
                            
                            {post.trending && (
                              <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-md ml-2">
                                <Fire className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>

                          <p className="mt-2 text-gray-600 text-sm leading-relaxed mb-4">
                              {post.content}
                            </p>
                          
                         

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
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

              {/* Load More */}
              {sortedPosts.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" className="text-blue-600 hover:text-blue-700 border-blue-200">
                    Load More Questions
                  </Button>
                </div>
              )}

              {/* No Results */}
              {sortedPosts.length === 0 && (
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
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => router.push("/community/new")}
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