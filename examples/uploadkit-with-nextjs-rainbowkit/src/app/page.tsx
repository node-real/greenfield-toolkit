'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { UploadKitButton } from '@node-real/greenfield-uploadkit';

export default function Home() {
  return (
    <main
      style={{
        padding: 16,
        minHeight: '100vh',
      }}
    >
      <ConnectButton />
      <div style={{ height: 16 }}></div>
      <UploadKitButton />
    </main>
  );
}
