# BrainMap Frontend

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/brain-Map/brainMap-Frontend.git
cd brainMap-Frontend
```

### Install Dependencies

```bash
npm i
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## File Structure

```
/frontend
├── app/                            # Next.js App Router directory
│   ├── layout.tsx                  # Root layout (navbars, global styles)
│   ├── page.tsx                    # Landing page
│   ├── admin/                      # Admin-specific pages
│   │   ├── layout.tsx              # Admin layout
│   │   ├── (dashboard)/            # Admin dashboard
│   │   │   └── page.tsx            # Dashboard overview
│   ├── calendar/                   # Calendar feature
│   │   ├── layout.tsx              # Calendar layout
│   │   └── page.tsx                # Calendar page
│   ├── chat/                       # Chat feature
│   │   └── page.tsx                # Chat page
│   ├── community/                  # Community feature
│   │   ├── layout.tsx              # Community layout
│   │   ├── page.tsx                # Community page
│   │   ├── new/                    # Create new community post
│   │   │   └── page.tsx            # New post page
│   │   └── post/                   # Post details
│   │       └── [id]/               # Dynamic route for post details
│   │           └── page.tsx        # Post details page
│   ├── login/                      # Login feature
│   │   ├── login.tsx               # Login form
│   │   └── page.tsx                # Login page
│   ├── notes/                      # Notes feature
│   │   ├── notes.tsx               # Notes component
│   │   └── page.tsx                # Notes page
│   ├── register/                   # Registration feature
│   │   ├── register.tsx            # Registration form
│   │   └── page.tsx                # Registration page
│   ├── student/                    # Student-specific pages
│   │   ├── layout.tsx              # Student layout
│   │   ├── dashboard/              # Student dashboard
│   │   │   └── page.tsx            # Dashboard overview
│   │   └── listBoard/              # List board feature
│   │       └── page.tsx            # List board page
│   └── not-found.tsx               # 404 page
│
├── components/                     # Reusable UI components
│   ├── AdminSideBar.tsx            # Admin sidebar component
│   ├── calendar/                   # Calendar components
│   ├── chat/                       # Chat components
│   ├── modals/                     # Modal components
│   ├── ui/                         # Base UI components (button, input, etc.)
│   └── ...                         # Other reusable components
│
├── contexts/                       # React context providers
│   └── calendarContext.tsx         # Calendar context
│
├── data/                           # Static or mock data
│   ├── calendar/                   # Calendar data
│   ├── chat/                       # Chat data
│   └── ...                         # Other data files
│
├── lib/                            # Utility functions and libraries
│   └── utils.ts                    # General utility functions
│
├── public/                         # Static files (images, icons, etc.)
│   ├── icon/                       # Icons
│   ├── image/                      # Images
│   └── ...                         # Other static assets
│
├── styles/                         # Global and modular styles
│   └── NavBar.module.css           # Navbar-specific styles
│
├── types/                          # TypeScript type definitions
│   ├── CalendarEvent.ts            # Calendar event types
│   ├── contact.ts                  # Contact types
│   ├── message.ts                  # Message types
│   └── ...                         # Other type definitions
│
├── next.config.ts                  # Next.js configuration
├── package.json                    # Project dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

### Explanation of Key Folders

| Folder/File          | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `app/`               | Main routing (pages, layouts, server components)           |
| `components/`        | Reusable UI components for various features                |
| `contexts/`          | React context providers for state management               |
| `data/`              | Static or mock data used across the application            |
| `lib/`               | Utility functions and helper libraries                     |
| `public/`            | Static assets like images and icons                        |
| `styles/`            | CSS files for global and modular styling                   |
| `types/`             | TypeScript type definitions for strong typing              |
| `next.config.ts`     | Configuration for Next.js                                   |
| `tsconfig.json`      | TypeScript configuration                                    |
| `README.md`          | Project documentation                                      |

