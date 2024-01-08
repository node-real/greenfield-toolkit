import Head from 'next/head';
import type { AppProps } from 'next/app';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  UploadKitButton,
  UploadKitOptions,
  UploadKitProvider,
} from '@node-real/greenfield-uploadkit';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import { publicProvider } from 'wagmi/providers/public';
import { chains } from './chains';
import { client } from './client';

import '@/styles/globals.css';
import '@node-real/greenfield-uploadkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

const { chains: configChains, publicClient } = configureChains(chains, [publicProvider()]);

const { wallets } = getDefaultWallets({
  /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
  projectId: '22d482af814af0b8d5ba3d394a28c5fc',
  appName: 'greenfield js sdk demo',
  chains: configChains,
});

const connectors = connectorsForWallets([...wallets]);

const wagmiConfig = createConfig({
  // autoConnect: true,
  connectors,
  publicClient,
});

const uploadOptions: UploadKitOptions = {
  client: client,
  sp: {
    operatorAddress: '0x89A1CC91B642DECbC4789474694C606E0E0c420b',
    endpoint: 'https://gnfd-testnet-sp1.bnbchain.org',
  },
  visibility: 'VISIBILITY_TYPE_PRIVATE',
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>UploadKit Next.js with rainbowkit Example</title>
      </Head>
      <WagmiConfig config={wagmiConfig}>
        {/* TODO  */}
        <RainbowKitProvider chains={configChains} initialChain={5600}>
          <UploadKitProvider options={uploadOptions} mode="light">
            <ConnectButton accountStatus="address" />
            <div style={{ height: 16 }}></div>
            <UploadKitButton />
            <Component {...pageProps} />
          </UploadKitProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
