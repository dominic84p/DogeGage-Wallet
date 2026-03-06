/**
 * Unified EVM-based Send Service
 * Handles Ethereum, Polygon (and any other EVM chains)
 * SECURITY: Derives private key on-demand, clears after use
 */

import { walletService } from '../wallet-service';
import { deriveEvmPrivateKey } from '../key-derivation-service';

// Network configurations
const NETWORKS = {
	ethereum: {
		name: 'ethereum',
		chainId: 1,
		rpcUrl: null, // Will use Infura
		nativeCurrency: 'ETH',
		explorer: 'https://etherscan.io/tx/'
	},
	polygon: {
		name: 'polygon',
		chainId: 137,
		rpcUrl: 'https://polygon-rpc.com',
		nativeCurrency: 'POL',
		explorer: 'https://polygonscan.com/tx/'
	}
};

/**
 * Send EVM-based cryptocurrency
 * @param {string} chain - 'ethereum' or 'polygon'
 * @param {string} toAddress - Recipient address
 * @param {string} amount - Amount to send (in base units: ETH, POL)
 */
export async function sendEvm(chain, toAddress, amount) {
	let privateKey = null;
	try {
		const config = NETWORKS[chain];
		if (!config) {
			throw new Error(`Unsupported EVM chain: ${chain}`);
		}

		const wallet = walletService.getWallet();
		if (!wallet) throw new Error('Wallet not found');

		const { ethers } = window.cryptoLibs;

		// SECURITY: Derive private key on-demand
		privateKey = await deriveEvmPrivateKey();

		// Create provider
		let provider;
		if (chain === 'ethereum') {
			provider = new ethers.providers.JsonRpcProvider('https://eth.llamarpc.com');
		} else {
			provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
		}

		// Create wallet from derived private key
		const evmWallet = new ethers.Wallet(privateKey, provider);

		// Convert amount to wei
		const amountWei = ethers.utils.parseEther(amount);

		// Get gas price
		const gasPrice = await provider.getGasPrice();

		// Create transaction
		const tx = {
			to: toAddress,
			value: amountWei,
			gasLimit: 21000,
			gasPrice: gasPrice
		};

		// Send transaction
		const transaction = await evmWallet.sendTransaction(tx);

		// Wait for confirmation
		await transaction.wait();

		return transaction.hash;

	} catch (error) {
		throw error;
	} finally {
		// SECURITY: Clear private key from memory
		privateKey = null;
	}
}

// Export individual chain functions for backwards compatibility
export async function sendEthereum(toAddress, amount) {
	return sendEvm('ethereum', toAddress, amount);
}

export async function sendPolygon(toAddress, amount) {
	return sendEvm('polygon', toAddress, amount);
}
