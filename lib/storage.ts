import { createServerClient } from './supabase'

// Allowed file types for image uploads
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
]

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Upload types and their corresponding buckets
export type UploadType = 'avatar' | 'cover' | 'post' | 'team' | 'project' | 'comment'

export const BUCKET_MAP: Record<UploadType, string> = {
  avatar: 'profile-photos',
  cover: 'profile-photos',
  post: 'post-attachments',
  team: 'team-photos',
  project: 'project-photos',
  comment: 'comment-attachments'
}

export interface UploadResult {
  url: string | null
  error: string | null
}

/**
 * Validates a file for upload
 */
export function validateFile(file: File): { valid: boolean; error: string | null } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: JPG, PNG, GIF, WEBP`
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is 5MB`
    }
  }

  return { valid: true, error: null }
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType?: string
): Promise<UploadResult> {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType || (file instanceof File ? file.type : 'image/jpeg')
      })

    if (error) {
      console.error('Storage upload error:', error)
      return { url: null, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return { url: urlData.publicUrl, error: null }
  } catch (err) {
    console.error('Upload error:', err)
    return { url: null, error: 'Failed to upload file' }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = createServerClient()

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('Storage delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    console.error('Delete error:', err)
    return { success: false, error: 'Failed to delete file' }
  }
}

/**
 * Generate a unique file path for uploads
 */
export function generateFilePath(
  ownerId: string,
  type: UploadType,
  filename: string
): string {
  const timestamp = Date.now()
  const ext = filename.split('.').pop() || 'jpg'
  return `${ownerId}/${type}/${timestamp}.${ext}`
}

/**
 * Get the appropriate bucket for an upload type
 */
export function getBucketForType(type: UploadType): string {
  return BUCKET_MAP[type] || 'profile-photos'
}
