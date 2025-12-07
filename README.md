# LiveThrough - Survival Course Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)](https://tailwindcss.com/)

LiveThrough is a modern, full-stack web application that serves as a comprehensive marketplace for survival and outdoor education courses. Built with Next.js 15, React 19, and Supabase, it connects students with survival schools and instructors through an intuitive, responsive platform.

## 🏔️ Features

### For Students
- **Course Discovery**: Browse courses with advanced filtering by location, difficulty, environment, price, and duration
- **Course Details**: View comprehensive course information including photos, descriptions, and school details
- **Bookmarking**: Save courses for later review (requires authentication)
- **Search Functionality**: Search courses by title and description
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Dark Theme**: Consistent dark mode throughout the application

### For Schools/Instructors (Admin)
- **Admin Dashboard**: Complete management interface for courses, students, and schools
- **Course Management**: Add, edit, delete, and duplicate courses with rich text editing
- **Student Management**: Track enrolled students and their information
- **School Management**: Manage school information and details
- **Content Management**: Upload course photos with automatic WebP optimization
- **Bulk Operations**: Bulk status changes and course management
- **Course Import**: Import course data from external URLs
- **Advertisement Management**: Complete ad system with analytics and performance tracking

### Technical Features
- **Authentication**: Secure user authentication with Supabase (magic link and password-based)
- **Role-based Access**: Admin and student roles with middleware protection
- **Image Management**: Course photo upload and storage with WebP conversion using Sharp
- **Search & Filtering**: Advanced course discovery with multiple criteria
- **Rich Text Editing**: TipTap-based editor for course descriptions with image upload
- **SEO Optimization**: Server-side rendering, dynamic metadata, and structured data
- **Real-time Updates**: Live data synchronization via Supabase subscriptions
- **Accessible Footer**: WCAG-compliant footer with keyboard navigation, ARIA labels, and responsive design
- **Advertisement System**: Google AdSense integration with privacy-compliant consent management

## 📊 Advertisement System

### Overview
LiveThrough includes a comprehensive advertisement system designed to generate revenue while maintaining user experience and privacy compliance.

### Features
- **Google AdSense Integration**: Full AdSense support with responsive ad units
- **Privacy Compliance**: GDPR/CCPA compliant consent management
- **Admin Dashboard**: Complete ad management interface at `/dashboard/ads`
- **Analytics Tracking**: Real-time impression and click tracking
- **Performance Optimization**: Lazy loading and layout shift prevention
- **Role-based Exclusion**: Ads hidden for admin users

### Ad Management Dashboard
- **Slot Management**: Enable/disable ad slots with toggle switches
- **Performance Analytics**: Real-time metrics with date range filtering
- **Revenue Tracking**: Display aggregate revenue (when available from AdSense)
- **Ad Code Configuration**: Manage AdSense client ID and slot configurations
- **Privacy Controls**: Consent management and user exclusion settings

### Technical Implementation
- **Components**: `AdSlot`, `AdSenseScript`, `ConsentBanner`
- **API Endpoints**: `/api/ads/analytics` for tracking and retrieval
- **Database**: `ad_analytics` table with Row Level Security
- **Privacy**: Non-PII analytics with consent-aware loading

### Current Status
- ✅ **Infrastructure Complete**: Full ad system implemented and tested
- ✅ **Google AdSense**: Account created and application submitted
- ✅ **Client ID**: `ca-pub-1437334079893020` configured
- ⏳ **Pending**: Google AdSense approval (1-2 weeks typical)
- ⏳ **Next Steps**: Ad unit creation and live testing after approval

