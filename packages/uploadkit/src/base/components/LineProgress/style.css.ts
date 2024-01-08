import { cssVar } from '@/base/utils/css';
import { mobile } from '@/base/vanilla/index.css';
import { style } from '@vanilla-extract/css';

export const clsProgress = style({
  width: '100%',
  maxWidth: 120,
});

export const clsProgressText = style({
  fontSize: 12,
  fontWeight: 500,
  color: cssVar('disabled'),
  marginBottom: 4,
});

export const clsProgressLine = style({
  width: '100%',
  height: 4,
  backgroundColor: '#f5f5f5',
  borderRadius: 2,
  overflow: 'hidden',
});

export const clsProgressLineInner = style({
  height: '100%',
  backgroundColor: '#1184EE',
  transition: 'width 0.3s ease-in-out',
});
