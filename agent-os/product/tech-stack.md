# Tech Stack

## Framework & Runtime

- **Application Framework:** Next.js 15.2.4 (App Router with Turbopack)
- **Language/Runtime:** Node.js 18+ (TypeScript 5.0)
- **Package Manager:** npm

## Frontend

- **JavaScript Framework:** React 19.0.0 with TypeScript
- **CSS Framework:** Tailwind CSS 4.0
- **UI Components:** Radix UI primitives with custom styling
- **Animation Library:** Framer Motion 12.16.0
- **Icon Library:** Lucide React 0.514.0
- **Rich Text Editor:** TipTap 3.0.0-beta.17 with custom extensions
- **Toast Notifications:** Sonner 2.0.3
- **Date Manipulation:** Date-fns 4.1.0
- **Form Validation:** Zod 4.0.15
- **Styling Utilities:** 
  - class-variance-authority 0.7.1
  - clsx 2.1.1
  - tailwind-merge 3.3.0
- **UI Primitives:** 
  - @radix-ui/react-alert-dialog
  - @radix-ui/react-avatar
  - @radix-ui/react-checkbox
  - @radix-ui/react-dialog
  - @radix-ui/react-dropdown-menu
  - @radix-ui/react-label
  - @radix-ui/react-popover
  - @radix-ui/react-select
  - @radix-ui/react-separator
  - @radix-ui/react-slider
  - @radix-ui/react-switch
  - @radix-ui/react-tooltip
- **Floating UI:** @floating-ui/react 0.27.13
- **Charts:** Recharts 2.15.3
- **Date Picker:** react-day-picker 9.7.0

## Backend & Database

- **Backend-as-a-Service:** Supabase
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (email/password and magic link)
  - File storage with image processing
- **Supabase Libraries:**
  - @supabase/ssr 0.6.1
  - @supabase/supabase-js 2.49.8
- **Additional Authentication:** NextAuth.js 4.24.11
- **Image Processing:** Sharp 0.34.2 (server-side WebP conversion and optimization)
- **Web Scraping:** Cheerio 1.1.0 (for course import functionality)

## Development Tools

- **Type Checking:** TypeScript 5.0
- **Linting:** ESLint 9 with eslint-config-next
- **CSS Preprocessing:** Sass 1.89.2
- **PostCSS:** @tailwindcss/postcss 4
- **Environment Variables:** dotenv 16.5.0
- **Animation Utilities:** tw-animate-css 1.3.0

## Testing & Quality

- **Linting/Formatting:** ESLint with Next.js configuration
- **Type Safety:** TypeScript with strict mode enabled

## Deployment & Infrastructure

- **Hosting:** Netlify (primary hosting platform)
- **Image CDN:** Supabase Storage with global CDN
- **Build Tool:** Next.js built-in build system with Turbopack
- **Netlify Configuration:** `netlify.toml` (for deployment settings and redirects)

## Third-Party Services

- **Authentication:** Supabase Auth (primary), NextAuth.js (additional features)
- **Database:** Supabase PostgreSQL
- **File Storage:** Supabase Storage
- **Advertisement:** Google AdSense (ca-pub-1437334079893020)
- **Email:** (To be configured - for notifications)
- **Payment Processing:** (To be integrated - for course bookings)

## Key Libraries & Utilities

- **Server Actions:** Next.js 15 Server Actions (with 10MB body size limit)
- **Image Optimization:** Next.js Image component with Supabase storage
- **SEO:** Server-side rendering (SSR), dynamic metadata, structured data (JSON-LD)
- **Real-time:** Supabase real-time subscriptions
- **Validation:** Zod for schema validation
- **State Management:** React Context API

## Configuration Files

- **Next.js Config:** `next.config.ts` (with image remote patterns and server actions configuration)
- **TypeScript Config:** `tsconfig.json` (strict mode, ES2017 target, path aliases)
- **PostCSS Config:** `postcss.config.mjs`
- **ESLint Config:** `eslint.config.mjs`
- **Component Config:** `components.json` (for UI component configuration)

## Development Workflow

- **Development Server:** `npm run dev` (Next.js dev server with Turbopack)
- **Build:** `npm run build` (production build)
- **Start:** `npm run start` (production server)
- **Lint:** `npm run lint` (ESLint)

