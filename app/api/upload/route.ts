import { NextRequest, NextResponse } from 'next/server'
import { uploadFile, validateFile, generateFilePath, getBucketForType, UploadType, BUCKET_MAP } from '@/lib/storage'

const VALID_TYPES = Object.keys(BUCKET_MAP) as UploadType[]

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const type = formData.get('type') as string | null
    const ownerId = formData.get('ownerId') as string | null
    // Support legacy 'userId' field for backwards compatibility
    const userId = formData.get('userId') as string | null
    const effectiveOwnerId = ownerId || userId

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!effectiveOwnerId) {
      return NextResponse.json(
        { error: 'Owner ID is required (use ownerId or userId field)' },
        { status: 400 }
      )
    }

    if (!type || !VALID_TYPES.includes(type as UploadType)) {
      return NextResponse.json(
        { error: `Invalid upload type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Get bucket and generate file path
    const uploadType = type as UploadType
    const bucket = getBucketForType(uploadType)
    const path = generateFilePath(effectiveOwnerId, uploadType, file.name)

    // Upload to Supabase Storage
    const result = await uploadFile(bucket, path, file)

    if (result.error || !result.url) {
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      path: path,
      bucket: bucket,
      type: uploadType
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
