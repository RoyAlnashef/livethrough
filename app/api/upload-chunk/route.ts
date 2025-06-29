import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { processImage } from '@/lib/image-processing';
import { uploadCoursePhoto } from '@/lib/supabase-storage';
import { supabaseAdmin } from '@/lib/supabase-admin';

// POST /api/upload-chunk
export async function POST(req: NextRequest) {
  try {
    // Parse metadata from query or headers
    const fileId = req.headers.get('x-file-id');
    const chunkIndex = req.headers.get('x-chunk-index');
    const totalChunks = req.headers.get('x-total-chunks');
    const originalName = req.headers.get('x-original-name');
    const courseId = req.headers.get('x-course-id'); // for upload path

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
      const processed = await processImage({
        name: originalName,
        buffer: fileBuffer,
        size: fileBuffer.length,
        type: 'image/*',
      }, { format: 'webp' });

      // Upload to Supabase Storage using Buffer and service role
      publicUrl = await uploadCoursePhoto(
        supabaseAdmin,
        processed.buffer,
        processed.fileName,
        processed.mimeType,
        courseId
      );

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 