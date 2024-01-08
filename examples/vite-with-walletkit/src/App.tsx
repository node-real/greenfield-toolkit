import '@totejs/walletkit/styles.css';
import { WagmiConfig, createConfig } from 'wagmi';
import { chains } from './chains';
import {
  WalletKitButton,
  WalletKitProvider,
  getDefaultConfig,
  WalletKitOptions,
  SwitchNetworkModal,
} from '@totejs/walletkit';
import { trustWallet, metaMask, walletConnect } from '@totejs/walletkit/wallets';
import {
  UploadKitButton,
  UploadKitOptions,
  UploadKitProvider,
} from '@node-real/greenfield-uploadkit';
import { client } from './client';
import '@node-real/greenfield-uploadkit/styles.css';
import '@totejs/walletkit/styles.css';

const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'WalletKit',

    /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
    walletConnectProjectId: '22d482af814af0b8d5ba3d394a28c5fc',

    chains,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

const options: WalletKitOptions = {
  initialChainId: 5600,
};

const uploadOptions: UploadKitOptions = {
  client: client,
  visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
};

export default function App() {
  return (
    <WagmiConfig config={config}>
      <WalletKitProvider options={options} mode="light">
        <UploadKitProvider options={uploadOptions} mode="light">
          <WalletKitButton />
          <div style={{ height: 16 }}></div>
          <UploadKitButton />
          {/*
          👇 Here's the SwitchNetworkModal
            If the user switches to a network that is not supported by our dapp,
            this modal will be displayed to remind the user to switch to our supported networks.
          */}
          <SwitchNetworkModal />
        </UploadKitProvider>
      </WalletKitProvider>
    </WagmiConfig>
  );
}
