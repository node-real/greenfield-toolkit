import {
  Action,
  Sp,
  TTmpAccount,
  UploadObject,
  UploadStatus,
} from '@/components/UploadProvider/types';
import { TMakePutObjectHeaders, getCreateObjectTx, makePutObjectHeaders } from '@/facade/object';
import { broadcastTmpTx } from '@/facade/tx';
import { parseErrorXml } from '@/utils/common';
import { AuthType, Client, CreateObjectApprovalRequest } from '@bnb-chain/greenfield-js-sdk';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { Dispatch } from 'react';

export const getHashTask = (uploadQueue: UploadObject[]) => {
  const hashQueue = uploadQueue.filter((task) => task.status === 'HASH');
  const wQueue = uploadQueue.filter((task) => task.status === 'WAIT');
  return hashQueue.length ? null : wQueue[0] || null;
};

export const getSignTask = (uploadQueue: UploadObject[]) => {
  const signQueue = uploadQueue.filter((task) => task.status === 'SIGN');
  const hashedQueue = uploadQueue.filter((task) => task.status === 'HASHED');
  const uploadingQueue = uploadQueue.filter((task) => task.status === 'UPLOAD');
  return uploadingQueue.length || !!signQueue.length ? null : hashedQueue[0] || null;
};

export function getUploadTask(uploadQueue: UploadObject[]) {
  const uploadingQueue = uploadQueue.filter((t) => t.status === 'UPLOAD');
  const signedQueue = uploadQueue.filter((t) => t.status === 'SIGNED');
  const uploadingOffset = 1 - uploadingQueue.length;
  return uploadingOffset > 0 ? signedQueue.slice(0, uploadingOffset).map((p) => p.id) : [];
}

export const processHashTask = async (
  task: UploadObject,
  dispatch: React.Dispatch<Action>,
  rs: ReedSolomon,
  checksumFn?: (data: Uint8Array) => Promise<string[]>,
) => {
  const fileBytes = await task.waitObject.file.arrayBuffer();
  const checkSumRes =
    typeof checksumFn === 'function'
      ? await checksumFn(new Uint8Array(fileBytes))
      : await rs.encode(new Uint8Array(fileBytes));

  if (!checkSumRes) {
    return dispatch({
      type: 'SET_UPLOAD_TASK_ERROR_MSG',
      payload: {
        id: task.id,
        msg: 'Calculating hash error',
      },
    });
  }

  dispatch({
    type: 'SET_UPLOAD_TASK_CHECKSUM',
    payload: {
      id: task.id,
      checksum: checkSumRes,
    },
  });
};

export const processTask = async ({
  task,
  status,
  dispatch,
  rs,
  checksumFn,
  tmpAccount,
  client,
  address,
}: {
  task: UploadObject | null;
  status: UploadStatus;
  dispatch: Dispatch<Action>;
  rs: ReedSolomon;
  checksumFn?: (data: Uint8Array) => Promise<string[]>;
  tmpAccount: TTmpAccount;
  client: Client;
  address?: string;
}) => {
  if (!task || !address) return;

  dispatch({
    type: 'SET_UPLOAD_TASK_STATUS',
    payload: {
      id: task.id,
      status,
    },
  });

  switch (status) {
    case 'HASH':
      await processHashTask(task, dispatch, rs, checksumFn);
      break;
    case 'SIGN':
      await processSignTask({ task, dispatch, client, tmpAccount, address });
      break;
    // Add more cases as needed
    default:
      break;
  }
};

export const processSignTask = async ({
  task,
  dispatch,
  client,
  tmpAccount,
  address,
}: {
  task: UploadObject;
  dispatch: Dispatch<Action>;
  client: Client;
  tmpAccount: TTmpAccount;
  address: string;
}) => {
  const createObjectPayload: CreateObjectApprovalRequest = {
    bucketName: task.bucketName,
    objectName: task.waitObject.name,
    creator: tmpAccount.address,
    visibility: task.visibility,
    fileType: task.waitObject.type || 'application/octet-stream',
    contentLength: task.waitObject.size,
    expectCheckSums: task.checksum,
    duration: 5000,
  };

  const [createObjectTx, createError] = await getCreateObjectTx(
    createObjectPayload,
    {
      type: 'ECDSA',
      privateKey: tmpAccount.privateKey,
    },
    client,
  );

  if (createObjectTx === null || createError) {
    return dispatch({
      type: 'SET_UPLOAD_TASK_ERROR_MSG',
      payload: {
        id: task.id,
        msg: createError,
      },
    });
  }

  const [res, bError] = await broadcastTmpTx(createObjectTx, tmpAccount, address);

  if (res === null || bError) {
    return dispatch({
      type: 'SET_UPLOAD_TASK_ERROR_MSG',
      payload: {
        id: task.id,
        msg: bError,
      },
    });
  }

  dispatch({
    type: 'SET_UPLOAD_TASK_CREATE_HASH',
    payload: {
      id: task.id,
      createHash: res.transactionHash,
    },
  });
};

