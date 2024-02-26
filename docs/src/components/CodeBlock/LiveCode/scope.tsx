import * as icon from '@node-real/icons';
import * as uikit from '@node-real/uikit';
import * as walletkit from '@node-real/walletkit';
import React from 'react';
import * as wagmi from 'wagmi';

import { chains } from '../../UploadKit/chains';

const scope = {
  React,
  chains,
  ...icon,
  ...uikit,
  ...React,
  ...walletkit,
  ...wagmi,
};

export default scope;
