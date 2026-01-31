
'use client'

import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function WalletButton() {
  useWallet()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-cyan-500 hover:!from-purple-500 hover:!to-cyan-400 !rounded-xl !font-semibold !transition-all" />
  )
}

