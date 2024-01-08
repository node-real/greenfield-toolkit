import { Box } from '@/base/components/Box';
import { CloseIcon } from '@/base/icons/CloseIcon';
import { UploadIcon } from '@/base/icons/UploadIcon';
import { SuccessIcon } from '@/base/icons/SuccessIcon';
import { AlertIcon } from '@/base/icons/AlertIcon';
import { cx } from '@/base/utils/css';
import {
  clsTaskManagementButton,
  clsTaskManagementButtonContent,
  clsTaskManagementButtonText,
} from './style.css';
import { IconButton } from '@/base/components/IconButton';
import { useUploadQueueStatus } from '@/hooks/useUploadQueueStatus';
import { useRouter } from '../RouteProvider/context';
import { routes } from '../RouteProvider';
import { useModal } from '../ModalProvider/context';
import { useUpload } from '../UploadProvider';
import { useUploadKitContext } from '../UploadKitProvider/context';

export function TaskManagementButton() {
  const { onOpen } = useModal();
  const router = useRouter();
  const {
    options: { taskManagementButton },
  } = useUploadKitContext();
  const {
    state: { taskManagement },
    dispatch,
  } = useUpload();

  const status = useUploadQueueStatus();

  const onButtonClick = () => {
    router.push(routes.UPLOAD);
    onOpen();
  };

  const onTaskManagementClose = () => {
    dispatch({
      type: 'SET_TASK_MANAGEMENT_DISPLAY',
      payload: false,
    });
  };

  if (!taskManagement || !taskManagementButton) return null;

  return (
    <Box className={cx('uk-task-management-button', clsTaskManagementButton)}>
      <Box
        onClick={onButtonClick}
        className={cx('uk-task-management-button-content', clsTaskManagementButtonContent)}
      >
        {status === 1 && <UploadIcon />}
        {status === 2 && <SuccessIcon />}
        {status === 3 && <AlertIcon color="#D9304E" />}
        <Box className={cx('uk-task-management-button-text', clsTaskManagementButtonText)}>
          {status === 0 && 'Waiting...'}
          {status === 1 && 'Uploading...'}
          {status === 2 && 'Upload Complete'}
          {status === 3 && 'Upload Error'}
        </Box>
      </Box>
      <IconButton
        className="uk-task-management-button-close-button"
        icon={<CloseIcon width={16} height={16} />}
        onClick={onTaskManagementClose}
      />
    </Box>
  );
}
