import { ModalBody } from '@/base/components/Modal/ModalBody';
import { ModalFooter } from '@/base/components/Modal/ModalFooter';
import { UploadButton } from '@/components/UploadButton';
import { Navbar } from '@/components/Navbar';
import { WaitList } from '@/components/WaitList';
import { TotalFee } from '@/components/TotalFee';
import { useUpload } from '@/components/UploadProvider';
import { DragArea } from '@/components/DragArea';

export function WaitPage() {
  const {
    state: { waitQueue },
  } = useUpload();
  const hasWaitQueue = waitQueue && waitQueue.length > 0;
  return (
    <>
      <Navbar>Upload Objects</Navbar>
      {hasWaitQueue && <DragArea />}
      <ModalBody>
        {!hasWaitQueue && <DragArea />}
        <WaitList />
      </ModalBody>
      <ModalFooter>
        <TotalFee />
        <UploadButton />
      </ModalFooter>
    </>
  );
}
