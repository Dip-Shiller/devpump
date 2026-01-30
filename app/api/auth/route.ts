import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, walletAddress, username, email, password } = body

    switch (action) {
      case 'login-wallet':
      case 'signup-wallet': {
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address required' }, { status: 400 })
        }

        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single()

        if (existingUser) {
          return NextResponse.json({ user: existingUser })
        }

        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            wallet_address: walletAddress,
            username: username || `user_${walletAddress.slice(0, 8)}`,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error('Insert error:', insertError)
          return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        }

        return NextResponse.json({ user: newUser })
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
