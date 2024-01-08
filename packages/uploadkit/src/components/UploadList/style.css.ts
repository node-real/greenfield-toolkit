import { style } from '@vanilla-extract/css';
import { cssVar } from '@/base/utils/css';

export const clsWaitItem = style({
  display: 'flex',
  padding: '12px 4px',
  width: '100%',
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
});

export const clsWaitItemDesc = style({
  color: cssVar('textSecondary'),
});

export const clsWaitItemStatus = style({
  minWidth: 100,
  textAlign: 'right',
  display: 'flex',
  justifyContent: 'flex-end',
});

export const clsUploadListEmpty = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 16,
  width: '100%',
  height: '100%',
  padding: '0 16px',
  textAlign: 'center',
});
