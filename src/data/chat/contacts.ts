import Contact from "@/types/contact";

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey there! How's everything going with the new project?",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Swift Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Can you check the progress report?",
    time: "1h ago",
    online: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for the update!",
    time: "3h ago",
  },
  {
    id: "4",
    name: "David Park",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The design looks great!",
    time: "1d ago",
  },
]

export default contacts;