import { NextRequest, NextResponse } from 'next/server'
import { uploadProfilePhoto, getProfilePhotos, setPrimaryProfilePhoto, deleteProfilePhoto } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const photos = await getProfilePhotos(userId)
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Error fetching profile photos:', error)
    return NextResponse.json({ error: 'Failed to fetch profile photos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, userId, photoUrl, altText, photoId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    if (action === 'upload') {
      if (!photoUrl) {
        return NextResponse.json({ error: 'Photo URL required' }, { status: 400 })
      }
      const photo = await uploadProfilePhoto(userId, photoUrl, altText)
      return NextResponse.json({ photo, success: true })
    } else if (action === 'setPrimary') {
      if (!photoId) {
        return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
      }
      const photo = await setPrimaryProfilePhoto(photoId, userId)
      return NextResponse.json({ photo, success: true })
    } else if (action === 'delete') {
      if (!photoId) {
        return NextResponse.json({ error: 'Photo ID required' }, { status: 400 })
      }
      const success = await deleteProfilePhoto(photoId)
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error processing profile photo:', error)
    return NextResponse.json({ error: 'Failed to process profile photo' }, { status: 500 })
  }
}
