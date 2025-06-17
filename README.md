This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## File Structure

/frontend
├── app/                            # Next.js App Router directory
│   ├── layout.tsx                  # Root layout (navbars, global styles)
│   ├── page.tsx                    # Landing page
│   ├── dashboard/                  # Role-based dashboards
│   │   ├── layout.tsx              # Shared dashboard layout
│   │   ├── page.tsx                # Redirect or overview
│   │   ├── admin/                  # Admin-only views
│   │   │   ├── page.tsx            # Admin dashboard
│   │   │   ├── users/              # Manage users
|   |   |   |   ├── page.tsx                  # Main user list view (table with filters, actions)
|   |   |   |   ├── [id]/                     # Dynamic route for user detail view
|   |   |   |   │   └── page.tsx              # User profile & management view
|   |   |   |   └── new/                      # Optional: Add user manually (rare for admin)
|   |   |   |       └── page.tsx              # Create user form (if allowed)
│   │   │   ├── issues/             # Handle reports
│   │   │   └── settings/           # System config
│   │   ├── student/                # Student dashboard views
│   │   ├── expert/                 # Expert dashboard views
│   │   └── moderator/              # Moderator dashboard views
│   ├── auth/                       # Login, register, forgot password
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   ├── profile/                    # User profile (common)
│   ├── chat/                       # Chat and video features
│   ├── projects/                   # Projects, tasks, progress boards
│   ├── reports/                    # Mentorship report download
│   └── not-found.tsx              # 404 page
│
├── components/                    # Reusable UI components
│   ├── ui/                         # Base components (button, input, card)
│   ├── layout/                     # Navbars, sidebars, header, footer
│   ├── charts/                     # Charts and analytics widgets
│   ├── forms/                      # Form components (input groups, dropdowns)
│   └── dashboard/                  # Widgets/cards for dashboards
│
├── lib/                           # Helper functions and libraries
│   ├── auth.ts                     # Auth utilities
│   ├── api.ts                      # API fetching layer
│   └── utils.ts                    # Formatters, constants, etc.
│
├── middleware.ts                 # Middleware for role-based route protection
├── types/                        # Custom TypeScript types
│   ├── user.ts                     # User and role types
│   ├── project.ts                  # Project/task interfaces
│   └── index.d.ts
├── styles/                       # Global CSS (if needed)
│   └── globals.css
│
├── public/                       # Static files (images, favicon, etc.)
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── README.md

### Explanation of Key Folders

| Folder/File          | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `app/`               | Main routing (pages, layouts, server components)           |
| `components/ui/`     | Reusable UI building blocks using Tailwind                 |
| `components/layout/` | Navbar, Sidebar, LayoutShell                               |
| `dashboard/`         | Organized by user role (Admin, Student, Expert, Moderator) |
| `lib/`               | Utility functions like API wrappers, auth helpers          |
| `middleware.ts`      | Protects routes by role (auth/authorization)               |
| `types/`             | Shared TypeScript interfaces and types                     |
| `styles/globals.css` | Tailwind base styles and custom overrides                  |
| `tailwind.config.js` | Tailwind setup, theme extension                            |
