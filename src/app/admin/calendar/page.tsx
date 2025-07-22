import Calendar from "@/components/calendar/calendar";

// Example mock events
const mockEvents = [
  {
    id: "1",
    title: "Team Meeting",
    time: "10:00 AM",
    endTime: "11:00 AM",
    type: "meeting" as const,
    color: "bg-blue-500",
    date: new Date(),
    description: "Discuss project updates",
    location: "Conference Room",
    attendees: ["Alice", "Bob", "Charlie"],
  },
  {
    id: "2",
    title: "Lunch Break",
    time: "12:00 PM",
    type: "lunch" as const,
    color: "bg-green-500",
    date: new Date(),
    location: "Cafeteria",
    attendees: ["Alice", "Bob"],
  },
  {
    id: "3",
    title: "Demo Session",
    time: "3:00 PM",
    endTime: "4:00 PM",
    type: "demo" as const,
    color: "bg-purple-500",
    date: new Date(),
    description: "Showcase new features",
    location: "Online",
    attendees: ["Charlie"],
  },
];

export default function AdminCalendarPage() {
  return <Calendar events={mockEvents} />;
}

