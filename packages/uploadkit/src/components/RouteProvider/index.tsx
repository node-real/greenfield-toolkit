import { useState, useRef, useMemo, useCallback } from 'react';
import { RouteContext } from './context';
import { WaitPage } from '@/pages/Wait';
import { UploadPage } from '@/pages/Upload';

export const routes = {
  DRAG: 'Drag',
  UPLOAD: 'Upload',
};

export interface RouteProviderProps {
  children: React.ReactNode;
}

export function RouteProvider(props: RouteProviderProps) {
  const { children } = props;

  const [route, setRoute] = useState('');
  const { current: history } = useRef<string[]>([]);

  const page = useMemo(() => {
    switch (route) {
      case routes.DRAG:
        return <WaitPage />;
      case routes.UPLOAD:
        return <UploadPage />;
    }
    return null;
  }, [route]);

  const back = useCallback(() => {
    history.pop();
    const nextRoute = history[history.length - 1];
    if (nextRoute) {
      setRoute(nextRoute);
    }
  }, [history]);

  const push = useCallback(
    (nextRoute: string) => {
      if (history[history.length - 1] !== nextRoute) {
        history.push(nextRoute);
        setRoute(nextRoute);
      }
    },
    [history],
  );

  const replace = useCallback(
    (nextRoute: string) => {
      if (history[history.length - 1] !== nextRoute) {
        history[history.length - 1] = nextRoute;
        setRoute(nextRoute);
      }
    },
    [history],
  );

  const reset = useCallback(() => {
    history.length = 0;
  }, [history]);

  const value = useMemo(() => {
    return {
      route,
      page,
      back,
      push,
      replace,
      reset,
    };
  }, [back, page, push, replace, reset, route]);

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}
