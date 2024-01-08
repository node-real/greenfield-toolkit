import { style } from '@vanilla-extract/css';

export const clsUploadProgress = style({
  position: 'relative',
  width: 32,
  height: 32,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '::before': {
    content: '',
    position: 'absolute',
    height: 28,
    width: 28,
    borderRadius: '50%',
    background: '#fff',
  },
});

export const clsUploadProgressIcon = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
