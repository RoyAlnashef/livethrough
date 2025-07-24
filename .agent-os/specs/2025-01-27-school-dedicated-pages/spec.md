# School Add/Edit Dedicated Pages Specification

## Overview
Move the school add/edit functionality from a constrained modal dialog to dedicated full-page forms, following the same pattern as the course management system. This will provide more space for form fields, better user experience, and room for future expansion of the School component.

## Current State Analysis

### Existing Implementation
- **Modal-based approach**: Schools were previously added/edited through `SchoolFormDialog` component (now removed)
- **Constrained space**: Modal limited to 600px width, restricting form layout and field expansion
- **Current location**: `components/dashboard/SchoolForm.tsx` (formerly also `SchoolFormDialog.tsx`, now removed)
- **Integration**: Used in `app/dashboard/schools/page.tsx` with inline state management

### Current Form Fields
- School Name (required)
- Website
- Description
- Contact Email
- Location
- Contact Phone
- Address
- Social Media URLs (Facebook, Twitter, Instagram, YouTube)
- School Logo upload

### Limitations
1. **Space constraints**: Modal width limits field layout and expansion
2. **Poor UX**: Cramped form layout, especially for longer descriptions
3. **No room for growth**: Difficult to add new fields or sections
4. **Inconsistent with courses**: Courses use dedicated pages while schools use modals

## Technical Requirements

### New File Structure
```
app/dashboard/schools/
├── page.tsx (existing - updated)
├── add/
│   └── page.tsx (new)
└── [id]/
    └── page.tsx (new)
```

### Component Updates
```
components/dashboard/
├── SchoolForm.tsx (existing - enhanced)
├── SchoolFormDialog.tsx (deprecated - removed after migration)
└── school-form.tsx (new - renamed and enhanced)
```

### Routing Changes
- **Add School**: `/dashboard/schools/add` (new route)
- **Edit School**: `/dashboard/schools/[id]` (new route)
- **List Schools**: `/dashboard/schools` (existing - updated)

### Database Operations
- **Add School**: Create new school record with logo upload
- **Edit School**: Update existing school record with logo replacement
- **Delete School**: Remove school and associated logo files
- **Validation**: Required fields validation and data sanitization

## Implementation Plan

### Phase 1: Create New Page Structure (Day 1)
1. **Create add page**: `app/dashboard/schools/add/page.tsx`
   - Follow pattern from `app/dashboard/courses/add/page.tsx`
   - Implement form submission with logo upload
   - Add navigation and breadcrumbs

2. **Create edit page**: `app/dashboard/schools/[id]/page.tsx`
   - Follow pattern from `app/dashboard/courses/[id]/page.tsx`
   - Implement data fetching and form population
   - Add update functionality with logo replacement

3. **Enhance SchoolForm component**:
   - Rename to `school-form.tsx` for consistency
   - Expand layout to full-page design
   - Add better field organization and spacing
   - Implement enhanced validation

### Phase 2: Update Navigation and Integration (Day 2)
1. **Update schools list page**:
   - Replace modal triggers with navigation links
   - Update "Add School" button to navigate to `/dashboard/schools/add`
   - Update "Edit" buttons to navigate to `/dashboard/schools/[id]`
   - Remove modal-related state and components

2. **Add breadcrumb navigation**:
   - Implement consistent breadcrumb structure
   - Add navigation between list, add, and edit pages

3. **Update form actions**:
   - Implement proper form submission handling
   - Add success/error toast notifications
   - Add loading states and validation feedback

### Phase 3: Enhanced Features and Cleanup (Day 3)
1. **Enhanced form features**:
   - Add field validation with error messages
   - Implement form state persistence
   - Add confirmation dialogs for destructive actions
   - Enhance logo upload with preview and validation

2. **Remove deprecated components**:
   - Delete `SchoolFormDialog.tsx` (done)
   - Clean up unused imports and state
   - Update any remaining references

3. **Testing and validation**:
   - Test all CRUD operations
   - Validate form submissions and error handling
   - Test navigation and breadcrumbs
   - Verify logo upload functionality

## Success Metrics

### User Experience
- **Form usability**: Full-page forms provide better UX than cramped modals
- **Navigation consistency**: Schools follow same pattern as courses
- **Field expansion**: Room to add new fields without layout issues
- **Responsive design**: Better mobile experience with dedicated pages

### Technical Metrics
- **Code consistency**: Schools and courses follow same architectural patterns
- **Maintainability**: Easier to extend and modify school forms
- **Performance**: No modal overhead, direct page navigation
- **Accessibility**: Better screen reader support with dedicated pages

### Business Metrics
- **User adoption**: Improved form completion rates
- **Data quality**: Better validation and user input
- **Feature velocity**: Easier to add new school-related features

## Testing & Validation

### Functional Testing
1. **Add School Flow**:
   - Navigate to `/dashboard/schools/add`
   - Fill out all required fields
   - Upload school logo
   - Submit form and verify creation
   - Verify redirect to schools list

