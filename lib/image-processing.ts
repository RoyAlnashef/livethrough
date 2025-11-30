import sharp from 'sharp'

export interface ImageProcessingOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
}

export interface NodeImageLike {
  name: string
  buffer: Buffer
  size: number
  type: string
}

export interface ProcessedImage {
  buffer: Buffer
  fileName: string
  mimeType: string
  size: number
}

const DEFAULT_OPTIONS: Required<ImageProcessingOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 80,
  format: 'webp',
  fit: 'inside'
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB in bytes

function isNodeImageLike(obj: unknown): obj is NodeImageLike {
  return !!obj && typeof obj === 'object' && 'name' in obj && 'buffer' in obj && 'size' in obj && 'type' in obj;
}

export async function processImage(
  file: File | NodeImageLike,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds the maximum allowed size of 10MB`)
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  const opts = { ...DEFAULT_OPTIONS, ...options }
  let buffer: Buffer

  if (isNodeImageLike(file)) {
    buffer = file.buffer
  } else {
    const arrayBuffer = await file.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  }

  console.log(`Processing image: ${file.name}, type: ${file.type}, size: ${buffer.length} bytes`);

  try {
    // Process image with Sharp
    let sharpInstance = sharp(buffer)
      .resize(opts.maxWidth, opts.maxHeight, {
        fit: opts.fit,
        withoutEnlargement: true
      })

    // Convert to specified format
    switch (opts.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: opts.quality })
        break
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: opts.quality })
        break
      case 'png':
        sharpInstance = sharpInstance.png({ quality: opts.quality })
        break
    }

    // Process the image
    const processedBuffer = await sharpInstance.toBuffer()

    // Generate new filename with proper extension
    const originalName = file.name
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
    const newFileName = `${nameWithoutExt}.${opts.format}`

    // Determine MIME type
    const mimeTypes = {
      webp: 'image/webp',
      jpeg: 'image/jpeg',
      png: 'image/png'
    }

    const result = {
      buffer: processedBuffer,
      fileName: newFileName,
      mimeType: mimeTypes[opts.format],
      size: processedBuffer.length
    };

    console.log(`Successfully processed image: ${result.fileName}, MIME type: ${result.mimeType}, size: ${result.size} bytes`);
    return result;

  } catch (error) {
    console.error(`Error processing image ${file.name}:`, error);
    
    // If Sharp processing fails, try to return the original buffer with webp extension
    if (opts.format === 'webp') {
      console.log(`Falling back to original buffer for ${file.name}`);
      const originalName = file.name
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '')
      const newFileName = `${nameWithoutExt}.webp`
      
      return {
        buffer: buffer,
        fileName: newFileName,
        mimeType: 'image/webp',
        size: buffer.length
      };
    }
    
    throw error;
  }
}

export async function processMultipleImages(
  files: (File | NodeImageLike)[],
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage[]> {
  const processedImages: ProcessedImage[] = []
  
  for (const file of files) {
    try {
      const processed = await processImage(file, options)
      processedImages.push(processed)
    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error)
      throw error
    }
  }
  
  return processedImages
} 