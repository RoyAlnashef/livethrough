# Student Settings Page Specification

## Overview
Create a functional settings page for students in the My Account section that provides essential account management features for the MVP. The current settings page has placeholder UI that needs to be replaced with working functionality based on the platform's current feature set.

## Current State Analysis

### Existing Features
Based on the codebase exploration, LiveThrough currently has:

**Authentication & User Management:**
- Supabase Auth with email/password and magic link
- Role-based access (admin/student)
- User profiles with: `id`, `email`, `full_name`, `phone`, `bio`, `avatar_url`, `role`, `status`, `created_at`, `last_sign_in`
- Middleware protection for authenticated routes

**Student Features:**
- Course bookmarking system (saves courses to "My Courses")
- Course discovery and filtering
- Responsive design with dark theme
- Account layout with "My Courses" and "Settings" navigation

**Platform Infrastructure:**
- Complete admin dashboard for course/school management
- Image upload with WebP optimization
- Advertisement system with analytics
- Database schema with bookmarks, reviews, favorites tables

### ✅ Phase 1 Implementation Status (COMPLETED - January 27, 2025)

**UI/UX Implementation:**
- ✅ Complete settings page UI with all sections (Profile, Notifications, Privacy, Security, Danger Zone, Legal)
- ✅ Responsive design: Mobile single-column, Desktop two-column with navigation
- ✅ Consistent design system with teal color scheme and zinc-950/zinc-800 styling
- ✅ Modular component architecture with reusable components
- ✅ TypeScript type safety throughout all components
- ✅ Lucide React icons for consistent iconography

**Component System:**
- ✅ `SettingsSection` - Wrapper component with title styling
- ✅ `SettingsToggle` - Toggle switch component
- ✅ `SettingsInput` - Form input component with validation
- ✅ `SettingsButton` - Action button component with variants
- ✅ All section components with proper layout patterns

**Navigation & Layout:**
- ✅ Left-column navigation with section links
- ✅ Mobile-optimized layout (navigation hidden on md and smaller)
- ✅ All sections visible in single scrollable column on mobile
- ✅ Proper loading states and error boundaries

### Current Settings Page Status
- ✅ **UI Complete**: All sections have functional-looking components
- ⏳ **Backend Integration**: UI components ready for backend connection
- ⏳ **Data Persistence**: Form handling and validation ready for implementation
- ⏳ **Error Handling**: UI structure ready for real error handling

## MVP Settings Strategy

For the MVP, focus on **essential settings that students actually need** based on the current feature set:

### 1. Profile Information (High Priority)
**Why:** Students need to manage their basic account info for course interactions
- **First Name, Last Name** - Required for course interactions and personalization
- **Email** - Primary authentication method, should be read-only with change option
- **Phone** - Optional but useful for course communications
- **Profile Photo** - Avatar display for personalization
- **Bio** - Optional description for community features

### 2. Notification Settings (Medium Priority)
**Why:** Students need to stay informed about their bookmarked courses
- **Email Notifications** - Course updates, new content, system announcements
- **Course Updates** - Notifications when bookmarked courses have new content
- **Marketing Emails** - Optional promotional content (GDPR compliant)

### 3. Privacy Settings (Medium Priority)
**Why:** Students need control over their data and visibility
- **Profile Visibility** - Control who can see their profile information
- **Course Activity** - Control visibility of bookmarked courses
- **Data Usage** - GDPR compliance for data processing

### 4. Account Security (High Priority)
**Why:** Essential for account protection
- **Password Change** - Secure password management
- **Two-Factor Authentication** - Enhanced security (future feature)
- **Login History** - Account activity monitoring

### 5. Danger Zone (High Priority)
**Why:** Legal requirement for account deletion
- **Delete Account** - Complete account removal with data cleanup
- **Data Export** - GDPR compliance for data portability

## Technical Specifications

### Database Schema
The `users` table already supports most required fields:
```sql
users (
  id, email, full_name, phone, bio, avatar_url, 
  role, status, created_at, last_sign_in
)
```

**Additional fields needed:**
```sql
-- Add to users table
ALTER TABLE users ADD COLUMN notification_preferences JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN privacy_settings JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
```

### API Endpoints
Create server actions for settings management:

```typescript
// lib/settings-actions.ts
export async function updateUserProfile(userId: string, data: ProfileData)
export async function updateNotificationSettings(userId: string, settings: NotificationSettings)
export async function updatePrivacySettings(userId: string, settings: PrivacySettings)
export async function changePassword(userId: string, currentPassword: string, newPassword: string)
export async function deleteAccount(userId: string, password: string)
export async function exportUserData(userId: string)
```

