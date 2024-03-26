import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import dotenv from "dotenv"

dotenv.config()

if (
  process.env.BLAST_MAINNET_RPC === undefined ||
  process.env.MNEMONIC === undefined ||
  process.env.RPC_URL === undefined ||
  process.env.BLAST_TEST_RPC === undefined ||
  process.env.ETHERSCAN_API_KEY === undefined
) {
  throw new Error("Please set your MNEMONIC, RPC_URL and ETHERSCAN_API_KEY in a .env file")
}


const config: HardhatUserConfig = {
  solidity: {
    compilers: [{
      version: "0.6.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
        },
      }
    },
    {
      version: "0.8.0",
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
        },
      }
    },
    {
      version: "0.8.20",
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
        },
      }
    },
    {
      version: "0.5.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 2000,
        },
      }
    }
    ]
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.BLAST_TEST_RPC,
        // blockNumber: 192980,
        blockNumber: 2256130
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      }
    },
    mumbai: {
      url: process.env.RPC_URL,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      }
    },
    blastsepolia: {
      url: process.env.BLAST_TEST_RPC,
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
    },
    blast: {
      url: process.env.BLAST_MAINNET_RPC,
      accounts: {
        mnemonic: process.env.MNEMONIC_MAINNET,
      }
    },
  },
  etherscan: {
    apiKey: {
      blastsepolia: "blast_sepolia", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "blastsepolia",
        chainId: 168587773,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://testnet.blastscan.io"
        }
      }
    ]
  },
};

export default config;
