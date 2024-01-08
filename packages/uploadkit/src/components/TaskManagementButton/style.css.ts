import { cssVar } from '@/base/utils/css';
import { style } from '@vanilla-extract/css';

export const clsTaskManagementButton = style({
  position: 'fixed',
  right: 40,
  bottom: 40,
  zIndex: cssVar('taskManagementButton', 'zIndices'),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
  width: 'fit-content',
  height: 32,
  padding: '6px 8px',
  borderRadius: 16,
  boxShadow: cssVar('button', 'shadows'),
  backgroundColor: cssVar('bgNormal'),
  color: cssVar('text'),
  cursor: 'pointer',
});

export const clsTaskManagementButtonContent = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
});

export const clsTaskManagementButtonText = style({
  fontSize: 12,
  fontWeight: 500,
  color: cssVar('text'),
});
