import { useUpload } from '../UploadProvider';
import { WaitObject } from '../UploadProvider/types';
import { cx } from '@/base/utils/css';
import { IconButton } from '@/base/components/IconButton';
import { CloseIcon } from '@/base/icons/CloseIcon';
import { UploadIcon } from '@/base/icons/UploadIcon';
import { formatBytes } from '@/base/utils/common';
import {
  clsWaitItem,
  clsWaitItemCloseIcon,
  clsWaitItemContent,
  clsWaitItemDesc,
  clsWaitItemError,
  clsWaitItemIcon,
  clsWaitItemName,
} from './style.css';
import { Box, BoxProps } from '@/base/components/Box';
import { Text } from '@/base/components/Text';

export type WaitListProps = BoxProps;

export function WaitList(props: WaitListProps) {
  const { className } = props;
  const {
    state: { waitQueue },
    dispatch,
  } = useUpload();
  const hasWaitQueue = waitQueue && waitQueue.length > 0;
  const onRemove = (id: number) => {
    return dispatch({
      type: 'REMOVE_WAIT_TASK',
      payload: {
        id,
      },
    });
  };

  if (!hasWaitQueue) return null;
  return (
    <>
      {waitQueue.map((item: WaitObject, index: number) => (
        <Box key={index} className={cx('uk-wait-item', clsWaitItem, className)}>
          <Box className={cx('uk-wait-item-icon', clsWaitItemIcon)}>
            <UploadIcon width={'100%'} />
          </Box>
          <Box className={cx('uk-wait-item-content', clsWaitItemContent)}>
            <Text className={cx('uk-wait-item-name', clsWaitItemName)}>{item.name}</Text>
            {item.status === 'WAIT' && (
              <Text className={cx('uk-wait-item-size', clsWaitItemDesc)}>
                {formatBytes(item.size)}
              </Text>
            )}
            {item.status === 'ERROR' && (
              <Text className={cx('uk-wait-item-error', clsWaitItemError)}>{item.msg}</Text>
            )}
          </Box>
          <IconButton
            className={cx('uk-wait-item-close-button', clsWaitItemCloseIcon)}
            icon={<CloseIcon />}
            onClick={() => onRemove(item.id)}
          />
        </Box>
      ))}
    </>
  );
}
