import { Box } from '@/base/components/Box';
import { clsUploadProgress, clsUploadProgressIcon } from './style.css';
import { SuccessIcon } from '@/base/icons/SuccessIcon';
import { cx } from '@/base/utils/css';

export function UploadProgress({ progress }: { progress: number }) {
  return (
    <Box
      className={cx('uk-upload-progress', clsUploadProgress)}
      style={{
        background: `conic-gradient(#7d2ae8 ${progress * 3.6}deg, #ededed 0deg)
      `,
      }}
    >
      <Box className={cx('uk-upload-progress-icon', clsUploadProgressIcon)}>
        <SuccessIcon />
      </Box>
    </Box>
  );
}
