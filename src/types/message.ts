interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  time: string
  status?: "sent" | "delivered" | "read"
}

export default Message;