2. **Edit School Flow**:
   - Navigate to `/dashboard/schools/[id]`
   - Verify form pre-population
   - Modify fields and submit
   - Verify updates in database
   - Test logo replacement

3. **Navigation Testing**:
   - Test breadcrumb navigation
   - Verify back/cancel functionality
   - Test direct URL access
   - Verify proper error handling

### Integration Testing
1. **Database Operations**:
   - Test school creation with logo upload
   - Test school updates with logo replacement
   - Test school deletion with logo cleanup
   - Verify data integrity

2. **UI/UX Testing**:
   - Test responsive design on mobile/tablet
   - Verify form validation messages
   - Test loading states and error handling
   - Verify toast notifications

## Risk Mitigation

### Potential Issues
1. **Data migration**: Existing schools remain unaffected
2. **URL changes**: Update any hardcoded links to school forms
3. **Component dependencies**: Ensure no other components depend on modal
4. **Form state**: Handle form state persistence and validation

### Mitigation Strategies
1. **Gradual migration**: Keep modal temporarily, add new pages alongside
2. **Backward compatibility**: Maintain existing API endpoints
3. **Comprehensive testing**: Test all user flows before removal
4. **Documentation**: Update any documentation referencing old modal

### Rollback Plan
1. **Keep modal code**: Don't delete until new pages are fully tested
2. **Feature flags**: Consider feature flag for gradual rollout
3. **Monitoring**: Monitor for any issues after deployment
4. **Quick revert**: Ability to quickly revert to modal if needed

## Code Examples

### New Add Page Structure
```typescript
// app/dashboard/schools/add/page.tsx
'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { SchoolForm } from "@/components/dashboard/school-form"
import { toast } from "sonner"
import { School } from "@/lib/types"
import { addSchoolWithLogo } from "@/lib/actions"

export default function AddSchoolPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: School, logoFile?: File) => {
    setIsSubmitting(true)
    try {
      const result = await addSchoolWithLogo(data, logoFile)
      if (result.success) {
        toast.success('School created successfully!')
        router.push('/dashboard/schools')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SchoolForm 
      mode="add" 
      onSubmit={handleSubmit} 
      isSubmitting={isSubmitting} 
    />
  )
}
```

### Enhanced School Form Layout
```typescript
// components/dashboard/school-form.tsx
export function SchoolForm({ mode, initialValues, onSubmit, isSubmitting }: SchoolFormProps) {
  // ... existing state management

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">
          {mode === "add" ? "Add New School" : "Edit School"}
        </h1>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Information */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* School Name, Website, Description */}
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email, Phone, Address, Location */}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Media & Social */}
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">School Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo upload with preview */}
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-50">Social Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Social media URLs */}
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white flex-1">
              {mode === "add" ? "Create School" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
```

### Updated Schools List Page
```typescript
// app/dashboard/schools/page.tsx (updated)
export default function SchoolsPage() {
  // Remove modal-related state
  // const [showDialog, setShowDialog] = useState(false)
  // const [dialogMode, setDialogMode] = useState<'add' | 'edit'>("add")
  // const [editSchool, setEditSchool] = useState<School | null>(null)
  
  const handleAdd = () => {
    router.push('/dashboard/schools/add')
  }
  
  const handleEdit = (school: School) => {
    router.push(`/dashboard/schools/${school.id}`)
  }
  
  // Remove SchoolFormDialog component from JSX (already done)
  return (
    <div>
      {/* ... existing list UI ... */}
      <Button onClick={handleAdd}>+ Add School</Button>
      {/* ... school list with edit buttons ... */}
    </div>
  )
}
```

## Timeline

- **Day 1**: Create new page structure and enhanced form component
- **Day 2**: Update navigation and integrate new pages
- **Day 3**: Enhanced features, testing, and cleanup
- **Total**: 3 days for complete migration

## Dependencies

- **Next.js**: For routing and page structure
- **Supabase**: For database operations and file storage
- **React Hook Form**: For enhanced form handling (optional enhancement)
- **Toast notifications**: For user feedback
- **Breadcrumb component**: For navigation consistency

## Conclusion

Moving from modal-based to dedicated page forms for school management will significantly improve the user experience, provide room for future expansion, and create consistency with the course management system. The implementation follows established patterns and maintains backward compatibility during the transition. 

## Quick Reference: School Add/Edit Pages

### Routing Structure
- Add School: `/dashboard/schools/add`
- Edit School: `/dashboard/schools/[id]`
- List Schools: `/dashboard/schools`

### Form Validation Rules
- School Name: Required, 2-100 characters
- Website: Optional, must start with http:// or https:// if provided
- Contact Email: Optional, must be a valid email if provided
- Social Media URLs: Optional, must start with http:// or https:// if provided (Facebook, Twitter, Instagram, YouTube, TikTok)
- Logo Upload: JPG, PNG, WEBP, GIF, SVG; max 2MB; preview and remove supported
- All fields: Real-time validation and error messages 