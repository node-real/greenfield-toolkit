import { useUpload } from '../UploadProvider';
import { UploadObject } from '../UploadProvider/types';
import { cx } from '@/base/utils/css';
import { UploadIcon } from '@/base/icons/UploadIcon';
import { formatBytes } from '@/base/utils/common';
import {
  clsUploadListEmpty,
  clsWaitItem,
  clsWaitItemContent,
  clsWaitItemDesc,
  clsWaitItemIcon,
  clsWaitItemIconSm,
  clsWaitItemName,
  clsWaitItemStatus,
} from './style.css';
import { Box, BoxProps } from '@/base/components/Box';
import { Text } from '@/base/components/Text';
import { SuccessIcon } from '@/base/icons/SuccessIcon';
import { LineProgressBar } from '@/base/components/LineProgress';
import { clsWaitItemError } from '../WaitList/style.css';
import { ErrorIcon } from '@/base/icons/ErrorIcon';

export type WaitListProps = BoxProps;

export function UploadList(props: WaitListProps) {
  const { className } = props;
  const {
    state: { uploadQueue },
  } = useUpload();
  const hasUploadTask = uploadQueue && uploadQueue.length > 0;

  const UploadStatus = ({ task }: { task: UploadObject }) => {
    if (task.status === 'FINISH') {
      return <SuccessIcon />;
    } else if (['ERROR', 'CANCEL'].includes(task.status)) {
      return <ErrorIcon width={24} height={24} />;
    } else {
      return <LineProgressBar progress={task.progress || 0} />;
    }
  };
  if (!hasUploadTask)
    return <Box className={cx('uk-upload-list-empty', clsUploadListEmpty)}>No Data</Box>;

  return (
    <>
      {uploadQueue.map((item: UploadObject, index: number) => (
        <Box key={index} className={cx('uk-wait-item', clsWaitItem, className)}>
          <Box className={cx('uk-wait-item-icon', clsWaitItemIcon)}>
            <UploadIcon width={'100%'} />
          </Box>
          <Box className={cx('uk-wait-item-content', clsWaitItemContent)}>
            <Text className={cx('uk-wait-item-name', clsWaitItemName)}>{item.waitObject.name}</Text>
            {item.status !== 'ERROR' && (
              <Text className={cx('uk-wait-item-size', clsWaitItemDesc)}>
                {formatBytes(item.waitObject.size)}
              </Text>
            )}
            {item.status === 'ERROR' && (
              <Text className={cx('uk-wait-item-error', clsWaitItemError)}>{item.msg}</Text>
            )}
          </Box>
          <Box className={cx('uk-wait-item-status', clsWaitItemStatus)}>
            <UploadStatus task={item} />
          </Box>
        </Box>
      ))}
    </>
  );
}
