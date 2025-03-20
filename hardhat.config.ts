import { HardhatUserConfig } from 'hardhat/types';
import { accounts } from './helpers/test-wallets';
import { NETWORKS_RPC_URL } from './helper-hardhat-config';

import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomicfoundation/hardhat-chai-matchers';
import '@typechain/hardhat';
import '@tenderly/hardhat-tenderly';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';

import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const MAINNET_FORK = process.env.MAINNET_FORK === 'true';
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT || '';
const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME || '';
const TENDERLY_FORK_NETWORK_ID = process.env.TENDERLY_FORK_NETWORK_ID || '1';
const REPORT_GAS = process.env.REPORT_GAS === 'true';

const mainnetFork = MAINNET_FORK
  ? {
      blockNumber: 12012081,
      url: NETWORKS_RPC_URL['main'],
    }
  : undefined;

// export hardhat config
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: { enabled: true, runs: 25000 },
          evmVersion: 'london',
        },
      },
    ],
  },
  tenderly: {
    project: TENDERLY_PROJECT,
    username: TENDERLY_USERNAME,
    forkNetwork: TENDERLY_FORK_NETWORK_ID,
  },
  typechain: {
    outDir: 'types',
    externalArtifacts: [
      'node_modules/@modus-finance/core-v3/artifacts/contracts/**/*[!dbg].json',
      'node_modules/@modus-finance/core-v3/artifacts/contracts/**/**/*[!dbg].json',
      'node_modules/@modus-finance/core-v3/artifacts/contracts/**/**/**/*[!dbg].json',
      'node_modules/@modus-finance/core-v3/artifacts/contracts/mocks/tokens/WETH9Mocked.sol/WETH9Mocked.json',
    ],
  },
  gasReporter: {
    enabled: REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API,
  },
  networks: {
    hardhat: {
      hardfork: 'berlin',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      chainId: 31337,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
      forking: mainnetFork,
      allowUnlimitedContractSize: true,
    },
    ganache: {
      url: 'http://ganache:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
  mocha: {
    timeout: 80000,
    bail: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    aclAdmin: {
      default: 0,
    },
    emergencyAdmin: {
      default: 0,
    },
    poolAdmin: {
      default: 0,
    },
    addressesProviderRegistryOwner: {
      default: 0,
    },
    treasuryProxyAdmin: {
      default: 1,
    },
    incentivesProxyAdmin: {
      default: 1,
    },
    incentivesEmissionManager: {
      default: 0,
    },
    incentivesRewardsVault: {
      default: 2,
    },
  },
  // Need to compile aave-v3 contracts due no way to import external artifacts for hre.ethers
  dependencyCompiler: {
    paths: [
      '@modus-finance/core-v3/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol',
      '@modus-finance/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol',
      '@modus-finance/core-v3/contracts/misc/AaveOracle.sol',
      '@modus-finance/core-v3/contracts/protocol/tokenization/AToken.sol',
      '@modus-finance/core-v3/contracts/protocol/tokenization/DelegationAwareAToken.sol',
      '@modus-finance/core-v3/contracts/protocol/tokenization/StableDebtToken.sol',
      '@modus-finance/core-v3/contracts/protocol/tokenization/VariableDebtToken.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/GenericLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/ValidationLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/ReserveLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/SupplyLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/EModeLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/BorrowLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/BridgeLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/logic/FlashLoanLogic.sol',
      '@modus-finance/core-v3/contracts/protocol/pool/Pool.sol',
      '@modus-finance/core-v3/contracts/protocol/pool/PoolConfigurator.sol',
      '@modus-finance/core-v3/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol',
      '@modus-finance/core-v3/contracts/dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol',
      '@modus-finance/core-v3/contracts/protocol/libraries/aave-upgradeability/InitializableImmutableAdminUpgradeabilityProxy.sol',
      '@modus-finance/core-v3/contracts/deployments/ReservesSetupHelper.sol',
      '@modus-finance/core-v3/contracts/misc/AaveProtocolDataProvider.sol',
      '@modus-finance/core-v3/contracts/protocol/configuration/ACLManager.sol',
      '@modus-finance/core-v3/contracts/dependencies/weth/WETH9.sol',
      '@modus-finance/core-v3/contracts/mocks/helpers/MockIncentivesController.sol',
      '@modus-finance/core-v3/contracts/mocks/helpers/MockReserveConfiguration.sol',
      '@modus-finance/core-v3/contracts/mocks/oracle/CLAggregators/MockAggregator.sol',
      '@modus-finance/core-v3/contracts/mocks/tokens/MintableERC20.sol',
      '@modus-finance/core-v3/contracts/mocks/flashloan/MockFlashLoanReceiver.sol',
      '@modus-finance/core-v3/contracts/mocks/tokens/WETH9Mocked.sol',
      '@modus-finance/core-v3/contracts/mocks/upgradeability/MockVariableDebtToken.sol',
      '@modus-finance/core-v3/contracts/mocks/upgradeability/MockAToken.sol',
      '@modus-finance/core-v3/contracts/mocks/upgradeability/MockStableDebtToken.sol',
      '@modus-finance/core-v3/contracts/mocks/upgradeability/MockInitializableImplementation.sol',
      '@modus-finance/core-v3/contracts/mocks/helpers/MockPool.sol',
      '@modus-finance/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20Detailed.sol',
      '@modus-finance/core-v3/contracts/mocks/oracle/PriceOracle.sol',
      '@modus-finance/core-v3/contracts/mocks/tokens/MintableDelegationERC20.sol',
    ],
  },
  external: {
    contracts: [
      {
        artifacts: './temp-artifacts',
        deploy: 'node_modules/@aave/deploy-v3/dist/deploy',
      },
    ],
  },
};

export default config;
