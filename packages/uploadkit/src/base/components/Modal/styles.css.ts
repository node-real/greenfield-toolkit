import { cssVar } from '@/base/utils/css';
import { mobile } from '@/base/vanilla/index.css';
import { style } from '@vanilla-extract/css';

export const clsModal = style({
  zIndex: cssVar('modal', 'zIndices'),
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: cssVar('text'),
  margin: 0,
  padding: 0,
  transition: 'all 0.3s',
  boxSizing: 'border-box',
  '@media': mobile({
    alignItems: 'flex-end',
  }),
});

export const clsModalOverlay = style({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: cssVar('modalOverlay'),
});

export const clsModalContent = style({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  background: cssVar('modalBackground'),
  padding: '24px 24px 40px',
  width: 'calc(100% - 32px)',
  maxWidth: 640,
  height: 533,
  borderRadius: cssVar('modal', 'radii'),
  '@media': mobile({
    width: '100%',
    maxWidth: '100vw',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 40,
    left: 0,
    bottom: 0,
  }),
});
