import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '@/lib/image-processing';
import { uploadCoursePhoto } from '@/lib/supabase-storage';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Testing webp upload with file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Test processing with different MIME type detection
    const detectedMimeType = file.type || 'image/webp';
    console.log('Detected MIME type:', detectedMimeType);

    try {
      const processed = await processImage({
        name: file.name,
        buffer,
        size: buffer.length,
        type: detectedMimeType,
      }, { format: 'webp' });

      console.log('Processed image:', {
        fileName: processed.fileName,
        mimeType: processed.mimeType,
        size: processed.size
      });

      // Test upload to Supabase
      const publicUrl = await uploadCoursePhoto(
        supabaseAdmin,
        processed.buffer,
        processed.fileName,
        processed.mimeType,
        'test-webp'
      );

      return NextResponse.json({
        success: true,
        originalFile: {
          name: file.name,
          type: file.type,
          size: file.size
        },
        processedFile: {
          fileName: processed.fileName,
          mimeType: processed.mimeType,
          size: processed.size
        },
        publicUrl
      });

    } catch (processingError) {
      console.error('Processing error:', processingError);
      return NextResponse.json({
        error: 'Processing failed',
        details: processingError instanceof Error ? processingError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test webp upload error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 