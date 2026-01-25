'use client'

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Copy, Check, ExternalLink } from 'lucide-react'
import { useState, useCallback } from 'react'
import { useAuth } from '@/providers/wallet-provider'

interface WalletButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function WalletButton({ className, variant = 'default', size = 'default' }: WalletButtonProps) {
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const { user, logout } = useAuth()
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const copyAddress = useCallback(() => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [publicKey])

  const handleConnect = () => {
    setVisible(true)
  }

  const handleDisconnect = () => {
    disconnect()
    logout()
    setShowMenu(false)
  }

  if (!connected || !publicKey) {
    return (
      <Button 
        onClick={handleConnect}
        className={`gap-2 bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white rounded-xl ${className}`}
        variant={variant as any}
        size={size}
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="outline"
        className={`gap-2 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl ${className}`}
        size={size}
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        {user?.username || shortenAddress(publicKey.toBase58())}
      </Button>

      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#111113] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <div className="text-sm text-zinc-400 mb-1">Connected Wallet</div>
              <div className="font-mono text-sm truncate">{publicKey.toBase58()}</div>
            </div>
            
            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Address'}</span>
              </button>
              
              <a
                href={`https://explorer.solana.com/address/${publicKey.toBase58()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Explorer</span>
              </a>
              
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

