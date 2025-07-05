"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  Send,
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
} from "lucide-react"

interface PostDraft {
  type: "discussion" | "project" | "help"
  title: string
  content: string
  category: string
  tags: string[]
  isDraft: boolean
}

const categories = {
  discussion: [
    "General Discussion",
    "Best Practices", 
    "Architecture",
    "Performance",
    "Career Advice",
    "Learning Resources",
  ],
  project: [
    "Web Development",
    "Mobile Apps",
    "Desktop Applications", 
    "APIs & Backend",
    "DevOps & Infrastructure",
    "AI/ML Projects",
  ],
  help: ["Debugging", "Code Review", "Deployment Issues", "Database Problems", "Authentication", "Performance Issues"],
}

const popularTags = [
  "javascript", "react", "nextjs", "typescript", "nodejs", "python", 
  "css", "database", "api", "tailwind", "mongodb", "postgresql",
  "authentication", "deployment", "performance", "testing"
]

export default function BrainMapCommunityPost() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [post, setPost] = useState<PostDraft>({
    type: "discussion",
    title: "",
    content: "",
    category: "",
    tags: [],
    isDraft: false,
  })
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")


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

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    if (isDraft) {
      console.log("Saved as draft:", post)
    } else {
      console.log("Published post:", post)
    }
    setIsSubmitting(false)
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
            <AvatarFallback className="bg-blue-600 text-white">Y</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">You</span>
              <span className="text-sm text-gray-500">Just now</span>
            </div>
            <div className="flex items-center gap-2">
              {getPostTypeIcon(post.type)}
              <span className="text-sm text-gray-600">{post.category || "Select a category"}</span>
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

  return (
    <div className="min-h-screen bg-white mt-5">
      



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center">
          

          {/* Main Content */}
          <div className="flex-1 max-w-4xl space-y-6">
            {/* Back Button */}
            <div className="flex items-center gap-4 mb-6">
              <Button  size="sm" className="gap-2 text-white bg-primary hover:bg-secondary hover:text-black" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4" />
                Back to Community
              </Button>
            </div>

            {/* Post Type Selection */}
            <Card className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900">What would you like to share?</CardTitle>
                <CardDescription className="text-gray-600">Choose the type of post that best fits your content</CardDescription>
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
                      onClick={() => setPost({ ...post, type, category: "" })}
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
                <CardDescription className="text-gray-600">Provide the basic information for your post</CardDescription>
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

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <Select value={post.category} onValueChange={(value) => setPost({ ...post, category: value })}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories[post.type].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <CardDescription className="text-gray-600">Write your post content using Markdown formatting</CardDescription>
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
                      placeholder="Share your thoughts, code, questions, or project details here...

You can use Markdown formatting:
- **bold text**
- *italic text*
- [links](url)
- \`code\`
- > quotes
- # headings

Be descriptive and helpful to get the best engagement from the community!"
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
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting || !post.title.trim()}
                className="gap-2 border-gray-300"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !post.title.trim() || !post.content.trim()}
                className="bg-primary hover:bg-secondary text-white hover:text-black gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}