import { useState } from 'react';
import { UploadKitButton } from '@/components/UploadKitButton';
import { UploadKitProvider } from '@/components/UploadKitProvider';
import { UploadKitOptions } from '@/components/UploadKitProvider/context';

import { WagmiConfig, createConfig } from 'wagmi';
import {
  SwitchNetworkModal,
  WalletKitButton,
  WalletKitOptions,
  WalletKitProvider,
  getDefaultConfig,
} from '@totejs/walletkit';
import { trustWallet, metaMask, walletConnect } from '@totejs/walletkit/wallets';
import { chains } from './chains';
import '@totejs/walletkit/styles.css';
import { client } from './client';
import ProgressBarExample from './components/ProgressExample';
import { Icons } from './components/Icons';
import { Link } from '@/base/components/Link';
import { ReedSolomon } from '@bnb-chain/reed-solomon';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'WalletKit',

    // WalletConnect 2.0 requires a projectId which you can create quickly
    // and easily for free over at WalletConnect Cloud https://cloud.walletconnect.com/sign-in
    walletConnectProjectId: 'e68a1816d39726c2afabf05661a32767',

    chains,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600,
};

const uploadOptions: UploadKitOptions = {
  client: client,
  bucketName: 'test-upload-kit',
  seedString:
    '0xa25fa0de5d5e82b84826a0bce8c84a1bf1b0c8786c586ec696dc52300a9ffe007bb7e10d9901a32b67ed06fdef1d296f6d6fa00fdd33deaeadbd2363fe87708d1c',
  checksumFn: async (data: Uint8Array) => {
    const rs = new ReedSolomon();
    return rs.encode(data);
  },
  sp: {
    operatorAddress: '0x89A1CC91B642DECbC4789474694C606E0E0c420b',
    endpoint: 'https://gnfd-testnet-sp1.bnbchain.org',
  },
  visibility: 'VISIBILITY_TYPE_PRIVATE',
  // onError: console.log,
};

export default function App() {
  const [mode, setMode] = useState<any>('light');
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <WagmiConfig config={config}>
      <div>mode: {mode} </div>
      <button onClick={() => setMode(nextMode)}>switch to {nextMode}</button>
      <div style={{ height: 20 }} />
      <WalletKitProvider options={options} mode="light">
        <UploadKitProvider options={uploadOptions} mode={mode} debugMode={true}>
          <WalletKitButton />
          <SwitchNetworkModal />
          <div style={{ height: 16 }}></div>
          <UploadKitButton />
          <Example />
        </UploadKitProvider>
      </WalletKitProvider>
      <div style={{ height: 2000 }}></div>
    </WagmiConfig>
  );
}

function Example() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ProgressBarExample />
      <Icons />
      <Link>Link component</Link>
    </div>
  );
}
