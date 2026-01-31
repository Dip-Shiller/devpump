import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserByWallet, createUser } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { wallet_address } = await request.json()
    
    if (!wallet_address) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
    }

    let user = await getUserByWallet(wallet_address)
    
    if (!user) {
      user = await createUser({
        wallet_address,
        username: `user_${wallet_address.slice(0, 8)}`,
      })
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const { password_hash, ...safeUser } = user

    const cookieStore = await cookies()
    cookieStore.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ user: safeUser, success: true })
  } catch (error) {
    console.error('Wallet auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}
