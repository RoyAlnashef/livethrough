# Ad Slot Location Analysis

## Overview
This document identifies and documents all ad slot locations across the LiveThrough site based on the Phase 1 requirements.

## Ad Slot Strategy Summary
- **Marketplace Homepage**: 1 full-width ad after every 9th course card
- **Course Detail Pages**: 1 sidebar ad above school info + 1 full-width ad between description and similar courses
- **Dashboard Pages**: No ads (admin exclusion)
- **My Account Pages**: No ads (admin exclusion)
- **Admin Users**: Never see ads

## Detailed Ad Slot Locations

### 1. Marketplace Homepage (`/` - course-marketplace.tsx)

**Ad Slot 1: Course List Interstitial**
- **Location**: After every 9th course card in the course grid
- **Component**: `components/course-marketplace/course-list.tsx`
- **Implementation**: Insert ad component between course cards at index 8, 17, 26, etc.
- **Size**: Full-width responsive
- **Responsive Behavior**: 
  - Desktop: Full width within container
  - Mobile: Full width with padding
- **Styling**: Dark theme (zinc-950 background, zinc-800 border)
- **Placement Logic**: 
  ```tsx
  // In CourseList component, after every 9th course:
  {displayedCourses.map((course, index) => (
    <>
      <CourseCard course={course} />
      {(index + 1) % 9 === 0 && <AdSlot slotId="marketplace-interstitial" />}
    </>
  ))}
  ```

### 2. Course Detail Page (`/marketplace/courses/[id]`)

**Ad Slot 2: Sidebar Ad**
- **Location**: Above the School Info Card in the right sidebar
- **Component**: `app/marketplace/courses/[id]/course-detail-client.tsx`
- **Implementation**: Insert before `<SchoolInfoCard>` in the right column
- **Size**: Sidebar width (responsive)
- **Responsive Behavior**:
  - Desktop: Fixed in right sidebar
  - Mobile: Hidden (school info moves to bottom)
- **Styling**: Dark theme, rounded corners, zinc-800 border
- **Placement Logic**:
  ```tsx
  {/* Right Column - CTAs */}
  <div className="space-y-6 sticky top-8 self-start">
    <AdSlot slotId="course-sidebar" className="mb-4" />
    <SchoolInfoCard ... />
  </div>
  ```

**Ad Slot 3: Content Interstitial**
- **Location**: Between Course Description and Similar Courses sections
- **Component**: `app/marketplace/courses/[id]/course-detail-client.tsx`
- **Implementation**: Insert between the Course Description Card and Similar Courses section
- **Size**: Full-width within content area
- **Responsive Behavior**: Full width on all devices
- **Styling**: Dark theme, consistent with content cards
- **Placement Logic**:
  ```tsx
  {/* Course Description */}
  <Card className="bg-zinc-950 border-zinc-800 py-8 md:py-10">
    ...
  </Card>
  
  {/* Ad Slot */}
  <AdSlot slotId="course-content-interstitial" className="my-8" />
  
  {/* Similar Courses */}
  {similarCourses.length > 0 && (
    <div className="space-y-4 pt-8">
      ...
    </div>
  )}
  ```

## Ad Slot Configuration Schema

### Ad Slot Types
```typescript
interface AdSlot {
  id: string;
  name: string;
  location: 'marketplace-interstitial' | 'course-sidebar' | 'course-content-interstitial';
  enabled: boolean;
  responsive: boolean;
  size: {
    desktop: { width: string; height: string };
    mobile: { width: string; height: string };
  };
  placement: {
    page: string;
    component: string;
    position: 'before' | 'after' | 'between';
    targetElement?: string;
  };
}
```

### Ad Slot IDs
1. `marketplace-interstitial` - Full-width ads in course list
2. `course-sidebar` - Sidebar ads on course detail pages
3. `course-content-interstitial` - Content area ads on course detail pages

## User Experience Considerations

### Admin Exclusion Logic
- Check user role via `useAuth()` hook
- Hide ads completely for admin users
- No ad containers rendered for admins

### Responsive Design
- All ad slots use responsive sizing
- Mobile-first approach with desktop enhancements
- Consistent with existing design system

### Performance Optimization
- Lazy loading with IntersectionObserver
- Space reservation to prevent layout shift (CLS)
- Minimal impact on page load times

## Implementation Notes

### Component Integration Points
1. **CourseList Component**: Modify to insert ads after every 9th course
2. **CourseDetailClient**: Add sidebar ad above SchoolInfoCard
3. **CourseDetailClient**: Add interstitial ad between description and similar courses

### Styling Guidelines
- Background: `bg-zinc-950`
- Border: `border-zinc-800`
- Text: `text-zinc-100`
- Consistent with existing dark theme
- Rounded corners: `rounded-lg`
- Padding: `p-4` or `p-6`

### Technical Requirements
- Ad slots must be responsive
- Must support lazy loading
- Must prevent layout shift
- Must respect user consent
- Must exclude admin users
- Must be easily enableable/disableable via dashboard 