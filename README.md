# LiveThrough - Survival Course Marketplace

LiveThrough is a modern, full-stack web application that serves as a comprehensive marketplace for survival and outdoor education courses. Built with Next.js 15, React 19, and Supabase, it connects students with survival schools and instructors through an intuitive, responsive platform.

## 🏔️ Overview

LiveThrough enables:
- **Course Discovery**: Browse and search survival courses by location, difficulty, environment, and price
- **School Management**: Comprehensive admin dashboard for survival schools to manage courses and students
- **Student Experience**: User-friendly marketplace with advanced filtering, bookmarking, and course details
- **Location-Based Search**: Find courses near you with geolocation features
- **Advanced Filtering**: Filter by course type, difficulty level, environment, duration, and price range

## 🚀 Tech Stack

### Frontend
- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** components for accessible UI elements
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend & Database
- **Supabase** for backend-as-a-service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage with image processing
- **NextAuth.js** for additional authentication features

### Key Libraries
- **Sharp** for server-side image processing and WebP conversion
- **TipTap** for rich text editing
- **Recharts** for data visualization
- **Sonner** for toast notifications
- **Date-fns** for date manipulation

## 📁 Project Structure

```
livethrough/
├── app/                          # Next.js App Router pages
│   ├── dashboard/                # Admin dashboard for schools
│   │   ├── courses/             # Course management
│   │   ├── students/            # Student management
│   │   ├── schools/             # School management
│   │   ├── reviews/             # Review management
│   │   ├── gear/                # Gear management
│   │   ├── security/            # Security settings
│   │   └── settings/            # General settings
│   ├── marketplace/             # Public course marketplace
│   │   └── courses/[id]/        # Individual course pages
│   ├── account/                 # User account management
│   ├── admin-login/             # Admin authentication
│   ├── admin-setup/             # Admin setup
│   └── api/                     # API routes
├── components/                   # Reusable React components
│   ├── course-marketplace/      # Marketplace-specific components
│   ├── dashboard/               # Dashboard-specific components
│   └── ui/                      # Base UI components (Radix-based)
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Supabase client configuration
│   ├── auth-context.tsx        # Authentication context
│   ├── types.ts                # TypeScript type definitions
│   ├── actions.ts              # Server actions
│   ├── image-processing.ts     # Image processing utilities
│   └── utils.ts                # Utility functions
├── supabase/                    # Database migrations
└── public/                      # Static assets
```

## 🗄️ Database Schema

### Core Tables
- **courses**: Course listings with details, pricing, and metadata
- **schools**: Survival school information and contact details
- **users**: User accounts with role-based access control
- **bookmarks**: User course bookmarks
- **reviews**: Course reviews and ratings
- **gear**: Equipment listings with affiliate links
- **skills**: Skill definitions for courses

### Key Features
- **Role-based Access**: Admin and user roles with middleware protection
- **Image Management**: Server-side image processing with WebP conversion
- **Real-time Updates**: Live data synchronization via Supabase subscriptions
- **Search & Filtering**: Advanced course discovery with multiple criteria

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account and project

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livethrough
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase Database**
   Run the migrations in the `supabase/migrations/` directory to set up the database schema.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Key Features

### For Students
- **Course Discovery**: Browse courses with advanced filtering
- **Course Details**: View comprehensive course information including photos, descriptions, and school details
- **Bookmarking**: Save courses for later review
- **Location Search**: Find courses near your location
- **Responsive Design**: Works seamlessly on mobile and desktop

### For Schools/Instructors
- **Admin Dashboard**: Manage courses, students, and school information
- **Course Management**: Add, edit, and delete courses with rich text editing
- **Student Management**: Track enrolled students and their progress
- **Analytics**: View course performance and revenue metrics
- **Content Management**: Upload course photos with automatic optimization

### Technical Features
- **Authentication**: Secure user authentication with Supabase
- **Real-time Updates**: Live data synchronization
- **Image Management**: Course photo upload and storage with WebP conversion
- **Search & Filtering**: Advanced course discovery with multiple criteria
- **Responsive UI**: Mobile-first design approach
- **Dark Theme**: Consistent dark mode throughout the application

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure
- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable components
- **State Management**: React Context for global state
- **API Integration**: Supabase client for database operations

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Radix UI primitives with custom styling
- **Dark Theme**: Consistent dark mode throughout the application

## 🔐 Authentication & Security

- **Supabase Auth**: Secure authentication system
- **Protected Routes**: Middleware protection for admin areas
- **Role-based Access**: Different permissions for students vs. schools
- **Secure API**: Server-side validation and authentication

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adaptive layout with touch-friendly interactions
- **Mobile**: Mobile-first design with optimized navigation

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any platform supporting Node.js

## 📝 Development Guidelines

### Code Implementation Guidelines
- Use early returns whenever possible to make the code more readable
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags
- Use "class:" instead of the tertiary operator in class tags whenever possible
- Use descriptive variable and function/const names. Event functions should be named with a "handle" prefix
- Implement accessibility features on elements (tabindex, aria-label, etc.)
- Use consts instead of functions, for example, "const toggle = () =>"
- When removing a component from a file, remember to remove the import unless it's still needed

### Best Practices
- Follow DRY principle (Don't Repeat Yourself)
- Write bug-free, fully functional code
- Focus on readability over performance
- Leave NO todos, placeholders or missing pieces
- Ensure code is complete and thoroughly verified
- Include all required imports and ensure proper naming of key components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the coding guidelines
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Note to Developers**: This project follows strict coding guidelines as outlined in `cursor.rules`. Please ensure all code follows the established patterns and best practices for maintainability and consistency. 