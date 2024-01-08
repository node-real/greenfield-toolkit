import { rgba, DeepPartial } from '..';

const radii = {
  common: '8px',
  modal: '12px',

  navButton: '4px',
  button: 'var(--uk-radii-common)',
  uploadKitButton: 'var(--uk-radii-common)',
  toast: 'var(--uk-radii-common)',
};

const zIndices = {
  taskManagementButton: 1200,
  modal: 1300,
  toast: 1500,
};

export const base = {
  light: {
    colors: {
      text: '#1E2026',
      textSecondary: '#76808F',
      error: '#D9304E',
      errorActive: '#B82942',
      border: '#E6E8EA',
      disabled: '#AEB4BC',
      blue: '#1184EE',

      bgNormal: '#fff',
      bgBottom: '#F5F5F5',

      modalBackground: '#fff',
      modalOverlay: 'rgba(0, 0, 0, 0.5)',

      totalFeeLabel: '#474D57',

      buttonText: '#fff',
      buttonTextHover: 'var(--uk-colors-text)',
      buttonBackground: '#1E2026',
      buttonBackgroundHover: rgba('#F0B90B', 0.1),

      uploadKitButtonText: 'var(--uk-colors-text)',
      uploadKitButtonTextHover: 'var(--uk-colors-text)',
      uploadKitButtonBackground: '#f5f5f5',
      uploadKitButtonBackgroundHover: '#e6e8ea',

      navButtonText: 'var(--uk-colors-textSecondary)',
      navButtonBackgroundHover: 'var(--uk-colors-border)',

      toastBackground: 'var(--uk-colors-modalBackground)',
    },
    shadows: {
      toast: '0px 4px 24px rgba(0, 0, 0, 0.08)',
      button: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
    },
    radii,
    zIndices,
  },
  dark: {
    colors: {
      text: '#fff',
      textSecondary: '#76808F',
      error: '#D9304E',
      errorActive: '#B82942',
      border: '#2e323a',
      disabled: '#5E6673',
      blue: '#1184EE',

      bgBottom: '#000',
      bgNormal: '#1E2026',

      modalBackground: '#1E2026',
      modalOverlay: rgba('#000', 0.5),

      totalFeeLabel: '#fff',
      buttonText: 'var(--uk-colors-text)',
      buttonTextHover: 'var(--uk-colors-text)',
      buttonBackground: '#14151a',
      buttonBackgroundHover: rgba('#F0B90B', 0.1),

      uploadKitButtonText: 'var(--uk-colors-text)',
      uploadKitButtonTextHover: 'var(--uk-colors-text)',
      uploadKitButtonBackground: '#2b2f36',
      uploadKitButtonBackgroundHover: '#2e323a',

      navButtonText: 'var(--uk-colors-textSecondary)',
      navButtonBackgroundHover: 'var(--uk-colors-border)',

      toastBackground: 'var(--uk-colors-modalBackground)',
    },
    shadows: {
      toast: '0px 4px 24px rgba(0, 0, 0, 0.08)',
      button: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
    },
    radii,
    zIndices,
  },
};

export type Theme = (typeof base)['light'];
export type ThemeWithMode = typeof base;

export type CustomTheme = DeepPartial<Theme> & DeepPartial<ThemeWithMode>;
