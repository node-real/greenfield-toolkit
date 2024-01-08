import { cssVar } from '@/base/utils/css';
import { style } from '@vanilla-extract/css';

export const clsTotalInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '16px 0 0',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
});

export const clsTotalUpload = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
});
export const clsTotalUploadLabel = style({
  fontSize: 14,
  fontWeight: 400,
  color: cssVar('totalFeeLabel'),
});
export const clsTotalUploadContent = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 4,
});
export const clsTotalUploadNum = style({
  fontSize: 14,
  fontWeight: 600,
});

export const clsTotalUploadSlash = style({
  fontSize: 14,
  fontWeight: 400,
  color: cssVar('totalFeeLabel'),
});

export const clsTotalFee = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: cssVar('bgBottom'),
  borderRadius: 4,
  padding: '8px 12px',
});

export const clsTotalFeeLabel = style({
  fontSize: 14,
  fontWeight: 600,
});

export const clsTotalFeeAmount = style({
  color: cssVar('totalFeeLabel'),
});
