'use client';
import { WalletKitButton } from '@totejs/walletkit';
import { UploadKitButton } from '@node-real/greenfield-uploadkit';
import { chainList } from './chains';
import { WagmiConfig, createConfig } from 'wagmi';
import {
  SwitchNetworkModal,
  WalletKitOptions,
  WalletKitProvider,
  getDefaultConfig,
} from '@totejs/walletkit';
import { trustWallet, metaMask, walletConnect } from '@totejs/walletkit/wallets';
import { UploadKitOptions, UploadKitProvider } from '@node-real/greenfield-uploadkit';
import { client } from './client';

import '@node-real/greenfield-uploadkit/styles.css';
import '@totejs/walletkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'WalletKit',

    /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
    walletConnectProjectId: '22d482af814af0b8d5ba3d394a28c5fc',

    chains: chainList,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600,
};

const uploadOptions: UploadKitOptions = {
  client: client,
  visibility: 'VISIBILITY_TYPE_PRIVATE',
};
export default function Home() {
  return (
    <main
      style={{
        padding: 16,
        minHeight: '100vh',
      }}
    >
      <WagmiConfig config={config}>
        <WalletKitProvider options={options} mode="light">
          <UploadKitProvider options={uploadOptions} mode="light">
            <WalletKitButton />
            <div style={{ height: 16 }}></div>
            <UploadKitButton />
            <SwitchNetworkModal />
          </UploadKitProvider>
        </WalletKitProvider>
      </WagmiConfig>
    </main>
  );
}
