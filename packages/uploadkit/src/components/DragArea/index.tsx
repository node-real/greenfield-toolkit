import { Box, BoxProps } from '@/base/components/Box';
import { cx } from '@/utils/css';
import React from 'react';
import {
  clsDragArea,
  clsDragAreaContainer,
  clsDragAreaDisable,
  clsDragAreaDragging,
  clsDragAreaInput,
  clsDragAreaLink,
  clsDragAreaSm,
  clsDragAreaText,
  clsDragAreaTitle,
} from './style.css';
import { useUpload } from '../UploadProvider';
import { ObjectsIcon } from '@/base/icons/ObjectsIcon';
import { Text } from '@/base/components/Text';
import { WaitObject } from '../UploadProvider/types';
import { TransferItemFlat, flattenTransferItems, validateFile } from '@/utils/object';
import { useUploadKitContext } from '../UploadKitProvider/context';
import { RECOMMEND_MAX_OBJECT_SIZE } from '@/defaultConfig/getDefaultProviderOptions';
import { useUploadDisable } from '@/hooks/useUploadDisable';

export type DragAreaProps = BoxProps;
export function DragArea(props: DragAreaProps) {
  const { className, ...restProps } = props;
  const input = React.useRef<HTMLInputElement>(null);
  const drag = React.useRef<HTMLDivElement>(null);
  const drop = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const { dragAreaDisabled } = useUploadDisable();
  const { state, dispatch } = useUpload();
  const {
    options: { maxObjectSize, maxObjectCount, onError },
  } = useUploadKitContext();
  const errorHandler = (errorMsg: string) => {
    onError && onError(errorMsg);
  };
  React.useEffect(() => {
    drop && drop.current && drop.current.addEventListener('dragover', handleDragOver);
    drop && drop.current && drop.current.addEventListener('drop', handleDrop);
    drop && drop.current && drop.current.addEventListener('dragenter', handleDragEnter);
    drop && drop.current && drop.current.addEventListener('dragleave', handleDragLeave);

    return () => {
      drop && drop.current && drop.current.removeEventListener('dragover', handleDragOver);
      drop && drop.current && drop.current.removeEventListener('drop', handleDrop);
      drop && drop.current && drop.current.removeEventListener('dragenter', handleDragEnter);
      drop && drop.current && drop.current.removeEventListener('dragleave', handleDragLeave);
    };
  }, [dragAreaDisabled]);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const { items } = e.dataTransfer || {};

    if (!items) return;
    const objects = await flattenTransferItems(items);
    handleSelectFiles(objects);
  };

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // if (e.target !== drag.current) {
    setDragging(true);
    // onDragEnter && onDragEnter();
    // }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // if (e.target === drag.current) {
    setDragging(false);
    // onDragLeave && onDragLeave();
    // }
  };

  const handleSelectFiles = (files: FileList | TransferItemFlat) => {
    if (dragAreaDisabled) return;
    const queue = [] as WaitObject[];
    if (maxObjectCount && Object.keys(files).length > maxObjectCount) {
      return errorHandler(
        `Please limit the upload to a maximum of ${maxObjectCount} objects at a time.`,
      );
    }
    Object.values(files).forEach((file: File) => {
      const errorMsg = validateFile(file, maxObjectSize || RECOMMEND_MAX_OBJECT_SIZE);
      const time = +new Date();
      const id = parseInt(String(time * Math.random()));
      queue.push({
        file,
        status: errorMsg ? 'ERROR' : 'WAIT',
        id,
        time,
        msg: errorMsg || '',
        type: file.type,
        size: file.size,
        name: file.name,
        relativePath: '',
      });
    });
    dispatch({
      type: 'SET_WAIT_QUEUE',
      payload: queue,
    });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    handleSelectFiles(files);
  };
  const openFileDialog = () => {
    input && input.current && input.current.click();
  };

  const hasWaitQueue = state.waitQueue && state.waitQueue.length > 0;

  const ukDragAreaStyle = React.useMemo(() => {
    return cx(
      clsDragArea,
      !dragAreaDisabled && dragging ? clsDragAreaDragging : '',
      hasWaitQueue ? clsDragAreaSm : '',
    );
  }, [dragAreaDisabled, dragging, hasWaitQueue]);

  const disableStyle = dragAreaDisabled ? clsDragAreaDisable : '';

  return (
    <Box
      className={cx('uk-drag-area-container', clsDragAreaContainer)}
      ref={drop}
      onClick={openFileDialog}
    >
      <input
        ref={input}
        type="file"
        className={cx('uk-drag-area-input', clsDragAreaInput)}
        multiple={true}
        onChange={onInputChange}
      />
      <Box className={cx('uk-drag-area', ukDragAreaStyle, className)} {...restProps}>
        <ObjectsIcon width={hasWaitQueue ? 24 : 48} height={hasWaitQueue ? 24 : 48} />
        <Text className={cx('uk-drag-area-title', clsDragAreaTitle, disableStyle)}>
          Drag and drop here
        </Text>
        <Box>
          <Text className={cx('uk-drag-area-text', clsDragAreaText, disableStyle)}>or </Text>
          <Text className={cx('uk-drag-box-link', clsDragAreaLink, disableStyle)}>
            browse files
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
