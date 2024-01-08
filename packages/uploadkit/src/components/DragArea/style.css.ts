import { cssVar } from '@/base/utils/css';
import { style } from '@vanilla-extract/css';

export const clsDragAreaContainer = style({
  position: 'relative',
  width: '100%',
});

export const clsDragAreaInput = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  cursor: 'default',
  visibility: 'hidden',
});

export const clsDragAreaInputDisable = style({
  display: 'none',
});

export const clsDragArea = style({
  width: '100%',
  border: `1px dashed ${cssVar('disabled')}`,
  height: 350,
  display: 'flex',
  gap: 8,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

export const clsDragAreaSm = style({
  height: 56,
  gap: 4,
  flexDirection: 'row',
});

export const clsDragAreaDragging = style({
  border: `1px dashed ${cssVar('blue')}`,
});

export const clsDragAreaTitle = style({
  fontSize: 16,
  fontWeight: 700,
});

export const clsDragAreaText = style({
  display: 'inline',
  fontWeight: 500,
});

export const clsDragAreaLink = style({
  color: cssVar('blue'),
  display: 'inline',
  fontWeight: 500,
});

export const clsDragAreaDisable = style({
  color: cssVar('disabled'),
});
