'use client'

import { useEffect, useState } from 'react';
import { useBookmarks } from '@/lib/useBookmarks';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { CourseCard } from '@/components/course-marketplace/course-card';
import type { Course } from '@/lib/types';
import Link from 'next/link'

export default function MyCourses() {
  const { bookmarkedCourseIds, loading: bookmarksLoading, toggleBookmark, isBookmarked } = useBookmarks();
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated || bookmarkedCourseIds.size === 0) {
        setCourses([]);
        return;
      }
      setLoading(true);
      const ids = Array.from(bookmarkedCourseIds);
      const { data, error } = await supabase
        .from('courses')
        .select('id, photo_url, title, price, location, difficulty, environment, duration')
        .in('id', ids);
      if (!error && data) {
        setCourses(data);
      } else {
        setCourses([]);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [bookmarkedCourseIds, isAuthenticated]);

  // Add handler for toggling bookmarks
  const handleBookmarkToggle = (courseId: string) => {
    toggleBookmark(courseId.toString());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">My Courses</h1>
      {bookmarksLoading || loading ? (
        <div className="text-zinc-400">Loading your bookmarked courses...</div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 text-zinc-400 mt-8">
          <span>You have no bookmarked courses yet.</span>
          <Link
            href="/"
            className="inline-block px-5 py-2 rounded bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.filter(course => course.id).map(course => (
            <CourseCard
              key={course.id}
              course={{ ...course, isBookmarked: isBookmarked(course.id!.toString()) }}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
} 