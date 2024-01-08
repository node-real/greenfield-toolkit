import { SuccessIcon } from '@/base/icons/SuccessIcon';
import { AlertIcon } from '@/base/icons/AlertIcon';
import { BackIcon } from '@/base/icons/BackIcon';
import { CopyIcon } from '@/base/icons/CopyIcon';
import { DownArrowIcon } from '@/base/icons/DownArrowIcon';
import { ErrorIcon } from '@/base/icons/ErrorIcon';
import { ExitIcon } from '@/base/icons/ExitIcon';
import { ForwardIcon } from '@/base/icons/ForwardIcon';
import { InfoIcon } from '@/base/icons/InfoIcon';
import { ObjectIcon } from '@/base/icons/ObjectIcon';
import { ObjectsIcon } from '@/base/icons/ObjectsIcon';
import { RefreshIcon } from '@/base/icons/RefreshIcon';
import { WalletIcon } from '@/base/icons/WalletIcon';
import { CloseIcon } from '@/base/icons/CloseIcon';
import { UploadIcon } from '@/base/icons/UploadIcon';
export const Icons = () => {
  return (
    <>
      <h2>icons</h2>
      <div style={{ display: 'flex' }}>
        <SuccessIcon />
        <AlertIcon />
        <BackIcon />
        <CloseIcon />
        <CopyIcon />
        <DownArrowIcon />
        <ErrorIcon />
        <ExitIcon />
        <ForwardIcon />
        <InfoIcon />
        <ObjectIcon />
        <ObjectsIcon />
        <RefreshIcon />
        <UploadIcon />
        <WalletIcon />
      </div>
    </>
  );
};
