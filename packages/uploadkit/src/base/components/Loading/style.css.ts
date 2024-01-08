import { keyframes, style } from '@vanilla-extract/css';

const clsLoadingKeyFrames = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
});

export const clsSpinner = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  animationName: clsLoadingKeyFrames,
  animationDuration: '800ms',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
});
