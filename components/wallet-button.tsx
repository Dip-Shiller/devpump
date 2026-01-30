'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Button } from '@/components/ui/button'

export function WalletButton() {
  const { connected, publicKey } = useWallet()

  return (
    <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-cyan-500 hover:!from-purple-500 hover:!to-cyan-400 !rounded-xl !font-semibold !transition-all" />
  )
}

