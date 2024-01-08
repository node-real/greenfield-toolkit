import { Box, BoxProps } from '@/base/components/Box';
import { Text } from '@/base/components/Text';
import {
  clsTotalFee,
  clsTotalFeeAmount,
  clsTotalFeeLabel,
  clsTotalInfo,
  clsTotalUpload,
  clsTotalUploadContent,
  clsTotalUploadLabel,
  clsTotalUploadNum,
  clsTotalUploadSlash,
} from './style.css';
import { cx } from '@/base/utils/css';
import { useUpload } from '../UploadProvider';
import { formatBytes } from '@/base/utils/common';
import { useTotalFee } from '@/hooks/useTotalFee';

export type TotalFeeProps = BoxProps;

export function TotalFee(props: TotalFeeProps) {
  const { totalFee, objectsCount, objectsSize } = useTotalFee();
  const { className } = props;
  const {
    state: { waitQueue },
  } = useUpload();
  const hasWaitQueue = waitQueue && waitQueue.length > 0;
  if (!hasWaitQueue) return null;
  return (
    <Box className={cx('uk-total-info', clsTotalInfo)}>
      <Box className={cx('uk-total-upload', clsTotalUpload, className)}>
        <Text className={cx('uk-total-upload-label', clsTotalUploadLabel, className)}>
          Total Upload:
        </Text>
        <Box className={cx('uk-total-upload-content', clsTotalUploadContent)}>
          <Text className={cx('uk-total-upload-num', clsTotalUploadNum, className)}>
            {formatBytes(objectsSize)}
          </Text>
          <Text className={cx('uk-total-upload-slash', clsTotalUploadSlash, className)}>/</Text>
          <Text className={cx('uk-total-upload-num', clsTotalUploadNum, className)}>
            {objectsCount} Objects
          </Text>
        </Box>
      </Box>
      <Box className={cx('uk-total-fee', clsTotalFee)}>
        <Text className={cx('uk-total-upload-fee-label', clsTotalFeeLabel)}>
          Estimated Total Fees:
        </Text>
        <Text className={cx('uk-total-upload-fee-content', clsTotalFeeAmount)}>{totalFee} BNB</Text>
      </Box>
    </Box>
  );
}
