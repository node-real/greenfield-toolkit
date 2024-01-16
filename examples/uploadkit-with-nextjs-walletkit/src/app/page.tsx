'use client';
import { WalletKitButton } from '@totejs/walletkit';
import { UploadKitButton } from '@node-real/greenfield-uploadkit';

import '@node-real/greenfield-uploadkit/styles.css';
import '@totejs/walletkit/styles.css';

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
