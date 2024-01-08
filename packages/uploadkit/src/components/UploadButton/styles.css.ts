import { cssVar } from '@/base/utils/css';
import { hover } from '@/base/vanilla/index.css';
import { style, keyframes, globalStyle } from '@vanilla-extract/css';

export const clsUploadButton = style({
  width: '100%',
  height: 48,
  fontSize: 16,
  fontWeight: 500,
  borderRadius: cssVar('navButton', 'radii'),
  padding: 0,
  background: 'transparent',
  color: cssVar('buttonText'),
  marginTop: 16,
  backgroundColor: cssVar('buttonBackground'),
  '@media': hover({
    // background: cssVar('navButtonBackgroundHover'),
  }),
});

export const clsContainer = style({
  position: 'relative',
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const clsLogo = style({
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${clsLogo} > *`, {
  width: 20,
  height: 20,
});

export const clsErrorCircle = style({
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'absolute',
  border: `2px solid ${cssVar('error')}`,
  marginTop: 2,
});

const rotateSpinner = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const clsLoading = style({
  animation: `${rotateSpinner} 1200ms linear infinite`,
  position: 'absolute',
  left: '50%',
  transformOrigin: '1px 50%',
  marginTop: 2,
});
