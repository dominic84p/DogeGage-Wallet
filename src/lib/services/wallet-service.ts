import { wallet, isUnlocked, balancesLoading } from '$lib/stores/wallet';
import { get } from 'svelte/store';
import { BitcoinService, DogecoinService, LitecoinService } from './utxo-chain-service.js';
import { EthereumService, PolygonService, EVMChainService } from './evm-chain-service.js';
import { SolanaService } from './solana-service.js';
import { TezosService } from './tezos-service.js';
import { TronService } from './tron-service.js';
import { DGAGEService } from './dgage-service.js';

// SECURITY: HMAC key for cached balance integrity (generated per-session)
let _sessionHmacKey: CryptoKey | null = null;

async function getSessionHmacKey(): Promise<CryptoKey> {
	if (_sessionHmacKey) return _sessionHmacKey;

	// Generate a random key per session for HMAC on cached balances
	_sessionHmacKey = await crypto.subtle.generateKey(
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign', 'verify']
	);
	return _sessionHmacKey;
}

async function computeHmac(data: string): Promise<string> {
	const key = await getSessionHmacKey();
	const encoded = new TextEncoder().encode(data);
	const sig = await crypto.subtle.sign('HMAC', key, encoded);
	return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function verifyHmac(data: string, hmac: string): Promise<boolean> {
	const key = await getSessionHmacKey();
	const encoded = new TextEncoder().encode(data);
	const sigBytes = Uint8Array.from(atob(hmac), c => c.charCodeAt(0));
	return crypto.subtle.verify('HMAC', key, sigBytes, encoded);
}

class WalletService {
	private isFetching = false;

	constructor() {
		// Services imported as ES modules — no window globals needed
	}

	async importFromSeed(mnemonic: string) {
		// @ts-ignore - cryptoLibs loaded from CDN in app.html
		if (!window.cryptoLibs) {
			throw new Error('Crypto libraries not loaded');
		}

		// @ts-ignore
		const { ethers } = window.cryptoLibs;

		// Validate mnemonic (ethers v5 syntax)
		try {
			ethers.utils.HDNode.fromMnemonic(mnemonic);
		} catch (e) {
			throw new Error('Invalid seed phrase');
		}

		// Instantiate chain services via ES module imports (no window polling)
		const bitcoinService = new BitcoinService();
		const dogecoinService = new DogecoinService();
		const litecoinService = new LitecoinService();
		const ethereumService = new EthereumService();
		const polygonService = new PolygonService();
		const solanaService = new SolanaService();
		const tezosService = new TezosService();
		const tronService = new TronService();

		// Derive addresses only — no private keys stored
		const ethData = ethereumService.deriveAddress(mnemonic);
		const btcData = bitcoinService.deriveAddress(mnemonic);
		const dogeData = dogecoinService.deriveAddress(mnemonic);
		const ltcData = litecoinService.deriveAddress(mnemonic);
		const xtzData = await tezosService.deriveAddress(mnemonic);
		const trxData = tronService.deriveAddress(mnemonic);
		const solData = await solanaService.deriveAddress(mnemonic);

		// SECURITY: Only store addresses and public data — NO mnemonic, NO privateKey
		const newWallet = {
			bitcoin: {
				address: btcData.address,
				balance: '0.00000000',
				balanceUSD: '0.00',
				transactions: []
			},
			dogecoin: {
				address: dogeData.address,
				balance: '0.00000000',
				balanceUSD: '0.00',
				transactions: []
			},
			litecoin: {
				address: ltcData.address,
				balance: '0.00000000',
				balanceUSD: '0.00',
				transactions: []
			},
			ethereum: {
				address: ethData.address,
				balance: '0.0000',
				balanceUSD: '0.00',
				transactions: []
			},
			polygon: {
				address: ethData.address,
				balance: '0.00000000',
				balanceUSD: '0.00',
				transactions: []
			},
			dgage: {
				address: ethData.address,
				balance: '0.0000',
				balanceUSD: '0.00',
				transactions: []
			},
			tezos: {
				address: xtzData.address,
				balance: '0.000000',
				balanceUSD: '0.00',
				transactions: []
			},
			tron: {
				address: trxData.address,
				balance: '0.000000',
				balanceUSD: '0.00',
				transactions: []
			},
			solana: {
				address: solData.address,
				balance: '0.000000',
				balanceUSD: '0.00',
				transactions: []
			}
		};

		wallet.set(newWallet);
		isUnlocked.set(true);
		sessionStorage.setItem('walletUnlocked', 'true');

		return newWallet;
	}

	async fetchBalances() {
		const currentWallet = get(wallet);
		if (!currentWallet) {
			return;
		}

		if (this.isFetching) {
			return;
		}

		this.isFetching = true;
		balancesLoading.set(true);

		try {
			// Instantiate via ES module imports
			const bitcoinService = new BitcoinService();
			const dogecoinService = new DogecoinService();
			const litecoinService = new LitecoinService();
			const ethereumService = new EVMChainService('ethereum');
			const polygonService = new EVMChainService('polygon');
			const solanaService = new SolanaService();
			const tezosService = new TezosService();
			const tronService = new TronService();
			const dgageService = new DGAGEService();

			// Fetch all balances in parallel
			const [btcBalance, dogeBalance, ltcBalance, ethBalance, polBalance, solBalance, xtzBalance, trxBalance, dgageBalance] = await Promise.all([
				bitcoinService.getBalanceUSD(currentWallet.bitcoin.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				dogecoinService.getBalanceUSD(currentWallet.dogecoin.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				litecoinService.getBalanceUSD(currentWallet.litecoin.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				ethereumService.getBalanceUSD(currentWallet.ethereum.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				polygonService.getBalanceUSD(currentWallet.polygon.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				solanaService.getBalanceUSD(currentWallet.solana.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				tezosService.getBalanceUSD(currentWallet.tezos.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				tronService.getBalanceUSD(currentWallet.tron.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; }),
				dgageService.getBalanceUSD(currentWallet.dgage.address).catch((e: any) => { return { balance: '0', balanceUSD: '0' }; })
			]);

			// Update wallet with new balances
			const updatedWallet = {
				...currentWallet,
				bitcoin: { ...currentWallet.bitcoin, balance: btcBalance.balance, balanceUSD: btcBalance.balanceUSD },
				dogecoin: { ...currentWallet.dogecoin, balance: dogeBalance.balance, balanceUSD: dogeBalance.balanceUSD },
				litecoin: { ...currentWallet.litecoin, balance: ltcBalance.balance, balanceUSD: ltcBalance.balanceUSD },
				ethereum: { ...currentWallet.ethereum, balance: ethBalance.balance, balanceUSD: ethBalance.balanceUSD },
				polygon: { ...currentWallet.polygon, balance: polBalance.balance, balanceUSD: polBalance.balanceUSD },
				dgage: { ...currentWallet.dgage, balance: dgageBalance.balance, balanceUSD: dgageBalance.balanceUSD },
				solana: { ...currentWallet.solana, balance: solBalance.balance, balanceUSD: solBalance.balanceUSD },
				tezos: { ...currentWallet.tezos, balance: xtzBalance.balance, balanceUSD: xtzBalance.balanceUSD },
				tron: { ...currentWallet.tron, balance: trxBalance.balance, balanceUSD: trxBalance.balanceUSD }
			};

			wallet.set(updatedWallet);
			this.cacheBalances(updatedWallet);
		} catch (error) {
			// Error handled silently — balances will stay at cached values
		} finally {
			this.isFetching = false;
			balancesLoading.set(false);
		}
	}

	saveToStorage(walletData: any) {
		// Don't save wallet data to storage anymore
		// Only the encrypted seed phrase is stored (handled by encryption service)
		// Cache balances separately for faster loading
		this.cacheBalances(walletData);
	}

	loadFromStorage(): any | null {
		// Wallet is not stored - must unlock with password
		// This method now only loads cached balances
		return null;
	}

	// SECURITY FIX 7: HMAC integrity on cached balances
	async cacheBalances(walletData: any) {
		if (!walletData) return;

		const cache: Record<string, any> = {
			ethereum: {
				balance: walletData.ethereum.balance,
				balanceUSD: walletData.ethereum.balanceUSD
			},
			bitcoin: {
				balance: walletData.bitcoin.balance,
				balanceUSD: walletData.bitcoin.balanceUSD
			},
			dogecoin: {
				balance: walletData.dogecoin.balance,
				balanceUSD: walletData.dogecoin.balanceUSD
			},
			litecoin: {
				balance: walletData.litecoin.balance,
				balanceUSD: walletData.litecoin.balanceUSD
			},
			tezos: {
				balance: walletData.tezos.balance,
				balanceUSD: walletData.tezos.balanceUSD
			},
			tron: {
				balance: walletData.tron.balance,
				balanceUSD: walletData.tron.balanceUSD
			},
			solana: {
				balance: walletData.solana.balance,
				balanceUSD: walletData.solana.balanceUSD
			},
			polygon: {
				balance: walletData.polygon.balance,
				balanceUSD: walletData.polygon.balanceUSD
			},
			dgage: {
				balance: walletData.dgage.balance,
				balanceUSD: walletData.dgage.balanceUSD
			},
			timestamp: Date.now()
		};

		const cacheJson = JSON.stringify(cache);
		const hmac = await computeHmac(cacheJson);

		localStorage.setItem('cachedBalances', JSON.stringify({ data: cacheJson, hmac }));
	}

	async loadCachedBalances(): Promise<any | null> {
		try {
			const cached = localStorage.getItem('cachedBalances');
			if (!cached) return null;

			const envelope = JSON.parse(cached);

			// SECURITY: Verify HMAC before trusting cached data
			if (!envelope.data || !envelope.hmac) {
				// Legacy format without HMAC — discard
				localStorage.removeItem('cachedBalances');
				return null;
			}

			const valid = await verifyHmac(envelope.data, envelope.hmac);
			if (!valid) {
				// Tampered data — discard
				localStorage.removeItem('cachedBalances');
				return null;
			}

			const data = JSON.parse(envelope.data);

			// Check if cache is less than 5 minutes old
			const age = Date.now() - data.timestamp;
			if (age > 5 * 60 * 1000) {
				return null;
			}

			return data;
		} catch (error) {
			return null;
		}
	}

	lock() {
		wallet.set(null);
		isUnlocked.set(false);
		sessionStorage.removeItem('walletUnlocked');
		// Reset session HMAC key on lock
		_sessionHmacKey = null;
	}

	getWallet() {
		const walletData = get(wallet);

		// Migration: Fix object addresses for dogecoin and litecoin
		if (walletData) {
			let needsUpdate = false;

			if (walletData.dogecoin && typeof walletData.dogecoin.address === 'object') {
				walletData.dogecoin.address = (walletData.dogecoin.address as any).address || '';
				needsUpdate = true;
			}
			if (walletData.litecoin && typeof walletData.litecoin.address === 'object') {
				walletData.litecoin.address = (walletData.litecoin.address as any).address || '';
				needsUpdate = true;
			}

			// Update store if migration happened
			if (needsUpdate) {
				wallet.set(walletData);
			}
		}

		return walletData;
	}
}


export const walletService = new WalletService();
