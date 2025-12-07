import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { processImage } from '@/lib/image-processing'
import { uploadCoursePhoto } from '@/lib/supabase-storage'
import { supabaseAdmin } from '@/lib/supabase-admin'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid URL' }, { status: 400 })
    }
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Fetch the page HTML
    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch the page' }, { status: 400 })
    }
    const html = await res.text()

    // Parse with Cheerio
    const $ = cheerio.load(html)

    // Try to extract common fields
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
    // Try to find images (og:image or first <img>)
    const ogImage = $('meta[property="og:image"]').attr('content')
    const images = ogImage ? [ogImage] : []
    $('img').each((_, el) => {
      const src = $(el).attr('src')
      if (src && !images.includes(src) && images.length < 5) images.push(src)
    })

    // Download, convert, and upload images
    const uploadedUrls: string[] = []
    for (const imgUrl of images) {
      try {
        // Resolve relative URLs
        const absoluteUrl = imgUrl.startsWith('http') ? imgUrl : new URL(imgUrl, url).href
        const imgRes = await fetch(absoluteUrl)
        if (!imgRes.ok) continue
        const arrayBuffer = await imgRes.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        // Guess file extension
        const ext = path.extname(absoluteUrl).split('?')[0] || '.jpg'
        // Guess mime type
        const mimeType = imgRes.headers.get('content-type') || 'image/jpeg'
        // Use processImage to convert to webp
        const processed = await processImage({
          name: `imported${ext}`,
          buffer,
          size: buffer.length,
          type: mimeType,
        })
        // Upload to Supabase Storage (use 'imports' as courseId/folder)
        const publicUrl = await uploadCoursePhoto(
          supabaseAdmin,
          processed.buffer,
          processed.fileName,
          processed.mimeType,
          'imports'
        )
        uploadedUrls.push(publicUrl)
      } catch (err) {
        // Skip failed images
        console.error('Failed to process/upload image:', imgUrl, err)
      }
    }

    return NextResponse.json({
      title,
      description,
      price: 0, // Not extracted yet
      duration: 0, // Not extracted yet
      difficulty: '', // Not extracted yet
      location: '', // Not extracted yet
      course_type: '', // Not extracted yet
      photo_url: uploadedUrls
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error', details: (err as Error).message }, { status: 500 })
  }
} 