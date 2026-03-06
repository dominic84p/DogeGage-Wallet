// Load all wallet services globally
// This makes them available as window.ServiceName

// Import all service files
import('/src/lib/services/utxo-chain-service.js').then(module => {
	window.UTXOChainService = module.UTXOChainService || window.UTXOChainService;
});

import('/src/lib/services/evm-chain-service.js').then(module => {
	window.EVMChainService = module.EVMChainService || window.EVMChainService;
});

import('/src/lib/services/solana-service.js').then(module => {
	window.SolanaService = module.SolanaService || window.SolanaService;
});

import('/src/lib/services/tezos-service.js').then(module => {
	window.TezosService = module.TezosService || window.TezosService;
});

import('/src/lib/services/tron-service.js').then(module => {
	window.TronService = module.TronService || window.TronService;
});

import('/src/lib/services/dgage-service.js').then(module => {
	window.DGAGEService = module.DGAGEService || window.DGAGEService;
});

console.log('Wallet services loaded globally');
