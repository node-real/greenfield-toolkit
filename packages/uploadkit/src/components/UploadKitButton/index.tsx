import { ButtonProps, Button } from '@/base/components/Button';
import { useIsMounted } from '@/base/hooks/useIsMounted';
import { useModal, cx } from '@/index';
import React, { useCallback } from 'react';
import { clsUploadKitButton } from './styles.css';
import { useRouter } from '../RouteProvider/context';
import { routes } from '../RouteProvider';
import { UploadQueueStatus, useUploadQueueStatus } from '@/hooks/useUploadQueueStatus';

export type UploadKitButtonProps = ButtonProps;

export const UploadKitButton = React.forwardRef((props: UploadKitButtonProps, ref: any) => {
  const { className, onClick, children, ...restProps } = props;
  const { onOpen } = useModal();
  const isMounted = useIsMounted();
  const router = useRouter();
  const status = useUploadQueueStatus();
  const onClickButton = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      [UploadQueueStatus.SUCCESS, UploadQueueStatus.FAILED, UploadQueueStatus.EMPTY].includes(
        status,
      )
        ? router.push(routes.DRAG)
        : router.push(routes.UPLOAD);
      onOpen();
      onClick?.(e);
    },
    [onClick, onOpen, router, status],
  );

  if (!isMounted) return null;

  return (
    <Button
      ref={ref}
      className={cx('uk-connect-button', clsUploadKitButton, className)}
      onClick={onClickButton}
      {...restProps}
    >
      {children ? children : 'Upload Images'}
    </Button>
  );
});
