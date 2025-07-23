import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import Link from 'next/link';

export function useBookmarks() {
  const { user, isAuthenticated } = useAuth();
  const [bookmarkedCourseIds, setBookmarkedCourseIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch bookmarks for the authenticated user
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setBookmarkedCourseIds(new Set());
      return;
    }
    setLoading(true);
    supabase
      .from('bookmarks')
      .select('course_id')
      .eq('user_id', user.id)
      .then(({ data, error }) => {
        if (error) {
          setBookmarkedCourseIds(new Set());
        } else {
          setBookmarkedCourseIds(new Set(data.map((b: { course_id: string }) => b.course_id)));
        }
        setLoading(false);
      });
  }, [isAuthenticated, user]);

  // Toggle bookmark for a course
  const toggleBookmark = useCallback(
    async (courseId: string) => {
      if (!isAuthenticated || !user) return;
      const isBookmarked = bookmarkedCourseIds.has(courseId);
      setLoading(true);
      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', courseId);
        if (!error) {
          setBookmarkedCourseIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(courseId);
            return newSet;
          });
          toast.success(
            <span>
              Course removed from <Link href="/account/courses" className="text-teal-600 underline hover:text-teal-500 transition-colors">My Courses</Link>
            </span>
          );
        } else {
          toast.error('Failed to remove bookmark');
        }
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert([{ user_id: user.id, course_id: courseId }]);
        if (!error) {
          setBookmarkedCourseIds(prev => new Set(prev).add(courseId));
          toast.success(
            <span>
              Course saved to <Link href="/account/courses" className="text-teal-600 underline hover:text-teal-500 transition-colors">My Courses</Link>
            </span>
          );
        } else {
          toast.error('Failed to add bookmark');
        }
      }
      setLoading(false);
    },
    [isAuthenticated, user, bookmarkedCourseIds]
  );

  // Check if a course is bookmarked
  const isBookmarked = useCallback(
    (courseId: string) => bookmarkedCourseIds.has(courseId),
    [bookmarkedCourseIds]
  );

  return {
    bookmarkedCourseIds,
    isBookmarked,
    toggleBookmark,
    loading,
  };
} 