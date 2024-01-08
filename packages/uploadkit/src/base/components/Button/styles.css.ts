import { cssVar } from '@/utils/css';
import { style } from '@vanilla-extract/css';

export const clsButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
  height: 56,
  padding: '0 16px',
  fontSize: 16,
  fontWeight: 500,
  lineHeight: '19px',
  ':disabled': {
    cursor: 'not-allowed',
    backgroundColor: cssVar('disabled'),
  },
});
