import { useUpload } from '@/components/UploadProvider';

/**
 * useTaskManagementButton for display/hide the task management button.
 */
export const useTaskManagementButton = () => {
  const {
    state: { taskManagement },
    dispatch,
  } = useUpload();

  const onHide = () => {
    dispatch({ type: 'SET_TASK_MANAGEMENT_DISPLAY', payload: false });
  };
  const onShow = () => {
    dispatch({ type: 'SET_TASK_MANAGEMENT_DISPLAY', payload: true });
  };

  return {
    isShow: taskManagement,
    onShow,
    onHide,
  };
};
