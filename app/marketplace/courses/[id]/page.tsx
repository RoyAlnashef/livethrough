"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Bookmark,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Copy,
  School,
  Shield,
  Trees,
  Clock,
  BookOpen,
} from "lucide-react"
import { Header } from "@/components/header"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useBookmarks } from '@/lib/useBookmarks'
import { useAuth } from '@/lib/auth-context'
import { useAuthModal } from '@/components/course-marketplace/auth-modal-context'
import { SharePopover } from "@/components/share-popover"
import { Input } from "@/components/ui/input"
import LiveThroughFooter from "@/components/LiveThroughFooter"
import { toast } from "sonner"
import { Course } from "@/lib/types"
import { CourseCard } from "@/components/course-marketplace/course-card"
import "@/styles/marketplace-prose.css"

// Add School interface
interface School {
  id: string;
  name: string;
  description: string;
  website?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  location?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
}

export default function CourseDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [course, setCourse] = useState<Course | null>(null)
  const [courseImages, setCourseImages] = useState<string[]>([])
  const [school, setSchool] = useState<School | null>(null)
  const params = useParams<{ id: string }>()
  const { isBookmarked, toggleBookmark, loading: bookmarksLoading } = useBookmarks()
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [similarCourses, setSimilarCourses] = useState<Course[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCourseAndSimilar = async () => {
      if (!params?.id) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*, schools(*)")
          .eq("id", params.id)
          .single()

        if (error) throw error

        const courseData = {
            ...data,
            skills: typeof data.skills === 'string' ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : data.skills || [],
            photo_url: typeof data.photo_url === 'string' && data.photo_url.startsWith('[') ? JSON.parse(data.photo_url) : Array.isArray(data.photo_url) ? data.photo_url : [],
        };
        
        setCourse(courseData);
        setCourseImages(courseData.photo_url);

        if (data.schools) {
            setSchool(data.schools as School);
        }

        // Fetch similar courses
        if (courseData.course_type) {
          const { data: similarData, error: similarError } = await supabase
            .from("courses")
            .select("*")
            .eq("course_type", courseData.course_type)
            .neq("id", courseData.id)
            .limit(8)

          if (similarError) {
            console.error("Error fetching similar courses:", similarError)
          } else {
            setSimilarCourses(similarData as Course[])
          }
        }

      } catch (error) {
        console.error("Failed to load course.", error)
        toast.error('Failed to load course details.')
      } finally {
        setLoading(false)
      }
    }
    fetchCourseAndSimilar()
  }, [params?.id])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % courseImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + courseImages.length) % courseImages.length)
  }

  const numSlides = Math.ceil(similarCourses.length / 2)
  const canScrollLeft = currentSlide > 0
  const canScrollRight = currentSlide < numSlides - 1

  const handleScroll = () => {
    if (sliderRef.current) {
      const newSlideIndex = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth)
      if (newSlideIndex !== currentSlide) {
        setCurrentSlide(newSlideIndex)
      }
    }
  }

  const scrollSliderTo = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.offsetWidth * index,
        behavior: "smooth",
      })
    }
  }

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleBookmark = () => {
    toggleBookmark(params.id)
  }

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white">
        <div>Loading course details...</div>
      </div>
    )
  }

  if (!course || (course.status !== 'Published' && !isAdmin)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white">
        <div>Course not found.</div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen text-zinc-100 bg-topo-overlay">
        <div className="flex-1">
          <div className="container mx-auto p-4 md:p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Course Header */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold">{course.title}</h1>
                    <Badge className="bg-teal-600 text-white text-lg font-bold px-2 py-0.5">${course.price}</Badge>
                  </div>

                  <div className="grid grid-cols-4 w-full">
                    {/* Type */}
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-teal-600" />
                      <div>
                        <div className="text-zinc-400 text-xs">Type</div>
                        <div className="font-medium text-white">{course.course_type || 'N/A'}</div>
                      </div>
                    </div>
                    {/* Difficulty */}
                    <div className="flex items-start gap-2">
                      <Shield className="h-5 w-5 text-teal-600" />
                      <div>
                        <div className="text-zinc-400 text-xs">Difficulty</div>
                        <div className="font-medium text-white">{course.difficulty}</div>
                      </div>
                    </div>
                    {/* Environment */}
                    <div className="flex items-start gap-2">
                      <Trees className="h-5 w-5 text-teal-600" />
                      <div>
                        <div className="text-zinc-400 text-xs">Environment</div>
                        <div className="font-medium text-white">{(course.environment ?? []).length > 0 ? (course.environment ?? []).join(", ") : "None"}</div>
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="flex items-start gap-2">
                      <Clock className="h-5 w-5 text-teal-600" />
                      <div>
                        <div className="text-zinc-400 text-xs">Duration</div>
                        <div className="font-medium text-white">{course.duration ? `${course.duration} days` : 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Carousel */}
                <div className="relative">
                  <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden bg-zinc-900">
                    {courseImages.length > 0 ? (
                        <Image
                            src={courseImages[currentImageIndex]}
                            alt={`Course Image ${currentImageIndex + 1}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🏕️</div>
                          <span className="text-zinc-400 text-sm">No images available</span>
                        </div>
                      </div>
                    )}
                    {courseImages.length > 1 && (
                      <>
                        <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10" onClick={prevImage}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10" onClick={nextImage}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  {courseImages.length > 1 && (
                    <div className="grid grid-cols-5 gap-2 mt-4 flex-wrap">
                      {courseImages.map((image, index) => (
                        <button
                          key={index}
                          className={`relative aspect-[3/2] rounded-md overflow-hidden ${index === currentImageIndex ? "ring-2 ring-teal-500" : "opacity-70 hover:opacity-100"}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image src={image} alt={`Thumbnail ${index + 1}`} layout="fill" objectFit="cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Course Description */}
                <Card className="bg-zinc-950 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-100">Course Description</CardTitle>
                    <Separator className="bg-zinc-800 my-2" />
                    {course.skills && course.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {course.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="text-zinc-300 space-y-4">
                    <div
                      className="prose-marketplace"
                      dangerouslySetInnerHTML={{ __html: course.description || "No description available." }}
                    />
                  </CardContent>
                </Card>

                {/* Similar Courses */}
                {similarCourses.length > 0 && (
                  <div className="space-y-4 pt-8">
                    <h2 className="text-2xl font-bold text-zinc-100">Similar Courses</h2>
                    <div className="relative">
                      <div
                        ref={sliderRef}
                        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-2"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
                        onScroll={handleScroll}
                      >
                        {similarCourses.map((similarCourse) => (
                          <div key={similarCourse.id} className="snap-start flex-shrink-0 w-1/2 px-2">
                            <CourseCard
                              course={{
                                ...similarCourse,
                                isBookmarked: isBookmarked(String(similarCourse.id)),
                              }}
                              onBookmarkToggle={() => toggleBookmark(String(similarCourse.id))}
                            />
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => scrollSlider("left")}
                        disabled={!canScrollLeft}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white z-10 disabled:opacity-30 disabled:cursor-not-allowed"
                        onClick={() => scrollSlider("right")}
                        disabled={!canScrollRight}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex justify-center pt-2 space-x-2">
                      {Array.from({ length: numSlides }).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentSlide ? "bg-teal-500" : "bg-zinc-600 hover:bg-zinc-400"
                          }`}
                          onClick={() => scrollSliderTo(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - CTAs */}
              <div className="space-y-6 sticky top-8 self-start">
                {/* Contact Information */}
                <Card className="bg-zinc-900 border-zinc-800 p-0">
                  <CardContent className="space-y-4 py-6">
                    <div className="flex items-start gap-4 mb-4">
                      {school?.logo_url && !logoError ? (
                        <Image
                          src={school.logo_url}
                          alt={school.name || "School Logo"}
                          width={80}
                          height={80}
                          className="rounded-lg"
                          onError={() => setLogoError(true)}
                        />
                      ) : (
                        <div className="flex items-center justify-center bg-zinc-800 rounded-lg" style={{ width: 80, height: 80 }}>
                          <School className="w-12 h-12 text-zinc-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-zinc-100 mb-2">{school?.name || "School Name"}</h3>
                        <p className="text-zinc-400 text-sm">{school?.description || "No school description available."}</p>
                      </div>
                    </div>
                    <Separator className="bg-zinc-800" />
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-zinc-400" />
                      <span className="text-zinc-300">{school?.contact_phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-zinc-400" />
                      {school?.contact_email ? (
                        <a href={`mailto:${school.contact_email}`} className="text-zinc-300 hover:text-teal-400 transition-colors">{school.contact_email}</a>
                      ) : <span className="text-zinc-300">N/A</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-zinc-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Input
                            value={school?.address || school?.location || "N/A"}
                            readOnly
                            className="bg-zinc-800 border-zinc-700 text-zinc-200 text-sm pr-10"
                            style={{ fontFamily: 'monospace' }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-zinc-400 hover:text-white"
                            onClick={async () => {
                              if (school?.address || school?.location) {
                                await navigator.clipboard.writeText(school?.address || school?.location || "")
                                setCopiedAddress(true)
                                setTimeout(() => setCopiedAddress(false), 1500)
                              }
                            }}
                            aria-label="Copy Address"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {copiedAddress && <span className="text-xs text-teal-400 ml-1">Copied!</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-zinc-400" />
                      {school?.website ? (
                        <Button variant="link" className="p-0 h-auto text-teal-400 hover:text-teal-300" asChild>
                          <a href={school.website} target="_blank" rel="noopener noreferrer">{school.website.replace(/^https?:\/\//, "")}</a>
                        </Button>
                      ) : <span className="text-zinc-300">N/A</span>}
                    </div>
                    <Separator className="bg-zinc-800" />
                    {(school?.facebook_url || school?.twitter_url || school?.instagram_url) && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-400">Follow us:</span>
                        <div className="flex gap-2">
                          {school.facebook_url && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-300" asChild>
                              <a href={school.facebook_url} target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /></a>
                            </Button>
                          )}
                          {school.twitter_url && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-300" asChild>
                              <a href={school.twitter_url} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
                            </Button>
                          )}
                          {school.instagram_url && (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-300" asChild>
                              <a href={school.instagram_url} target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /></a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    <Separator className="bg-zinc-800" />
                    <div className="grid grid-cols-2 gap-4">
                      <SharePopover courseUrl={`https://livethrough.com/courses/${course?.id ?? ""}`} courseTitle={course?.title ?? ""} variant="outline" />
                      <Button
                        variant="default"
                        className="bg-teal-700 hover:bg-teal-600"
                        onClick={() => {
                          if (!isAuthenticated) {
                            openAuthModal('signup')
                            return
                          }
                          handleBookmark()
                        }}
                        disabled={bookmarksLoading}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked(params.id) ? "fill-current" : ""}`} />
                        {isBookmarked(params.id) ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <LiveThroughFooter />
      </div>
    </>
  )
} 