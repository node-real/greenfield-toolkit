import { ModalBody } from '@/base/components/Modal/ModalBody';
import { Navbar } from '@/components/Navbar';
import { UploadList } from '@/components/UploadList';

export function UploadPage() {
  return (
    <>
      <Navbar>Upload Objects</Navbar>
      <ModalBody>
        <UploadList />
      </ModalBody>
    </>
  );
}
