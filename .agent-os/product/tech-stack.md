# Technical Stack

> Last Updated: 2025-01-27
> Version: 1.0.0

## Frontend Technologies

- **Application Framework:** Next.js 15.2.4 (App Router)
- **JavaScript Framework:** React 19.0.0
- **CSS Framework:** Tailwind CSS 4.0
- **UI Component Library:** Radix UI (various components)
- **Icon Library:** Lucide React 0.514.0
- **Animation Library:** Framer Motion 12.16.0
- **Rich Text Editor:** TipTap 3.0.0-beta.17
- **Date Handling:** Date-fns 4.1.0
- **Toast Notifications:** Sonner 2.0.3

## Backend & Database

- **Database System:** PostgreSQL (via Supabase)
- **Backend-as-a-Service:** Supabase 2.49.8
- **Authentication:** Supabase Auth + NextAuth.js 4.24.11
- **File Storage:** Supabase Storage
- **Real-time Features:** Supabase Realtime

## Advertisement System

- **Ad Network:** Google AdSense
- **Ad Client ID:** ca-pub-1437334079893020
- **Ad Components:** Custom AdSlot, AdSenseScript, ConsentBanner
- **Analytics Tracking:** Custom API endpoints for impression/click tracking
- **Privacy Management:** GDPR/CCPA compliant consent system
- **Performance:** Lazy loading with IntersectionObserver, layout shift prevention

## Development Tools

- **Language:** TypeScript 5.0
- **Package Manager:** npm
- **Linting:** ESLint 9.0
- **Image Processing:** Sharp 0.34.2
- **Web Scraping:** Cheerio 1.1.0
- **Data Visualization:** Recharts 2.15.3

## Infrastructure & Deployment

- **Application Hosting:** Vercel (recommended for Next.js)
- **Database Hosting:** Supabase Cloud
- **Asset Hosting:** Supabase Storage with CDN
- **Deployment Solution:** Vercel (with automatic deployments)
- **Code Repository:** Git (GitHub/GitLab)

## Import Strategy

- **Module System:** Node.js ES modules
- **Import Maps:** Not used (standard Node.js imports)

## Fonts & Assets

- **Fonts Provider:** System fonts (via Tailwind CSS)
- **Image Optimization:** Next.js Image component + Sharp
- **Static Assets:** Public directory with optimized delivery

## Development Environment

- **Node.js Version:** 18+ (required)
- **Package Manager:** npm
- **Environment Variables:** .env.local for local development
- **Database Migrations:** Supabase CLI or manual SQL execution

## Security & Performance

- **Authentication:** Role-based access control (RBAC)
- **API Security:** Server-side validation and authentication
- **Image Processing:** Server-side WebP conversion and optimization
- **Caching:** Next.js static generation and Supabase CDN
- **Performance:** Turbopack for development, optimized builds for production
- **Privacy Compliance:** GDPR/CCPA compliant ad consent management
- **Ad Security:** Row Level Security (RLS) for ad analytics data 