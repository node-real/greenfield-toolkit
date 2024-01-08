import { bsc, mainnet } from 'wagmi/chains';

export const chains = [
  {
    id: 5600,
    name: 'BNB Greenfield Testnet',
    network: 'BNB Greenfield Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
      },
      public: {
        http: ['https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org'],
      },
    },
    blockExplorers: {
      etherscan: {
        name: `BNB Greenfield Testnet Scan`,
        url: 'https://greenfield-chain.bnbchain.org',
      },
      default: {
        name: `BNB Greenfield Testnet Scan`,
        url: 'https://greenfield-chain.bnbchain.org',
      },
    },
  },
  {
    id: 204,
    name: 'opBNB Mainnet',
    network: 'opBNB Mainnet',
    nativeCurrency: {
      name: 'tcBNB',
      symbol: 'tcBNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
      },
      public: {
        http: ['https://opbnb-mainnet-rpc.bnbchain.org'],
      },
    },
    blockExplorers: {
      etherscan: { name: 'opBNBScan', url: `https://mainnet.opbnbscan.com` },
      default: { name: 'opBNBScan', url: `https://mainnet.opbnbscan.com` },
    },
  },
  {
    id: 97,
    name: 'BSC Testnet',
    network: 'BSC Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [`https://data-seed-prebsc-1-s1.binance.org:8545`],
      },
      public: {
        http: [`https://data-seed-prebsc-1-s1.binance.org:8545`],
      },
    },
    blockExplorers: {
      etherscan: { name: 'BSC Testnet Scan', url: `https://testnet.bscscan.com` },
      default: { name: 'BSC Testnet Scan', url: `https://testnet.bscscan.com` },
    },
  },
  bsc,
  mainnet,
];
