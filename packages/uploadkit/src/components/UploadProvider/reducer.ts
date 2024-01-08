import { Reducer, UploadState, TTmpAccount, UploadObject } from './types';

export const initialState: UploadState = {
  loading: false,
  taskManagement: true,
  seedString: '',
  waitQueue: [],
  uploadQueue: [],
  tmpAccount: {} as TTmpAccount,
};

export const reducer: Reducer = (state, action) => {
  state = state || initialState;

  switch (action.type) {
    case 'SET_IS_LOADING': {
      return {
        ...state,
        loading: action.payload,
      };
    }
    case 'SET_TASK_MANAGEMENT_DISPLAY': {
      return {
        ...state,
        taskManagement: action.payload,
      };
    }
    case 'SET_SEED_STRING': {
      return {
        ...state,
        seedString: action.payload,
      };
    }
    case 'SET_SELECTED_SP': {
      return {
        ...state,
        selectedSp: action.payload,
      };
    }
    case 'SET_TMP_ACCOUNT': {
      return {
        ...state,
        tmpAccount: action.payload,
      };
    }
    case 'SET_WAIT_QUEUE': {
      return {
        ...state,
        waitQueue: [...state.waitQueue, ...action.payload],
      };
    }
    case 'RESET_WAIT_QUEUE': {
      return {
        ...state,
        waitQueue: [],
      };
    }
    case 'REMOVE_WAIT_TASK': {
      return {
        ...state,
        waitQueue: state.waitQueue.filter((item) => item.id !== action.payload.id),
      };
    }
    case 'SET_UPLOAD_QUEUE': {
      const { payload } = action;
      const waitQueue = state.waitQueue;
      const uploadTasks = waitQueue.map((task) => {
        const uploadTask: UploadObject = {
          bucketName: payload.bucketName,
          prefixFolders: [''],
          spAddress: payload.spAddress,
          id: task.id,
          waitObject: task,
          msg: '',
          status: 'WAIT',
          progress: 0,
          checksum: [],
          visibility: payload.visibility,
          createHash: '',
        };
        return uploadTask;
      });

      return {
        ...state,
        uploadQueue: uploadTasks,
      };
    }
    case 'RESET_UPLOAD_QUEUE': {
      return {
        ...state,
        uploadQueue: [],
      };
    }
    case 'SET_UPLOAD_TASK_CHECKSUM': {
      const { id, checksum } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state;
      task.status = task.status !== 'CANCEL' ? 'HASHED' : 'CANCEL';
      task.checksum = checksum;
      return {
        ...state,
        uploadQueue: queue,
      };
    }
    case 'SET_UPLOAD_TASK_CREATE_HASH': {
      const { id, createHash } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state;
      task.createHash = createHash;
      task.status = task.status !== 'CANCEL' ? 'SIGNED' : 'CANCEL';
      return {
        ...state,
        uploadQueue: queue,
      };
    }
    case 'SET_UPLOAD_TASK_PROGRESS': {
      const { id, progress } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state; // Return state instead of undefined
      task.progress = progress;
      if (progress === 100) {
        task.status = 'FINISH';
      }
      return {
        ...state,
        uploadQueue: queue,
      };
    }
    case 'SET_UPLOAD_TASK_ERROR_MSG': {
      const { id, msg } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state; // Return state instead of undefined
      task.status = 'ERROR';
      task.msg = msg;
      return {
        ...state,
        uploadQueue: queue,
      };
    }
    case 'SET_UPLOAD_TASK_STATUS': {
      const { id, status } = action.payload;
      const queue = state.uploadQueue;
      const task = queue.find((item) => item.id === id);
      if (!task) return state;
      task.status = status;
      return {
        ...state,
        uploadQueue: queue,
      };
    }
    default: {
      return state;
    }
  }
};
