'use client'

import { 
  Connection, 
  PublicKey, 
  Transaction,
  clusterApiUrl,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'

// Solana Network Configuration
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK as any)

// Initialize Solana Connection
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

// Wallet Adapter Types
export interface WalletAdapter {
  publicKey: PublicKey | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  signTransaction: (transaction: Transaction) => Promise<Transaction>
}

// Get SOL Balance
export async function getBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error('Error fetching balance:', error)
    return 0
  }
}

// Verify wallet ownership by signing a message
export async function verifyWalletOwnership(
  wallet: WalletAdapter,
  message: string
): Promise<{ signature: string; publicKey: string } | null> {
  try {
    if (!wallet.publicKey) return null
    
    const encodedMessage = new TextEncoder().encode(message)
    const signature = await wallet.signMessage(encodedMessage)
    
    return {
      signature: Buffer.from(signature).toString('base64'),
      publicKey: wallet.publicKey.toBase58()
    }
  } catch (error) {
    console.error('Error signing message:', error)
    return null
  }
}

// Shorten wallet address for display
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

// Validate Solana address
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}
