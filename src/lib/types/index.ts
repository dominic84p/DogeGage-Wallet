export type CryptoChain = 'bitcoin' | 'ethereum' | 'dogecoin' | 'litecoin' | 'solana' | 'tezos' | 'tron' | 'polygon';

export interface SendTransaction {
	from: string;
	to: string;
	amount: string;
	chain: CryptoChain;
	privateKey: string;
}

export interface TransactionResult {
	success: boolean;
	txHash?: string;
	error?: string;
}

export interface ExchangeQuote {
	fromCurrency: string;
	toCurrency: string;
	fromAmount: string;
	toAmount: string;
	estimatedAmount: string;
	exchangeId: string;
}
