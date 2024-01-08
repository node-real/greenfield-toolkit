import { CustomTheme } from '@/themes/base';
import { ThemeMode, ThemeProvider, ThemeVariant } from '../ThemeProvider';
import { UploadKitContext, UploadKitOptions } from './context';
import { RouteProvider } from '../RouteProvider';
import { ModalProvider } from '../ModalProvider';
import { ToastProvider } from '@/base/components/toast/ToastProvider';
import { UploadKitModal } from '../UploadKitModal';
import { useMemo } from 'react';
import { getDefaultProviderOptions } from '@/defaultConfig/getDefaultProviderOptions';
import { UploadProvider } from '@/components/UploadProvider';
import '@/base/vanilla/global.css';
import { GlobalTasks } from '../GlobalTasks';
import { TaskManagementButton } from '../TaskManagementButton';
import { FeeProvider } from '../FeeProvider';

export interface UploadKitProviderProps {
  options: UploadKitOptions;
  children: React.ReactNode;
  theme?: ThemeVariant;
  mode?: ThemeMode;
  customTheme?: CustomTheme;
}

export const UploadKitProvider = (props: UploadKitProviderProps) => {
  const { children, theme = 'base', mode = 'light', options, customTheme } = props;

  const value = useMemo(() => {
    const finalOptions = getDefaultProviderOptions(options);
    return {
      options: finalOptions,
    };
  }, [options]);

  return (
    <>
      <UploadKitContext.Provider value={value}>
        <ThemeProvider variant={theme} mode={mode} customTheme={customTheme}>
          <UploadProvider>
            <RouteProvider>
              <ModalProvider>
                <FeeProvider>
                  {children}
                  <UploadKitModal />
                  <ToastProvider />
                  <GlobalTasks />
                  <TaskManagementButton />
                </FeeProvider>
              </ModalProvider>
            </RouteProvider>
          </UploadProvider>
        </ThemeProvider>
      </UploadKitContext.Provider>
    </>
  );
};
