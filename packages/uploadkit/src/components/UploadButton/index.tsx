import { useUpload } from '@/components/UploadProvider';
import { ButtonProps, Button } from '@/base/components/Button';
import { clsUploadButton } from './styles.css';
import { cx } from '@/base/utils/css';
import { useNetwork, useAccount } from 'wagmi';
import { getCreateBucketTx } from '@/facade/bucket';
import { CreateBucketApprovalRequest } from '@bnb-chain/greenfield-js-sdk';
import { getSps } from '@/facade/sp';
import { getOffChainAuthKeys } from '@/facade/offchainauth';
import { useUploadKitContext } from '@/components/UploadKitProvider/context';
import { getCreateTmpAccountTx } from '@/facade/payment';
import { broadcastMulTxs } from '@/facade/tx';
import { useRouter } from '@/components/RouteProvider/context';
import { routes } from '@/components/RouteProvider';
import { Loading } from '@/base/components/Loading';
import { useTotalFee } from '@/hooks/useTotalFee';
import { toast } from '@/base/components/toast';
import { bucketIsExist, getRandomBucketName } from '@/utils/bucket';
import { BN } from '@/utils/math';
import { useUploadDisable } from '@/hooks/useUploadDisable';

export const DEFAULT_UPLOAD_BUTTON_TEXT = 'Upload';
export const TEMP_ACCOUNT_SAFE_RATE = 1.05;
export const CHARGED_READ_QUOTA = '0';

export const UploadButton = (props: ButtonProps) => {
  const { className, children, ...restProps } = props;
  const router = useRouter();
  const { chain } = useNetwork();
  const { totalFee } = useTotalFee();
  const { address, connector } = useAccount();
  const {
    options: { seedString, sp, visibility, bucketName, onError },
  } = useUploadKitContext();
  const { isGnfd, uploadButtonDisabled } = useUploadDisable();
  const {
    state: { loading },
    dispatch,
  } = useUpload();
  const {
    options: { client },
  } = useUploadKitContext();
  const setLoading = (show: boolean) => {
    dispatch({
      type: 'SET_IS_LOADING',
      payload: show,
    });
  };

  const errorHandler = (errorMsg: string) => {
    setLoading(false);
    onError && onError(errorMsg);
    toast.error({
      description: errorMsg,
    });
  };

  const onSubmit = async () => {
    if (!connector || !address || !chain || !visibility) {
      return errorHandler('No connector, please connect wallet first');
    }

    // 1. get sp Address;
    setLoading(true);
    let selectSp;
    if (sp?.operatorAddress && sp?.endpoint) {
      selectSp = sp;
    } else {
      const [sps, error] = await getSps(client);
      if (!sps || error) {
        return errorHandler(error);
      }
      const randomSp = sps[Math.floor(Math.random() * sps.length)];
      selectSp = {
        operatorAddress: randomSp.operatorAddress,
        endpoint: randomSp.endpoint,
      };
    }
    dispatch({
      type: 'SET_SELECTED_SP',
      payload: selectSp,
    });

    // 2. get offchainauth
    let seed;
    if (seedString) {
      seed = seedString;
    } else {
      const provider = await connector?.getProvider();

      const [offChainData, error2] = await getOffChainAuthKeys({
        address: address as string,
        provider,
        client,
        chainId: chain.id,
      });
      if (!offChainData || error2) {
        return errorHandler(error2);
      }
      seed = offChainData.seedString;
    }
    dispatch({
      type: 'SET_SEED_STRING',
      payload: seed,
    });

    // 3. gen a create bucket tx
    const txs = [];
    let isExisted = false;
    if (bucketName) {
      isExisted = await bucketIsExist({ bucketName, endpoint: selectSp.endpoint }, client);
    }
    const createBucketName = bucketName || getRandomBucketName();
    if (!isExisted) {
      const createBucketPayload: CreateBucketApprovalRequest = {
        bucketName: createBucketName,
        creator: address as string,
        paymentAddress: address as string,
        visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
        chargedReadQuota: CHARGED_READ_QUOTA,
        spInfo: {
          primarySpAddress: selectSp.operatorAddress,
        },
      };
      const [createBucketTx, ctError] = await getCreateBucketTx(
        createBucketPayload,
        {
          type: 'EDDSA',
          domain: window.location.origin,
          seed: seed,
          address,
        },
        client,
      );
      if (!createBucketTx || ctError) {
        return errorHandler(ctError);
      }
      txs.push(createBucketTx);
    }

    const [ctaRes, ctaError] = await getCreateTmpAccountTx({
      address: address as string,
      bucketName: createBucketName,
      amount: BN(totalFee).times(TEMP_ACCOUNT_SAFE_RATE).toNumber(),
      client,
    });
    if (!ctaRes || ctaError) {
      return errorHandler(ctaError);
    }
    txs.push(...ctaRes.txs);
    const [res, mtError] = await broadcastMulTxs({
      txs: txs,
      address,
      client,
      connector,
    });
    if (res === null || mtError) {
      return errorHandler(mtError);
    }
    setLoading(false);
    dispatch({
      type: 'SET_TMP_ACCOUNT',
      payload: ctaRes.tmpAccount,
    });
    dispatch({
      type: 'SET_UPLOAD_QUEUE',
      payload: {
        bucketName: createBucketName,
        spAddress: selectSp.operatorAddress,
        visibility,
      },
    });
    router.push(routes.UPLOAD);
  };

  return (
    <>
      <Button
        className={cx('uk-upload-button', clsUploadButton, className)}
        onClick={() => onSubmit()}
        disabled={uploadButtonDisabled}
        {...restProps}
      >
        {loading ? (
          <Loading />
        ) : !isGnfd ? (
          'Please switch to BNB Greenfield first.'
        ) : children ? (
          children
        ) : (
          DEFAULT_UPLOAD_BUTTON_TEXT
        )}
      </Button>
    </>
  );
};

UploadButton.displayName = 'UploadButton';
