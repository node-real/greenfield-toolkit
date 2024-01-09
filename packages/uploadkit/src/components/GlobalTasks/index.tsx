import { useUpload } from '../UploadProvider';
import { useMemo } from 'react';
import { UploadObject } from '../UploadProvider/types';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import useSingleton from '@/hooks/useSingleton';
import { CreateObjectApprovalRequest } from '@bnb-chain/greenfield-js-sdk';
import { parseErrorXml } from '@/utils/common';
import { TMakePutObjectHeaders, getCreateObjectTx, makePutObjectHeaders } from '@/facade/object';
import { AuthType, broadcastTmpTx } from '@/facade/tx';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useUploadKitContext } from '../UploadKitProvider/context';
import useAsyncEffect from '@/hooks/useAsyncEffect';

export const GlobalTasks = () => {
  const { state, dispatch } = useUpload();
  const { address } = useAccount();
  const {
    options: { client, checksumFn },
  } = useUploadKitContext();
  const { uploadQueue, tmpAccount, selectedSp, seedString } = state;
  const rs = useSingleton(ReedSolomon);
  const hashTask = useMemo(() => {
    const hashQueue = uploadQueue.filter((task: UploadObject) => task.status === 'HASH');
    const wQueue = uploadQueue.filter((task: UploadObject) => task.status === 'WAIT');
    const res = hashQueue.length ? null : wQueue[0] ? wQueue[0] : null;

    return res;
  }, [JSON.stringify(uploadQueue)]);
  const signTask = useMemo(() => {
    const signQueue = uploadQueue.filter((task: UploadObject) => task.status === 'SIGN');
    const hashedQueue = uploadQueue.filter((task: UploadObject) => task.status === 'HASHED');
    const uploadingQueue = uploadQueue.filter((task: UploadObject) => task.status === 'UPLOAD');
    if (uploadingQueue.length || !!signQueue.length) {
      return null;
    }

    return hashedQueue[0] ? hashedQueue[0] : null;
  }, [JSON.stringify(uploadQueue)]);

  const uploadTask = useMemo(() => {
    const uploadingQueue = uploadQueue.filter((t: UploadObject) => t.status === 'UPLOAD');
    const signedQueue = uploadQueue.filter((t: UploadObject) => t.status === 'SIGNED');
    const uploadingOffset = 1 - uploadingQueue.length;
    if (uploadingOffset <= 0) return [];

    return signedQueue.slice(0, uploadingOffset).map((p: UploadObject) => p.id);
  }, [JSON.stringify(uploadQueue)]);

  useAsyncEffect(async () => {
    if (!hashTask) return;
    dispatch({
      type: 'SET_UPLOAD_TASK_STATUS',
      payload: {
        id: hashTask.id,
        status: 'HASH',
      },
    });
    const fileBytes = await hashTask.waitObject.file.arrayBuffer();
    const calChecksumFn = typeof checksumFn === 'function' ? checksumFn : rs.encode;
    const checkSumRes = await calChecksumFn(new Uint8Array(fileBytes));
    if (!checkSumRes) {
      return dispatch({
        type: 'SET_UPLOAD_TASK_ERROR_MSG',
        payload: {
          id: hashTask.id,
          msg: 'calculating hash error',
        },
      });
    }
    dispatch({
      type: 'SET_UPLOAD_TASK_CHECKSUM',
      payload: {
        id: hashTask.id,
        checksum: checkSumRes,
      },
    });
  }, [hashTask, dispatch]);

  // 2. Sign
  useAsyncEffect(async () => {
    if (!signTask) return;
    dispatch({
      type: 'SET_UPLOAD_TASK_STATUS',
      payload: {
        id: signTask.id,
        status: 'SIGN',
      },
    });

    const createObjectPayload: CreateObjectApprovalRequest = {
      bucketName: signTask.bucketName,
      objectName: signTask.waitObject.name,
      creator: tmpAccount.address,
      visibility: signTask.visibility,
      fileType: signTask.waitObject.type || 'application/octet-stream',
      contentLength: signTask.waitObject.size,
      expectCheckSums: signTask.checksum,
      duration: 5000,
    };

    const [createObjectTx, _createError] = await getCreateObjectTx(
      createObjectPayload,
      {
        type: 'ECDSA',
        privateKey: tmpAccount.privateKey,
      },
      client,
    );
    if (createObjectTx === null || _createError) {
      return dispatch({
        type: 'SET_UPLOAD_TASK_ERROR_MSG',
        payload: {
          id: signTask.id,
          msg: _createError,
        },
      });
    }
    const [res, bError] = await broadcastTmpTx(createObjectTx, tmpAccount, address!);

    if (res === null || bError) {
      return dispatch({
        type: 'SET_UPLOAD_TASK_ERROR_MSG',
        payload: {
          id: signTask.id,
          msg: bError,
        },
      });
    }

    dispatch({
      type: 'SET_UPLOAD_TASK_CREATE_HASH',
      payload: {
        id: signTask.id,
        createHash: res.transactionHash,
      },
    });
  }, [signTask, dispatch]);

  const runUploadTask = async (task: UploadObject) => {
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
    const [uploadOptions, poError] = await makePutObjectHeaders(payload, authType, client);

    if (!uploadOptions || poError) {
      return dispatch({
        type: 'SET_UPLOAD_TASK_ERROR_MSG',
        payload: {
          id: task.id,
          msg: poError,
        },
      });
    }
    const { url, headers } = uploadOptions;

    axios
      .put(url, task.waitObject.file, {
        async onUploadProgress(progressEvent) {
          const progress = Math.round(
            (progressEvent.loaded / (progressEvent.total as number)) * 100,
          );
          dispatch({
            type: 'SET_UPLOAD_TASK_PROGRESS',
            payload: {
              id: task.id,
              progress,
            },
          });
        },

        headers: {
          Authorization: headers.get('Authorization'),
          'content-type': headers.get('content-type'),
          'x-gnfd-app-domain': headers.get('x-gnfd-app-domain'),
          'x-gnfd-content-sha256': headers.get('x-gnfd-content-sha256'),
          'x-gnfd-date': headers.get('x-gnfd-date'),
          'x-gnfd-expiry-timestamp': headers.get('x-gnfd-expiry-timestamp'),
          'x-gnfd-txn-hash': headers.get('x-gnfd-txn-hash'),
          'x-gnfd-user-address': headers.get('x-gnfd-user-address'),
        },
      })
      .catch(async (e: Response | any) => {
        console.log('upload error', e);
        const { message } = await parseErrorXml(e);
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
                : message || e?.message || 'upload error',
            },
          });
        }, 200);
      });
  };

  // 3. Upload
  useAsyncEffect(async () => {
    if (!uploadTask) return;

    const tasks = uploadQueue.filter((t: UploadObject) => uploadTask.includes(t.id));
    tasks.forEach(runUploadTask);
  }, [uploadTask.join('')]);

  return <></>;
};
