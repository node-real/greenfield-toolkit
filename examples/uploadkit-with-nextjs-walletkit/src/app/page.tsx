'use client';
import { WalletKitButton } from '@node-real/walletkit';
import { UploadKitButton } from '@node-real/greenfield-uploadkit';

import '@node-real/greenfield-uploadkit/styles.css';
import '@node-real/walletkit/styles.css';

export default function Home() {
  return (
    <main
      style={{
        padding: 16,
        minHeight: '100vh',
      }}
    >
      <WalletKitButton />
      <div style={{ height: 16 }}></div>
      <UploadKitButton />
    </main>
  );
}
