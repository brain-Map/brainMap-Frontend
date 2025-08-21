export interface Mentor {
  name: string
  role: string
  avatar: string
  date: string
}

export interface ServiceListCard {
  id: number
  title: string
  subject: string
  description: string
  fee: number
  thumbnail: string
  rating: number
  reviews: number
  createdAt: string
  mentor: Mentor
}
