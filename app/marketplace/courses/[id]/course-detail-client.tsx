"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Trees,
  Clock,
  BookOpen,
} from "lucide-react"
import { Header } from "@/components/header"
import { useBookmarks } from '@/lib/useBookmarks'
import { useAuth } from '@/lib/auth-context'
import { useAuthModal } from '@/components/course-marketplace/auth-modal-context'
import LiveThroughFooter from "@/components/LiveThroughFooter"
import { Course, School } from "@/lib/types"
import { CourseCard } from "@/components/course-marketplace/course-card"
import "@/styles/marketplace-prose.css"
import { SchoolInfoCard } from "@/components/course-marketplace/school-info-card"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { AdSlot } from "@/components/ads"

interface CourseDetailClientProps {
  course: Course & { schools?: School }
  similarCourses: Course[]
}

export default function CourseDetailClient({ course, similarCourses }: CourseDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { isBookmarked, toggleBookmark, loading: bookmarksLoading } = useBookmarks()
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile();

  const courseImages = course.photo_url || []
  const school = course.schools ? {
    ...course.schools,
    description: course.schools.description || "No description available."
  } : null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % courseImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + courseImages.length) % courseImages.length)
  }

  // Calculate numSlides based on screen size
  const numSlides = isMobile ? similarCourses.length : Math.ceil(similarCourses.length / 2);
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
    if (course.id) {
      toggleBookmark(course.id)
    }
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen text-zinc-100 bg-topo-overlay">
        <div className="flex-1 pt-16 md:pt-0">
          <div className="container mx-auto pt-8 p-4 md:p-8">
            {/* Back to Courses Link */}
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Courses
              </Link>
            </div>
            <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Course Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Course Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-stretch gap-4 mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
                    <Badge className="bg-teal-600 text-white text-md md:text-lg font-bold px-2 py-0.5 ">${course.price}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 w-full">
                    {/* Type */}
                    <div className="flex items-start gap-2 mb-6 md:mb-0">
                      <BookOpen className="h-5 w-5 text-teal-600" />
                      <div>
                        <div className="text-zinc-400 text-xs">Type</div>
                        <div className="font-medium text-white">{course.course_type?.name || 'N/A'}</div>
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
                    <AnimatePresence initial={false} custom={currentImageIndex}>
                      {courseImages.length > 0 ? (
                        <motion.div
                          key={currentImageIndex}
                          className="absolute inset-0 w-full h-full"
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -100, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          drag={typeof window !== 'undefined' && window.innerWidth < 768 ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(e, info) => {
                            if (info.offset.x < -50) nextImage();
                            else if (info.offset.x > 50) prevImage();
                          }}
                          style={{ touchAction: 'pan-y' }}
                        >
                          <Image
                            src={courseImages[currentImageIndex]}
                            alt={`${course.title} - Course Image ${currentImageIndex + 1}`}
                            fill
                            className="object-cover"
                            draggable={false}
                          />
                        </motion.div>
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🏕️</div>
                            <span className="text-zinc-400 text-sm">No images available</span>
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
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
                          <Image src={image} alt={`${course.title} - Thumbnail ${index + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Course Description */}
                <Card className="bg-zinc-950 border-zinc-800 py-8 md:py-10">
                  <CardHeader className="px-4 md:px-6 lg:px-8">
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
                  <CardContent className="text-zinc-300 space-y-4 px-4 md:px-6 lg:px-8">
                    <div
                      className="prose-marketplace"
                      dangerouslySetInnerHTML={{ __html: course.description || "No description available." }}
                    />
                  </CardContent>
                </Card>

                {/* Content Ad Slot */}
                <div className="flex justify-center py-6">
                  <AdSlot
                    slotId="course-content-ad-slot"
                    adUnitPath="/marketplace/courses/content"
                    size="content"
                    enabled={process.env.NODE_ENV === 'production'}
                  />
                </div>

                {/* School Info for md and below */}
                <SchoolInfoCard
                  school={school}
                  logoError={logoError}
                  setLogoError={setLogoError}
                  copiedAddress={copiedAddress}
                  setCopiedAddress={setCopiedAddress}
                  isAuthenticated={isAuthenticated}
                  openAuthModal={openAuthModal}
                  handleBookmark={handleBookmark}
                  bookmarksLoading={bookmarksLoading}
                  isBookmarked={course.id ? isBookmarked(course.id) : false}
                  course={course}
                  variant="mobile"
                />

                {/* School Info Modal Trigger (Mobile Only) */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl z-50 bg-teal-600 hover:bg-teal-700 text-white text-lg h-14 flex items-center justify-center rounded-lg shadow-lg lg:hidden mb-3"
                      size="lg"
                    >
                      Contact this School
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-lg w-full">
                    <DialogTitle className="sr-only">Course Details</DialogTitle>
                    <SchoolInfoCard
                      school={school}
                      logoError={logoError}
                      setLogoError={setLogoError}
                      copiedAddress={copiedAddress}
                      setCopiedAddress={setCopiedAddress}
                      isAuthenticated={isAuthenticated}
                      openAuthModal={openAuthModal}
                      handleBookmark={handleBookmark}
                      bookmarksLoading={bookmarksLoading}
                      isBookmarked={course.id ? isBookmarked(course.id) : false}
                      course={course}
                      variant="mobile"
                    />
                  </DialogContent>
                </Dialog>

                {/* Similar Courses */}
                {similarCourses.length > 0 && (
                  <div className="space-y-4 pt-8">
                    <h2 className="text-2xl font-bold text-zinc-100">Similar Courses</h2>
                    <div className="relative">
                      <div
                        ref={sliderRef}
                        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory w-full"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
                        onScroll={handleScroll}
                      >
                        {similarCourses.map((similarCourse) => (
                          <div key={similarCourse.id} className="snap-start flex-shrink-0 w-full md:w-1/2 max-w-full px-2">
                            <CourseCard
                              course={{
                                ...similarCourse,
                                isBookmarked: similarCourse.id ? isBookmarked(String(similarCourse.id)) : false,
                              }}
                              onBookmarkToggle={() => similarCourse.id && toggleBookmark(String(similarCourse.id))}
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
                {/* School Info for lg and up */}
                <SchoolInfoCard
                  school={school}
                  logoError={logoError}
                  setLogoError={setLogoError}
                  copiedAddress={copiedAddress}
                  setCopiedAddress={setCopiedAddress}
                  isAuthenticated={isAuthenticated}
                  openAuthModal={openAuthModal}
                  handleBookmark={handleBookmark}
                  bookmarksLoading={bookmarksLoading}
                  isBookmarked={course.id ? isBookmarked(course.id) : false}
                  course={course}
                  variant="desktop"
                />

                {/* Sidebar Ad Slot */}
                <AdSlot
                  slotId="course-sidebar-ad-slot"
                  adUnitPath="/marketplace/courses/sidebar"
                  size="sidebar"
                  enabled={process.env.NODE_ENV === 'production'}
                />
              </div>
            </div>
          </div>
        </div>
        <LiveThroughFooter />
      </div>
    </>
  )
} 