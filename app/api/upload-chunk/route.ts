import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { processImage } from '@/lib/image-processing';
import { uploadCoursePhoto } from '@/lib/supabase-storage';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Helper function to detect MIME type from file extension
function getMimeTypeFromFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'image/*';
}

// POST /api/upload-chunk
export async function POST(req: NextRequest) {
  try {
    // Parse metadata from query or headers
    const fileId = req.headers.get('x-file-id');
    const chunkIndex = req.headers.get('x-chunk-index');
    const totalChunks = req.headers.get('x-total-chunks');
    const originalName = req.headers.get('x-original-name');
    const courseId = req.headers.get('x-course-id'); // for upload path
    const fileType = req.headers.get('x-file-type'); // Get file type from headers

    if (!fileId || !chunkIndex || !totalChunks || !originalName || !courseId) {
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }

    // Read chunk data
    const arrayBuffer = await req.arrayBuffer();
    const chunk = Buffer.from(arrayBuffer);

    // Store chunk in /tmp (or another temp dir)
    const tempDir = path.join('/tmp', 'upload_chunks', fileId);
    await fs.mkdir(tempDir, { recursive: true });
    const chunkPath = path.join(tempDir, `${chunkIndex}.part`);
    await fs.writeFile(chunkPath, chunk);

    // Check if all chunks are present
    const files = await fs.readdir(tempDir);
    const receivedChunks = files.filter(f => f.endsWith('.part')).length;
    const isComplete = receivedChunks === Number(totalChunks);

    let publicUrl = null;
    if (isComplete) {
      const assembledPath = path.join(tempDir, originalName);
      const writeStream = await fs.open(assembledPath, 'w');
      for (let i = 0; i < Number(totalChunks); i++) {
        const partPath = path.join(tempDir, `${i}.part`);
        const part = await fs.readFile(partPath);
        await writeStream.write(part);
      }
      await writeStream.close();

      // Process the assembled file with sharp (WebP conversion)
      const fileBuffer = await fs.readFile(assembledPath);
      
      // Use file type from headers if available, otherwise detect from filename
      const detectedMimeType = fileType || getMimeTypeFromFileName(originalName);
      console.log(`Processing file: ${originalName}, detected MIME type: ${detectedMimeType}`);
      
      try {
        const processed = await processImage({
          name: originalName,
          buffer: fileBuffer,
          size: fileBuffer.length,
          type: detectedMimeType,
        }, { format: 'webp' });

        console.log(`Processed image: ${processed.fileName}, MIME type: ${processed.mimeType}, size: ${processed.size} bytes`);

        // Upload to Supabase Storage using Buffer and service role
        publicUrl = await uploadCoursePhoto(
          supabaseAdmin,
          processed.buffer,
          processed.fileName,
          processed.mimeType,
          courseId
        );

        console.log(`Uploaded to Supabase: ${publicUrl}`);
      } catch (processingError) {
        console.error('Error processing image:', processingError);
        throw new Error(`Image processing failed: ${processingError instanceof Error ? processingError.message : 'Unknown error'}`);
      }

      // Clean up temp files
      for (let i = 0; i < Number(totalChunks); i++) {
        const partPath = path.join(tempDir, `${i}.part`);
        await fs.unlink(partPath);
      }
      await fs.unlink(assembledPath);
      await fs.rmdir(tempDir);
    }

    // Respond with status
    return NextResponse.json({
      status: isComplete ? 'file_complete' : 'chunk_received',
      fileId,
      chunkIndex: Number(chunkIndex),
      totalChunks: Number(totalChunks),
      originalName,
      ...(isComplete ? { assembled: true, publicUrl } : {}),
    });
  } catch (error) {
    console.error('Chunk upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 