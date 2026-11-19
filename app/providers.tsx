'use client';

import { useMemo } from 'react';
import { X402Provider } from 'xpair';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

require('@solana/wallet-adapter-react-ui/styles.css');

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
    'https://api.mainnet-beta.solana.com';

  const config = useMemo(
    () => ({
      network: WalletAdapterNetwork.Mainnet,
      rpcEndpoint: endpoint,
    }),
    [endpoint]
  );

  return (
    <X402Provider config={config} autoConnect={true}>
      {children}
    </X402Provider>
  );
}
