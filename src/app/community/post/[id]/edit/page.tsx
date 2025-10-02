"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  Eye,
  Code,
  HelpCircle,
  MessageCircle,
  Plus,
  X,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Hash,
  Loader2,
} from "lucide-react"
import { communityApi, CreatePostRequest } from "@/services/communityApi"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Post {
  type: "discussion" | "project" | "help"
  title: string
  content: string
  tags: string[]
}

const popularTags = [
  "javascript", "react", "nextjs", "typescript", "nodejs", "python", 
  "css", "database", "api", "tailwind", "mongodb", "postgresql",
  "authentication", "deployment", "performance", "testing"
]

export default function EditPost() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const { user } = useAuth()
  
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [post, setPost] = useState<Post>({
    type: "discussion",
    title: "",
    content: "",
    tags: [],
  })
  const [originalPost, setOriginalPost] = useState<Post | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const data = await communityApi.getPost(postId)
        
        // Check if user is authorized to edit this post
        if (user && data.author && user.id !== data.author.id) {
          setError("You are not authorized to edit this post")
          return
        }
        
        const postData: Post = {
          type: (data.type?.toLowerCase() as "discussion" | "project" | "help") || "discussion",
          title: data.title || "",
          content: data.content || "",
          tags: data.tags?.map((tag: any) => tag.name) || []
        }
        
        setPost(postData)
        setOriginalPost(postData)
      } catch (err: any) {
        console.error("Error fetching post:", err)
        setError(err.response?.data?.message || 'Failed to load post data')
      } finally {
        setIsLoading(false)
      }
    }

    if (postId && user) {
      fetchPost()
    }
  }, [postId, user])

  const handleAddTag = (tag: string) => {
    if (tag && !post.tags.includes(tag) && post.tags.length < 8) {
      setPost({ ...post, tags: [...post.tags, tag] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setPost({ ...post, tags: post.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      handleAddTag(tagInput.trim())
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      if (!post.title.trim() || !post.content.trim()) {
        setError("All required fields must be filled")
        setIsSubmitting(false)
        return
      }

      const postData: CreatePostRequest = {
        type: post.type,
        title: post.title.trim(),
        content: post.content.trim(),
        tags: post.tags
      }

      const response = await communityApi.updatePost(postId, postData)
      
      console.log('Post Updated Successfully:', response)
      router.push(`/community/post/${postId}`)
      
    } catch (err: any) {
      console.error("Error updating post:", err)
      setError(err.response?.data?.message || 'An error occurred while updating the post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const replacement = selectedText || placeholder

    let newText = ""
    switch (syntax) {
      case "bold":
        newText = `**${replacement}**`
        break
      case "italic":
        newText = `*${replacement}*`
        break
      case "link":
        newText = `[${replacement || "link text"}](url)`
        break
      case "code":
        newText = `\`${replacement}\``
        break
      case "quote":
        newText = `> ${replacement}`
        break
      case "list":
        newText = `- ${replacement}`
        break
      case "ordered-list":
        newText = `1. ${replacement}`
        break
      case "heading":
        newText = `## ${replacement}`
        break
      default:
        newText = replacement
    }

    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end)
    setPost({ ...post, content: newContent })

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Code className="w-4 h-4" />
      case "help":
        return <HelpCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const renderPreview = () => {
    if (!post.content) {
      return (
        <div className="text-center py-12 text-gray-500">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Start writing to see a preview of your post</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-blue-600 text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{user?.name || 'You'}</span>
              <span className="text-sm text-gray-500">Editing</span>
            </div>
            <div className="flex items-center gap-2">
              {getPostTypeIcon(post.type)}
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">{post.title || "Your post title will appear here"}</h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading post data...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error && !originalPost) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <MessageCircle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Post</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const hasChanges = originalPost && (
    post.title !== originalPost.title ||
    post.content !== originalPost.content ||
    post.type !== originalPost.type ||
    JSON.stringify(post.tags) !== JSON.stringify(originalPost.tags)
  )

  return (
    <div className="min-h-screen bg-white mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          <div className="flex-1 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  size="sm" 
                  className="gap-2 text-white bg-primary hover:bg-secondary hover:text-black" 
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">Edit Post</h1>
              </div>
              {hasChanges && (
                <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Post Type Selection */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">Post Type</CardTitle>
                <CardDescription className="text-gray-600">Update the type of your post</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      type: "discussion" as const,
                      title: "Discussion",
                      description: "Start a conversation or share insights",
                      icon: MessageCircle,
                      color: "blue",
                    },
                    {
                      type: "project" as const,
                      title: "Project Showcase", 
                      description: "Share your latest project or creation",
                      icon: Code,
                      color: "purple",
                    },
                    {
                      type: "help" as const,
                      title: "Help & Support",
                      description: "Ask for help or technical assistance",
                      icon: HelpCircle,
                      color: "green",
                    },
                  ].map(({ type, title, description, icon: Icon, color }) => (
                    <Card
                      key={type}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                        post.type === type
                          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPost({ ...post, type })}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                          <Icon className={`w-5 h-5 text-${color}-600`} />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-600">{description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Post Details */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">Post Details</CardTitle>
                <CardDescription className="text-gray-600">Update the basic information for your post</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter a descriptive title for your post..."
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">{post.title.length}/100 characters</p>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Tags</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddTag(tagInput.trim())}
                        disabled={!tagInput.trim() || post.tags.includes(tagInput.trim()) || post.tags.length >= 8}
                        className="border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Current Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 border border-blue-200 gap-1"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Popular Tags */}
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {popularTags.slice(0, 12).map((tag) => (
                          <Button
                            key={tag}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddTag(tag)}
                            disabled={post.tags.includes(tag) || post.tags.length >= 8}
                            className="h-7 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{post.tags.length}/8 tags added</p>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="border border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-medium text-gray-900">Content</CardTitle>
                    <CardDescription className="text-gray-600">Update your post content using Markdown formatting</CardDescription>
                  </div>
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="write" className="gap-2">
                        <Bold className="w-4 h-4" />
                        Write
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
                  <TabsContent value="write" className="space-y-4">
                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      {[
                        { icon: Bold, action: "bold", tooltip: "Bold" },
                        { icon: Italic, action: "italic", tooltip: "Italic" },
                        { icon: Link, action: "link", tooltip: "Link" },
                        { icon: Quote, action: "quote", tooltip: "Quote" },
                        { icon: List, action: "list", tooltip: "Bullet List" },
                        { icon: ListOrdered, action: "ordered-list", tooltip: "Numbered List" },
                        { icon: Hash, action: "heading", tooltip: "Heading" },
                      ].map(({ icon: Icon, action, tooltip }) => (
                        <Button
                          key={action}
                          variant="ghost"
                          size="sm"
                          onClick={() => insertMarkdown(action, tooltip.toLowerCase())}
                          className="h-8 w-8 p-0 hover:bg-gray-200"
                          title={tooltip}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>

                    {/* Content Textarea */}
                    <Textarea
                      name="content"
                      placeholder="Share your thoughts, code, questions, or project details here..."
                      value={post.content}
                      onChange={(e) => setPost({ ...post, content: e.target.value })}
                      className="min-h-[300px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
                    />

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{post.content.length} characters</span>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="min-h-[300px] p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {renderPreview()}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting || !post.title.trim() || !post.content.trim() || !hasChanges}
                  className="bg-primary hover:bg-secondary text-white hover:text-black gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Updating..." : "Update Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}