'use client'

import { FC, ReactNode, useMemo, createContext, useContext, useState, useEffect } from 'react'
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

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
  const [hasInitialized, setHasInitialized] = useState(false)
  const wallet = useWallet()

  // Check for existing session on mount - runs once
  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = localStorage.getItem('devpump_user')
        if (stored) {
          const parsedUser = JSON.parse(stored)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Session check error:', error)
        localStorage.removeItem('devpump_user')
      } finally {
        setIsLoading(false)
        setHasInitialized(true)
      }
    }
    checkSession()
  }, [])

  // Handle wallet connection - only runs after initialization
  useEffect(() => {
    if (!hasInitialized || isLoading) return
    if (wallet.connected && wallet.publicKey && !user) {
      login(wallet.publicKey.toBase58())
    }
  }, [hasInitialized, wallet.connected, wallet.publicKey, user, isLoading])

  // Handle wallet disconnection - only if user was wallet-authenticated
  useEffect(() => {
    if (!hasInitialized) return
    if (!wallet.connected && user?.wallet_address) {
      logout()
    }
  }, [hasInitialized, wallet.connected, user?.wallet_address])

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
      new TorusWalletAdapter(),
      new LedgerWalletAdapter()
    ] as any[],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
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
