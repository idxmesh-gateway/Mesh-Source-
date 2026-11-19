'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { X402Provider } from 'xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  const network = WalletAdapterNetwork.Mainnet;

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <X402Provider config={{ network, rpcEndpoint: endpoint }}>
            {children}
          </X402Provider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