## 🚀 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://reactjs.org/)** - UI library with TypeScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage with image processing
- **[NextAuth.js](https://next-auth.js.org/)** - Additional authentication features

### Key Libraries
- **[Sharp](https://sharp.pixelplumbing.com/)** - Server-side image processing and WebP conversion
- **[TipTap](https://tiptap.dev/)** - Rich text editing with custom extensions
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[Date-fns](https://date-fns.org/)** - Date manipulation
- **[Cheerio](https://cheerio.js.org/)** - Web scraping for course import

## 📁 Project Structure

```
livethrough/
├── app/                          # Next.js App Router pages
│   ├── dashboard/                # Admin dashboard for schools
│   │   ├── courses/             # Course management (CRUD, bulk operations)
│   │   ├── students/            # Student management
│   │   ├── schools/             # School management
│   │   ├── ads/                 # Advertisement management and analytics
│   │   ├── admin-users/         # Admin user management
│   │   ├── settings/            # General settings
│   │   └── security/            # Security settings
│   ├── marketplace/             # Public course marketplace
│   │   └── courses/[id]/        # Individual course pages (SSR)
│   ├── account/                 # User account management
│   ├── admin-login/             # Admin authentication
│   ├── admin-setup/             # Admin setup (first admin creation)
│   └── api/                     # API routes
│       ├── ads/                 # Advertisement analytics and tracking
│       │   └── analytics/       # Ad impression and click tracking
│       ├── upload-chunk/        # Image upload with chunking and WebP conversion
│       ├── scrape-course/       # Course scraping functionality
│       └── test-*/              # Testing endpoints
├── components/                   # Reusable React components
│   ├── ads/                     # Advertisement components
│   │   ├── AdSlot.tsx          # Ad slot rendering component
│   │   ├── AdSenseScript.tsx   # Google AdSense script loader
│   │   ├── ConsentBanner.tsx   # Privacy consent banner
│   │   └── index.tsx           # Component exports
│   ├── course-marketplace/      # Marketplace-specific components
│   ├── dashboard/               # Dashboard-specific components
│   ├── tiptap-*/               # Rich text editor components
│   └── ui/                      # Base UI components (Radix-based)
├── lib/                         # Utility libraries
│   ├── supabase.ts             # Supabase client configuration
│   ├── auth-context.tsx        # Authentication context
│   ├── types.ts                # TypeScript type definitions
│   ├── actions.ts              # Server actions
│   ├── image-processing.ts     # Image processing utilities
│   └── utils.ts                # Utility functions
├── hooks/                       # Custom React hooks
│   └── use-ad-consent.ts       # Advertisement consent management
├── supabase/                    # Database migrations
│   └── migrations/
│       └── 20250725120000_create_ad_analytics.sql  # Ad analytics table
├── public/                      # Static assets
└── netlify.toml                 # Netlify deployment configuration
```

## 🗄️ Database Schema

### Core Tables
- **courses**: Course listings with details, pricing, and metadata
- **schools**: Survival school information and contact details
- **users**: User accounts with role-based access control (admin/student)
- **bookmarks**: User course bookmarks
- **course_types**: Course type definitions
- **course_skills**: Skills associated with courses
- **course_gear**: Equipment associated with courses
- **ad_analytics**: Advertisement performance tracking (impressions, clicks)

### Key Features
- **Role-based Access**: Admin and student roles with middleware protection
- **Image Management**: Server-side image processing with WebP conversion
- **Real-time Updates**: Live data synchronization via Supabase subscriptions
- **Search & Filtering**: Advanced course discovery with multiple criteria
- **Advertisement Analytics**: Privacy-compliant ad performance tracking

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Supabase** account and project ([Sign up](https://supabase.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livethrough
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # NextAuth Configuration (if using)
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up Supabase Database**
   
   Run the migrations in the `supabase/migrations/` directory:
   ```bash
   # If using Supabase CLI
   supabase db push
   
   # Or manually run the SQL files in supabase/migrations/
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Type checking
npx tsc --noEmit     # TypeScript type checking
```

### Code Structure Guidelines

- **TypeScript**: Full type safety throughout the application
- **Component Architecture**: Modular, reusable components
- **State Management**: React Context for global state
- **API Integration**: Supabase client for database operations

### Styling Guidelines

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Radix UI primitives with custom styling
- **Dark Theme: ZINC**: Consistent dark mode throughout the application

### Code Implementation Guidelines

Follow these rules when writing code:

- Use early returns whenever possible to make the code more readable
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags
- Use "class:" instead of the tertiary operator in class tags whenever possible
- Use descriptive variable and function/const names. Event functions should be named with a "handle" prefix
- Implement accessibility features on elements (tabindex, aria-label, etc.)
- Use consts instead of functions, for example, "const toggle = () =>"
- When removing a component from a file, remember to remove the import unless it's still needed

## 🔐 Authentication & Security

### Authentication Flow
- **Supabase Auth**: Secure authentication system with email/password and magic link
- **Protected Routes**: Middleware protection for admin areas
- **Role-based Access**: Different permissions for students vs. admins
- **Secure API**: Server-side validation and authentication

### Middleware Configuration
The application uses Next.js middleware to protect routes:
- `/account/*` - Requires authentication
- `/dashboard/*` - Requires admin role

### Admin Setup
- First admin creation through `/admin-setup` route
- Subsequent admin logins through `/admin-login`
- Admin role management through dashboard

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adaptive layout with touch-friendly interactions
- **Mobile**: Mobile-first design with optimized navigation

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   npm run start
   ```

3. **Netlify Deployment**
   
   The application is configured for Netlify deployment with `netlify.toml`:
   - Automatic builds on push to the `dev` branch
   - Environment variables configured in Netlify dashboard
   - Redirects and rewrites configured for Next.js App Router

### Deployment Platforms

The application is deployed on:
- **[Netlify](https://netlify.com/)** (primary hosting platform)

The application is also compatible with:
- **[Vercel](https://vercel.com/)**
- **[Railway](https://railway.app/)**
- Any platform supporting Node.js

### Environment Variables for Production

Ensure all required environment variables are set in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🔧 API Endpoints

### Image Upload
- `POST /api/upload-chunk` - Chunked image upload with WebP conversion
- `POST /api/test-direct-upload` - Direct upload testing
- `POST /api/test-webp-upload` - WebP conversion testing

### Course Management
- `POST /api/scrape-course` - Course data scraping functionality

### Advertisement Analytics
- `POST /api/ads/analytics` - Record ad impressions and clicks
- `GET /api/ads/analytics` - Retrieve aggregated ad performance data

## 📊 Performance Optimization

### Image Processing
- **Sharp**: Server-side image processing with WebP conversion
- **Chunked Uploads**: Large file uploads with progress tracking
- **Optimization**: Automatic resizing and compression
- **Storage**: Supabase storage with global CDN

### SEO & Performance
- **Server-Side Rendering (SSR)**: Course detail pages for better SEO
- **Dynamic Metadata**: SEO-optimized titles, descriptions, and keywords
- **Structured Data**: Schema.org markup for courses and breadcrumbs
- **Image Optimization**: Next.js Image component with Supabase storage

### Caching Strategy
- **Static Generation**: Next.js static site generation for better performance
- **Image Optimization**: Next.js Image component with Supabase storage
- **CDN**: Supabase storage with global CDN

## 🧪 Testing

### Manual Testing
- Test all user flows (student and admin)
- Verify responsive design on different devices
- Check image upload and processing functionality
- Validate authentication and authorization

### Code Quality
- ESLint configuration for code quality
- TypeScript for type safety
- Prettier for code formatting (recommended)

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding guidelines
4. **Test thoroughly** on different devices and browsers
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Submit a pull request**

### Commit Message Convention

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the [Supabase documentation](https://supabase.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)
- Consult the [Tailwind CSS documentation](https://tailwindcss.com/docs)

---

**Note to AI Developer**: This project follows strict coding guidelines as outlined in the `.cursor/rules/` directory. Please ensure all code follows the established patterns and best practices for maintainability and consistency. When making changes, always analyze the existing codebase structure and maintain the established architectural patterns, naming conventions, and styling approaches. 

## School Management (Add/Edit)

### Routing Structure
- Add School: `/dashboard/schools/add`
- Edit School: `/dashboard/schools/[id]`
- List Schools: `/dashboard/schools`

### Form Validation Rules
- **School Name**: Required, 2-100 characters
- **Website**: Optional, must start with http:// or https:// if provided
- **Contact Email**: Optional, must be a valid email if provided
- **Social Media URLs**: Optional, must start with http:// or https:// if provided (Facebook, Twitter, Instagram, YouTube, TikTok)
- **Logo Upload**: JPG, PNG, WEBP, GIF, SVG; max 2MB; preview and remove supported
- **All fields**: Real-time validation and error messages

### Features
- Full-page add/edit forms (no modal)
- Breadcrumb navigation
- State persistence (localStorage)
- Success/error toast notifications
- Responsive and accessible UI 

## Shared Validation Utilities

All dashboard forms (School, Course, Student, Auth, etc.) use shared validation helpers from `lib/validation.ts` for:
- Email validation
- URL validation
- Required field validation
- Min/max length
- Phone number validation

This ensures consistent error messages and validation logic across the application. To add new validation rules, update `lib/validation.ts` and refactor forms to use the new helpers. 