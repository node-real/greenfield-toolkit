import { Box } from '../Box';
import { clsProgress, clsProgressLine, clsProgressLineInner, clsProgressText } from './style.css';
import { cx } from '@/base/utils/css';

export type ProgressProps = {
  progress: number;
};

export function LineProgressBar({ progress }: ProgressProps) {
  return (
    <Box className={cx('uk-line-progress', clsProgress)}>
      <Box className={cx('uk-line-progress-text', clsProgressText)}>{progress}%</Box>
      <Box className={cx('uk-line-progress-line', clsProgressLine)}>
        <Box
          className={cx('uk-line-progress-line-inner', clsProgressLineInner)}
          style={{ width: `${progress}%` }}
        ></Box>
      </Box>
    </Box>
  );
}