### Component Structure
```typescript
// app/account/settings/page.tsx
- ProfileInformation (form with validation)
- NotificationSettings (toggle switches)
- PrivacySettings (toggle switches)
- SecuritySettings (password change, 2FA)
- DangerZone (delete account, data export)
```

### Form Validation
- Email format validation
- Password strength requirements
- Required field validation
- Real-time validation feedback

### Error Handling
- Supabase error handling
- Network error recovery
- User-friendly error messages
- Loading states for all actions

## Implementation Priority

### Phase 1: Core Profile Management (Week 1) ✅ COMPLETED
1. **Profile Information Form** ✅
   - ✅ Settings page layout and navigation
   - ✅ Loading states and error boundaries
   - ✅ Responsive design implementation
   - ⏳ Load existing user data from Supabase (Phase 2)
   - ⏳ Form validation and error handling (Phase 2)
   - ⏳ Real-time save with optimistic updates (Phase 2)
   - ⏳ Profile photo upload with image optimization (Phase 2)

2. **Basic Settings Structure** ✅
   - ✅ Settings page layout and navigation
   - ✅ Loading states and error boundaries
   - ✅ Responsive design implementation

### Phase 2: Notification & Privacy (Week 2)
1. **Notification Settings** ⏳
   - ✅ Toggle switches for email preferences (UI Complete)
   - ⏳ Save preferences to database
   - ⏳ Email service integration setup

2. **Privacy Settings** ⏳
   - ✅ Profile visibility controls (UI Complete)
   - ✅ Data usage preferences (UI Complete)
   - ⏳ GDPR compliance features (Backend needed)

### Phase 3: Security & Account Management (Week 3)
1. **Security Settings** ⏳
   - ✅ Password change functionality (UI Complete)
   - ✅ Account activity display (UI Complete)
   - ⏳ Security audit trail (Backend needed)

2. **Danger Zone** ⏳
   - ✅ Account deletion with confirmation (UI Complete)
   - ✅ Data export functionality (UI Complete)
   - ✅ Legal compliance features (UI Complete)

## Success Criteria

### Functional Requirements
- [ ] All form fields save to Supabase database
- [ ] Real-time validation and error handling
- [ ] Profile photo upload and display
- [ ] Notification preferences persist
- [ ] Privacy settings control data visibility
- [ ] Password change works securely
- [ ] Account deletion removes all user data
- [ ] Data export generates user's complete data

### User Experience Requirements
- [ ] Responsive design works on all devices
- [ ] Loading states for all async operations
- [ ] Clear error messages and recovery options
- [ ] Consistent styling with existing design
- [ ] Accessibility compliance (ARIA labels, keyboard navigation)
- [ ] Smooth animations and transitions

### Technical Requirements
- [ ] TypeScript type safety throughout
- [ ] Server-side validation for all inputs
- [ ] Proper error boundaries and fallbacks
- [ ] Optimistic updates for better UX
- [ ] Database transactions for data integrity
- [ ] Security best practices (CSRF protection, input sanitization)

## Risk Assessment

### High Risk
- **Data Loss**: Account deletion must be carefully implemented
- **Security**: Password changes and 2FA require careful implementation
- **GDPR Compliance**: Data export and deletion must meet legal requirements

### Medium Risk
- **Email Integration**: Notification system requires email service setup
- **Image Upload**: Profile photos need proper storage and optimization
- **Database Schema**: Adding new fields requires migration planning

### Low Risk
- **UI/UX**: Settings page is self-contained
- **Validation**: Form validation is straightforward
- **Styling**: Consistent with existing design system

## Dependencies

### External Services
- **Email Service**: For notification delivery (SendGrid, AWS SES, etc.)
- **Image Storage**: For profile photos (Supabase Storage)
- **GDPR Compliance**: Legal requirements for data handling

### Internal Dependencies
- **Supabase Auth**: User authentication and session management
- **Database Migrations**: Schema updates for new fields
- **Image Processing**: Profile photo optimization pipeline

## Future Enhancements

### Phase 2 Features (Post-MVP)
- **Two-Factor Authentication**: Enhanced security
- **Social Login**: Google, Facebook integration
- **Advanced Notifications**: Push notifications, SMS
- **Profile Customization**: Themes, preferences
- **Activity History**: Detailed user activity tracking

### Phase 3 Features (Long-term)
- **API Access**: Third-party integrations
- **Advanced Privacy**: Granular data control
- **Account Recovery**: Enhanced recovery options
- **Multi-language**: Internationalization support

## Conclusion

This specification provides a focused, MVP-appropriate settings page that leverages existing platform features while adding essential account management capabilities. The implementation prioritizes user needs based on current functionality (bookmarking, course discovery) while building a foundation for future features.

The settings page should feel native to the platform while providing all essential account management features that students expect from a modern web application. 