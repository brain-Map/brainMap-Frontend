import Message from "@/types/message";

const messages: Message[] = [
  {
    id: "1",
    content: "Hey there! How's everything going with the new project?",
    sender: "contact",
    time: "10:30 AM",
  },
  {
    id: "2",
    content:
      "Hi Sarah! Everything is going really well with the project. We're making great progress on the design phase.",
    sender: "user",
    time: "10:32 AM",
    status: "read",
  },
  {
    id: "3",
    content: "That sounds perfect! How about the timeline?",
    sender: "contact",
    time: "10:35 AM",
  },
  {
    id: "4",
    content: "We should be able to finish everything by next week. The team has been working really hard on this.",
    sender: "user",
    time: "10:37 AM",
    status: "delivered",
  },
]

export default messages;