export const runUploadTask = async ({
  task,
  dispatch,
  seedString,
  client,
  selectedSp,
  address,
}: {
  task: UploadObject;
  dispatch: Dispatch<Action>;
  seedString: string;
  client: Client;
  selectedSp: Sp;
  address: string;
}) => {
  dispatch({
    type: 'SET_UPLOAD_TASK_STATUS',
    payload: {
      id: task.id,
      status: 'UPLOAD',
    },
  });
  const payload: TMakePutObjectHeaders = {
    bucketName: task.bucketName,
    objectName: task.waitObject.name,
    body: task.waitObject.file,
    endpoint: selectedSp.endpoint,
    txnHash: task.createHash,
  };
  const authType = {
    type: 'EDDSA',
    seed: seedString,
    domain: window.location.origin,
    address,
  } as AuthType;

  try {
    const [uploadOptions, poError] = await makePutObjectHeaders(payload, authType, client);

    if (!uploadOptions || poError) {
      throw poError;
    }

    const { url, headers } = uploadOptions;
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', url, true);

    xhr.upload.onprogress = async (progressEvent) => {
      if (progressEvent.lengthComputable) {
        const progress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
        dispatch({
          type: 'SET_UPLOAD_TASK_PROGRESS',
          payload: {
            id: task.id,
            progress,
          },
        });
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        dispatch({
          type: 'SET_UPLOAD_TASK_STATUS',
          payload: {
            id: task.id,
            status: 'FINISH',
          },
        });
      } else {
        const { message } = await parseErrorXml(xhr.response);
        const authExpired = [
          'bad signature',
          'invalid signature',
          'user public key is expired',
        ].includes(message || '');
        setTimeout(() => {
          dispatch({
            type: 'SET_UPLOAD_TASK_ERROR_MSG',
            payload: {
              id: task.id,
              msg: authExpired
                ? 'Authentication expired.'
                : message || xhr.statusText || 'upload error',
            },
          });
        }, 200);
      }
    };

    xhr.onerror = () => {
      dispatch({
        type: 'SET_UPLOAD_TASK_ERROR_MSG',
        payload: {
          id: task.id,
          msg: 'Network error during upload.',
        },
      });
    };

    // Set custom headers
    Object.entries({
      Authorization: headers.get('Authorization'),
      'content-type': headers.get('content-type'),
      'x-gnfd-app-domain': headers.get('x-gnfd-app-domain'),
      'x-gnfd-content-sha256': headers.get('x-gnfd-content-sha256'),
      'x-gnfd-date': headers.get('x-gnfd-date'),
      'x-gnfd-expiry-timestamp': headers.get('x-gnfd-expiry-timestamp'),
      'x-gnfd-txn-hash': headers.get('x-gnfd-txn-hash'),
      'x-gnfd-user-address': headers.get('x-gnfd-user-address'),
    }).forEach(([header, value]) => {
      xhr.setRequestHeader(header, value as string);
    });

    // Send the file
    xhr.send(task.waitObject.file);
  } catch (error) {
    dispatch({
      type: 'SET_UPLOAD_TASK_ERROR_MSG',
      payload: {
        id: task.id,
        msg: (error as Error)?.message || 'Unexpected error during upload.',
      },
    });
  }
};

export const processUploadTasks = async ({
  tasks,
  uploadQueue,
  dispatch,
  seedString,
  client,
  selectedSp,
  address,
}: {
  tasks: number[];
  uploadQueue: UploadObject[];
  dispatch: Dispatch<Action>;
  seedString: string;
  client: Client;
  selectedSp: Sp;
  address?: string;
}) => {
  if (!tasks.length || !address) return;

  const tasksToRun = uploadQueue.filter((t: UploadObject) => tasks.includes(t.id));
  tasksToRun.forEach((t: UploadObject) =>
    runUploadTask({
      task: t,
      dispatch,
      seedString,
      client,
      selectedSp,
      address,
    }),
  );
};
