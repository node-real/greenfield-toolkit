import { Reducer, createContext, useContext, useReducer } from 'react';
import { reducer, initialState } from './reducer';
import { Action, UploadState } from './types';

export type UploadContextProps = { state: UploadState; dispatch: React.Dispatch<Action> };

export type UploadProviderProps = {
  children: React.ReactNode;
};

export const UploadContext = createContext({} as UploadContextProps);

export const UploadProvider = (props: UploadProviderProps) => {
  const { children } = props;
  const [state, dispatch] = useReducer<Reducer<UploadState, Action>>(reducer, initialState);

  return <UploadContext.Provider value={{ state, dispatch }}>{children}</UploadContext.Provider>;
};

export function useUpload() {
  const context = useContext(UploadContext);
  return context;
}
