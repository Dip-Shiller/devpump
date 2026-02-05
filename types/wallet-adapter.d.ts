// Type declarations for packages with missing or incompatible types
// This file helps resolve type issues with @solana/wallet-adapter-wallets

declare module '@solana/wallet-adapter-wallets' {
  import { Adapter } from '@solana/wallet-adapter-base'

  export class PhantomWalletAdapter extends Adapter {
    constructor()
  }
  export class SolflareWalletAdapter extends Adapter {
    constructor()
  }
  export class TorusWalletAdapter extends Adapter {
    constructor()
  }
  export class LedgerWalletAdapter extends Adapter {
    constructor()
  }
}
