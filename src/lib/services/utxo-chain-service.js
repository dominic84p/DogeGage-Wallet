/**
 * Unified UTXO Chain Service
 * Handles Bitcoin, Litecoin, Dogecoin address derivation, balance, and transactions
 */

const CHAIN_CONFIGS = {
	bitcoin: {
		name: 'Bitcoin',
		symbol: 'BTC',
		coinType: 0,
		derivationPath: "m/44'/0'/0'/0/0",
		network: null, // Use default bitcoinjs network
		coingeckoId: 'bitcoin',
		balanceApi: 'https://blockchain.info/q/addressbalance/',
		txApi: 'https://blockchain.info/rawaddr/',
		blockchairEndpoint: 'bitcoin',
		defaultPrice: 95000
	},
	litecoin: {
		name: 'Litecoin',
		symbol: 'LTC',
		coinType: 2,
		derivationPath: "m/44'/2'/0'/0/0",
		network: {
			messagePrefix: '\x19Litecoin Signed Message:\n',
			bech32: 'ltc',
			bip32: { public: 0x019da462, private: 0x019d9cfe },
			pubKeyHash: 0x30,
			scriptHash: 0x32,
			wif: 0xb0
		},
		coingeckoId: 'litecoin',
		blockchairEndpoint: 'litecoin',
		blockcypherEndpoint: 'ltc',
		defaultPrice: 100
	},
	dogecoin: {
		name: 'Dogecoin',
		symbol: 'DOGE',
		coinType: 3,
		derivationPath: "m/44'/3'/0'/0/0",
		network: {
			messagePrefix: '\x19Dogecoin Signed Message:\n',
			bech32: 'doge',
			bip32: { public: 0x02facafd, private: 0x02fac398 },
			pubKeyHash: 0x1e,
			scriptHash: 0x16,
			wif: 0x9e
		},
		coingeckoId: 'dogecoin',
		blockchairEndpoint: 'dogecoin',
		blockcypherEndpoint: 'doge',
		defaultPrice: 0.08
	}
};

class UtxoChainService {
	constructor(chain) {
		this.chain = chain;
		this.config = CHAIN_CONFIGS[chain];
		if (!this.config) {
			throw new Error(`Unsupported UTXO chain: ${chain}`);
		}
		this.cachedPrice = this.config.defaultPrice;
	}

	/**
	 * Derive address from mnemonic
	 */
	deriveAddress(mnemonic) {
		const { ethers, bitcoin } = window.cryptoLibs;

		const seed = ethers.utils.mnemonicToSeed(mnemonic);
		const seedBuffer = Buffer.from(seed.slice(2), 'hex');
		const root = bitcoin.bip32.fromSeed(seedBuffer, this.config.network);
		const child = root.derivePath(this.config.derivationPath);

		const { address } = bitcoin.payments.p2pkh({
			pubkey: child.publicKey,
			network: this.config.network || bitcoin.networks.bitcoin
		});

		return {
			address: address,
			publicKey: child.publicKey.toString('hex')
		};
	}

	/**
	 * Get balance in native units
	 */
	async getBalance(address) {
		try {
			// Try Blockchair first
			if (this.config.blockchairEndpoint) {
				try {
					const url = `https://wallet-api.therealdominic84plays.workers.dev/api/blockchair/${this.config.blockchairEndpoint}/${address}`;
					const response = await fetch(url);
					const data = await response.json();

					if (data?.data?.[address]?.address?.balance) {
						const balance = data.data[address].address.balance / 100000000;
						return balance.toFixed(8);
					}
				} catch (err) {
					console.warn(`Blockchair failed for ${this.chain}:`, err);
				}
			}

			// Bitcoin-specific fallback
			if (this.chain === 'bitcoin' && this.config.balanceApi) {
				const response = await fetch(this.config.balanceApi + address);
				const satoshis = await response.text();
				return (parseInt(satoshis) / 100000000).toFixed(8);
			}

			// BlockCypher fallback for LTC/DOGE
			if (this.config.blockcypherEndpoint) {
				const response = await fetch(`https://api.blockcypher.com/v1/${this.config.blockcypherEndpoint}/main/addrs/${address}/balance`);
				const data = await response.json();

				if (data?.final_balance !== undefined) {
					return (data.final_balance / 100000000).toFixed(8);
				}
			}

			return '0.00000000';
		} catch (error) {
			console.error(`Failed to fetch ${this.config.name} balance:`, error);
			return '0.00000000';
		}
	}

