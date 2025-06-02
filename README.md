# LiveThrough - Course Marketplace Platform

LiveThrough is a modern web application built with Next.js that serves as a marketplace for courses. It provides a platform for course providers to list their courses and for students to discover, filter, and enroll in courses that match their interests and requirements.

## Features

### Course Marketplace
- Advanced course filtering system
  - Price range
  - Duration
  - Course types
  - Difficulty levels
  - Date ranges
  - Location-based filtering
  - Environment types
  - Arena types
- Grid and list view options
- Multiple sorting options (Most Popular, Price, Newest, Closest)
- Location-based course discovery
- Search functionality
- Course details including:
  - Prerequisites
  - Certifications
  - Immersion options
  - Environment types
  - Arena types

### Dashboard
- Course management interface
- Course creation and editing
- Recent sales overview
- User navigation
- Search functionality
- Breadcrumb navigation

## Tech Stack

- **Frontend Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **UI Components**: 
  - Radix UI
  - Tailwind CSS
  - Custom UI components
- **State Management**: React Hooks
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Notifications**: Sonner

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd livethrough
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
livethrough/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── course-marketplace/ # Course marketplace components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
├── public/              # Static assets
└── styles/             # Global styles
```

## Development Notes

### Completed Features
- Course marketplace with advanced filtering
- Dashboard layout and navigation
- Course management interface
- Location-based course discovery
- Search functionality
- Responsive design

### In Progress
- Course enrollment system
- User authentication
- Payment integration
- Course provider profiles

### TODO
- User reviews and ratings
- Course recommendations
- Analytics dashboard
- Email notifications
- Mobile app version

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [support@livethrough.com] or open an issue in the repository.
