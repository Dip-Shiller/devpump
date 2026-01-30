'use client'

import { FC, ReactNode, useMemo, createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack'
import { clusterApiUrl } from '@solana/web3.js'
import { WalletError } from '@solana/wallet-adapter-base'

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

// Auth context
interface AuthContextType {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (walletAddress: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {}
})

export const useAuth = () => useContext(AuthContext)

// Auth Provider Component
const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const wallet = useWallet()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = localStorage.getItem('devpump_user')
        if (stored) {
          setUser(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  // Handle wallet connection
  useEffect(() => {
    if (wallet.connected && wallet.publicKey && !user) {
      login(wallet.publicKey.toBase58())
    }
  }, [wallet.connected, wallet.publicKey])

  // Handle wallet disconnection
  useEffect(() => {
    if (!wallet.connected && user?.walletAddress) {
      // Only logout if was authenticated via wallet
      logout()
    }
  }, [wallet.connected])

  const login = async (walletAddress: string) => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login-wallet',
          walletAddress
        })
      })

      const data = await response.json()
      
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('devpump_user', JSON.stringify(data.user))
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('devpump_user')
    if (wallet.connected) {
      wallet.disconnect()
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Main Wallet Provider
interface Props {
  children: ReactNode
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as any
  const endpoint = useMemo(() => 
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network), 
    [network]
  )

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter()
    ],
    []
  )

  // Handle wallet errors gracefully
  const onError = useCallback((error: WalletError) => {
    // Ignore user rejection errors - these are expected
    if (error.name === 'WalletConnectionError' && 
        error.message.includes('User rejected')) {
      return
    }
    console.error('Wallet error:', error)
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider
