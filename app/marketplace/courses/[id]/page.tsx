import { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchCourseServer, fetchSimilarCoursesServer } from "@/lib/supabase-server"
import { generateCourseDescription, generateKeywords, generateStructuredData, generateBreadcrumbData } from "@/lib/seo-utils"
import CourseDetailClient from "./course-detail-client"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const course = await fetchCourseServer(id)
    
    if (!course || course.status !== 'Published') {
      return {
        title: 'Course Not Found | LiveThrough',
        description: 'The course you are looking for does not exist.',
      }
    }

    const description = generateCourseDescription(course)
    const keywords = generateKeywords(course)

    return {
      title: `${course.title} - ${course.schools?.name || 'Survival Course'} | LiveThrough`,
      description,
      keywords: keywords.join(', '),
      openGraph: {
        title: course.title,
        description,
        images: course.photo_url && course.photo_url.length > 0 ? course.photo_url : [],
        type: 'website',
        url: `https://livethrough.com/marketplace/courses/${course.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: course.title,
        description,
        images: course.photo_url && course.photo_url.length > 0 ? course.photo_url[0] : undefined,
      },
      alternates: {
        canonical: `https://livethrough.com/marketplace/courses/${id}`,
      },
    }
  } catch {
    return {
      title: 'Course Not Found | LiveThrough',
      description: 'The course you are looking for does not exist.',
    }
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  try {
    const { id } = await params
    const course = await fetchCourseServer(id)
    
    if (!course || course.status !== 'Published') {
      notFound()
    }

    // Fetch similar courses
    let similarCourses = []
    if (course.course_type?.id) {
      similarCourses = await fetchSimilarCoursesServer(course.course_type.id, id)
    }

    // Generate structured data
    const structuredData = generateStructuredData(course)
    const breadcrumbData = generateBreadcrumbData(course)

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
        <CourseDetailClient 
          course={course} 
          similarCourses={similarCourses}
        />
      </>
    )
  } catch {
    notFound()
  }
} 