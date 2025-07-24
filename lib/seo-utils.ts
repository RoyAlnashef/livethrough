import { Course, School } from './types'

// Extended Course type that includes school data
interface CourseWithSchool extends Course {
  schools?: School
}

export function generateCourseDescription(course: CourseWithSchool): string {
  const baseDescription = course.description 
    ? course.description.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
    : `Learn ${course.title} with ${course.schools?.name || 'our expert instructors'}.`

  const details = []
  
  if (course.duration) {
    details.push(`${course.duration} days`)
  }
  
  if (course.difficulty) {
    details.push(`${course.difficulty} level`)
  }
  
  if (course.location) {
    details.push(`in ${course.location}`)
  }
  
  if (course.price) {
    details.push(`Starting at $${course.price}`)
  }

  // Add top 3 skills to description for better SEO
  let skillsText = ''
  if (course.skills && Array.isArray(course.skills) && course.skills.length > 0) {
    const topSkills = course.skills.slice(0, 3).join(', ')
    skillsText = ` Skills include: ${topSkills}.`
  }

  const detailsText = details.length > 0 ? ` ${details.join(' • ')}.` : ''
  
  return baseDescription + detailsText + skillsText
}

export function generateKeywords(course: CourseWithSchool): string[] {
  const keywords: (string | undefined)[] = [
    course.title,
    'survival course',
    'outdoor training',
    course.difficulty?.toLowerCase(),
    course.location,
    course.schools?.name,
  ]

  // Add skills first to ensure they're included
  if (course.skills && Array.isArray(course.skills)) {
    keywords.push(...course.skills)
  }

  if (course.environment && Array.isArray(course.environment)) {
    keywords.push(...course.environment)
  }

  if (course.course_type?.name) {
    keywords.push(course.course_type.name)
  }

  // Filter out undefined/null values and duplicates
  // Increase limit to 20 to accommodate more skills
  return [...new Set(keywords.filter(Boolean))].slice(0, 20) as string[]
}

export function generateStructuredData(course: CourseWithSchool) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description?.replace(/<[^>]*>/g, '') || generateCourseDescription(course),
    "provider": {
      "@type": "Organization",
      "name": course.schools?.name || "LiveThrough",
      "url": course.schools?.website || "https://livethrough.com",
    },
    "offers": {
      "@type": "Offer",
      "price": course.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
    },
    "coursePrerequisites": course.prerequisites,
    "educationalLevel": course.difficulty,
    "timeRequired": course.duration ? `P${course.duration}D` : undefined,
    "location": course.location ? {
      "@type": "Place",
      "name": course.location,
      "geo": course.latitude && course.longitude ? {
        "@type": "GeoCoordinates",
        "latitude": course.latitude,
        "longitude": course.longitude,
      } : undefined,
    } : undefined,
    "image": course.photo_url && course.photo_url.length > 0 ? course.photo_url : undefined,
    "url": `https://livethrough.com/marketplace/courses/${course.id}`,
    // Add skills as keywords for better SEO
    "keywords": course.skills && Array.isArray(course.skills) ? course.skills.join(', ') : undefined,
  }
}

export function generateBreadcrumbData(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem", 
        "position": 1,
        "name": "Courses",
        "item": "https://livethrough.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Course Details",
        "item": `https://livethrough.com/marketplace/courses/${course.id}`
      }
    ]
  }
} 