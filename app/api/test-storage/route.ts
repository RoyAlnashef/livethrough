import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
    const COURSE_PHOTOS_BUCKET = 'course-photos';
    
    // Test bucket access
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return NextResponse.json({ 
        error: 'Failed to list buckets', 
        details: bucketsError.message 
      }, { status: 500 });
    }

    // Check if course-photos bucket exists
    const coursePhotosBucket = buckets?.find(bucket => bucket.name === COURSE_PHOTOS_BUCKET);
    
    if (!coursePhotosBucket) {
      return NextResponse.json({ 
        error: 'course-photos bucket not found',
        availableBuckets: buckets?.map(b => b.name) || []
      }, { status: 404 });
    }

    // Test bucket permissions by trying to list files
    const { data: files, error: filesError } = await supabaseAdmin.storage
      .from(COURSE_PHOTOS_BUCKET)
      .list('', { limit: 1 });

    if (filesError) {
      console.error('Error listing files:', filesError);
      return NextResponse.json({ 
        error: 'Failed to list files in bucket', 
        details: filesError.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      bucket: {
        name: coursePhotosBucket.name,
        id: coursePhotosBucket.id,
        public: coursePhotosBucket.public,
        fileCount: files?.length || 0
      },
      availableBuckets: buckets?.map(b => ({ name: b.name, public: b.public })) || []
    });

  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 