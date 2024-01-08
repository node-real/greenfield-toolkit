import { hover } from '@/base/vanilla/index.css';
import { cssVar } from '@/base/utils/css';
import { style } from '@vanilla-extract/css';

export const clsUploadKitButton = style({
  height: 40,
  padding: '0 12px',
  fontSize: 14,
  lineHeight: '17px',
  borderRadius: cssVar('uploadKitButton', 'radii'),
  background: cssVar('uploadKitButtonBackground'),
  color: cssVar('uploadKitButtonText'),
  gap: 8,
  '@media': hover({
    background: cssVar('uploadKitButtonBackgroundHover'),
    color: cssVar('uploadKitButtonTextHover'),
  }),
});
