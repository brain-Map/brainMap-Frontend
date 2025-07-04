"use client"

import {
  Search,
  Plus,
  Bell,
  Settings,
  HelpCircle,
  Download,
  Filter,
  RefreshCw,
  Users,
  BarChart3,
  Shield,
  AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminNavProps {
  title: string
  onCreateClick?: () => void
  onRefresh?: () => void
  onExport?: () => void
  currentPage?: string
}

export function AdminNavbar({ title, onCreateClick, onRefresh, onExport, currentPage }: AdminNavProps) {
  const getQuickActions = () => {
    switch (currentPage) {
      case "users":
        return [
          { label: "Add User", icon: Plus, action: onCreateClick },
          { label: "Export Users", icon: Download, action: onExport },
          { label: "Bulk Actions", icon: Users, action: () => console.log("Bulk actions") },
        ]
      case "dashboard":
        return [
          { label: "Generate Report", icon: BarChart3, action: () => console.log("Generate report") },
          { label: "Export Data", icon: Download, action: onExport },
          { label: "System Check", icon: Shield, action: () => console.log("System check") },
        ]
      default:
        return [
          { label: "Create New", icon: Plus, action: onCreateClick },
          { label: "Export Data", icon: Download, action: onExport },
        ]
    }
  }

  const quickActions = getQuickActions()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Title and Breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">Admin Panel / {title}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden lg:flex items-center gap-4 ml-8">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-700">System Online</span>
            </div>
          </div>
        </div>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users, reports, logs..."
              className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Time Range Filter */}
          <Select defaultValue="7days">
            <SelectTrigger className="w-32 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg">
                <Plus className="h-4 w-4 mr-2" />
                Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {quickActions.map((action, index) => (
                <DropdownMenuItem key={index} onClick={action.action}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="border-gray-200 hover:bg-gray-50 bg-transparent"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-red-500 text-white text-xs">3</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500">You have 3 unread notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="p-3 flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Security Alert</p>
                    <p className="text-xs text-gray-500">Multiple failed login attempts detected</p>
                    <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pending Moderation</p>
                    <p className="text-xs text-gray-500">5 new reports require review</p>
                    <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">System Update</p>
                    <p className="text-xs text-gray-500">Database backup completed successfully</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="p-3 border-t">
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Tools */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Security Center
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertTriangle className="mr-2 h-4 w-4" />
                System Logs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Contact Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart3 className="mr-2 h-4 w-4" />
                System Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-primary text-white">AM</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
