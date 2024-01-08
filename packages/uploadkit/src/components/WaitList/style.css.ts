import { style } from '@vanilla-extract/css';
import { cssVar } from '@/base/utils/css';

export const clsWaitItem = style({
  display: 'flex',
  padding: '12px 4px',
  marginRight: 16,
  width: 'calc(100% - 16px)',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
});
export const clsWaitItemIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${cssVar('border')}`,
  width: 40,
  height: 40,
  borderRadius: '50%',
});

export const clsWaitItemIconSm = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: `1px solid ${cssVar('border')}`,
  width: 24,
  height: 24,
  borderRadius: '50%',
});

export const clsWaitItemContent = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  textAlign: 'left',
});

export const clsWaitItemName = style({
  fontWeight: 600,
  marginBottom: 4,
});

export const clsWaitItemDesc = style({
  color: cssVar('textSecondary'),
});

export const clsWaitItemCloseIcon = style({});

export const clsWaitItemError = style({
  color: '#EE3911',
  fontSize: 14,
});