	/**
	 * Get balance with USD value
	 */
	async getBalanceUSD(address) {
		const balance = await this.getBalance(address);

		try {
			const response = await fetch(`https://wallet-api.therealdominic84plays.workers.dev/api/coingecko/prices?ids=${this.config.coingeckoId}`);
			const data = await response.json();
			const price = data[this.config.coingeckoId]?.usd;

			if (price && price > 0) {
				this.cachedPrice = price;
			}

			return {
				balance: balance,
				balanceUSD: (parseFloat(balance) * this.cachedPrice).toFixed(2),
				price: this.cachedPrice
			};
		} catch (error) {
			console.error(`Failed to get ${this.config.name} price:`, error);
			return {
				balance: balance,
				balanceUSD: (parseFloat(balance) * this.cachedPrice).toFixed(2),
				price: this.cachedPrice
			};
		}
	}

	/**
	 * Get recent transactions
	 */
	async getTransactions(address) {
		try {
			// Bitcoin-specific API
			if (this.chain === 'bitcoin' && this.config.txApi) {
				const response = await fetch(`${this.config.txApi}${address}?limit=10`);
				const data = await response.json();

				if (data.txs) {
					return data.txs.map(tx => {
						const isSent = tx.inputs.some(input => input.prev_out?.addr === address);
						const value = isSent
							? tx.inputs.reduce((sum, input) => input.prev_out?.addr === address ? sum + input.prev_out.value : sum, 0)
							: tx.out.reduce((sum, output) => output.addr === address ? sum + output.value : sum, 0);

						return {
							hash: tx.hash,
							value: (value / 100000000).toFixed(8),
							timestamp: tx.time * 1000,
							type: isSent ? 'sent' : 'received'
						};
					});
				}
			}

			// BlockCypher for LTC/DOGE
			if (this.config.blockcypherEndpoint) {
				const response = await fetch(`https://api.blockcypher.com/v1/${this.config.blockcypherEndpoint}/main/addrs/${address}/full?limit=10`);
				const data = await response.json();

				if (data?.txs) {
					return data.txs.map(tx => {
						const isSent = tx.inputs.some(input => input.addresses?.includes(address));

						let value = 0;
						if (isSent) {
							value = tx.inputs
								.filter(input => input.addresses?.includes(address))
								.reduce((sum, input) => sum + (input.output_value || 0), 0);
						} else {
							value = tx.outputs
								.filter(output => output.addresses?.includes(address))
								.reduce((sum, output) => sum + (output.value || 0), 0);
						}

						return {
							hash: tx.hash,
							timestamp: new Date(tx.confirmed || tx.received).getTime(),
							type: isSent ? 'sent' : 'received',
							value: (value / 100000000).toFixed(8)
						};
					});
				}
			}

			return [];
		} catch (error) {
			console.error(`Failed to fetch ${this.config.name} transactions:`, error);
			return [];
		}
	}
}

// Export individual chain classes for backwards compatibility
class BitcoinService extends UtxoChainService {
	constructor() {
		super('bitcoin');
	}
}

class LitecoinService extends UtxoChainService {
	constructor() {
		super('litecoin');
	}
}

class DogecoinService extends UtxoChainService {
	constructor() {
		super('dogecoin');
	}
}

// Export for ES modules
export { UtxoChainService, BitcoinService, DogecoinService, LitecoinService };

// SECURITY FIX 3: window.* globals removed — use ES module imports instead

