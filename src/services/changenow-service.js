// ChangeNow Exchange Service
class ChangeNowService {
    constructor() {
        // Use Cloudflare Worker as proxy to hide API key
        this.workerUrl = 'https://wallet-api.therealdominic84plays.workers.dev';
        this.useWorker = true;
    }

    // Get list of available currencies
    async getAvailableCurrencies() {
        try {
            const url = this.useWorker ? 
                `${this.workerUrl}/api/changenow/currencies` :
                'https://api.changenow.io/v2/exchange/currencies?active=true';
            
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch currencies:', error);
            return [];
        }
    }

    // Get minimum exchange amount
    async getMinAmount(fromCurrency, toCurrency) {
        try {
            const url = this.useWorker ?
                `${this.workerUrl}/api/changenow/min-amount/${fromCurrency}_${toCurrency}` :
                `https://api.changenow.io/v2/exchange/min-amount/${fromCurrency}_${toCurrency}`;
            
            const response = await fetch(url);
            const data = await response.json();
            return data.minAmount;
        } catch (error) {
            console.error('Failed to fetch min amount:', error);
            return null;
        }
    }

    // Get estimated exchange amount
    async getEstimate(fromCurrency, toCurrency, amount) {
        try {
            const url = this.useWorker ?
                `${this.workerUrl}/api/changenow/estimate?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${amount}` :
                `https://api.changenow.io/v2/exchange/estimated-amount?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}&fromAmount=${amount}&flow=standard`;
            
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to get estimate:', error);
            return null;
        }
    }

    // Create exchange transaction
    async createExchange(fromCurrency, toCurrency, fromAmount, toAddress, refundAddress) {
        try {
            const url = this.useWorker ?
                `${this.workerUrl}/api/changenow/exchange` :
                'https://api.changenow.io/v2/exchange';
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fromCurrency: fromCurrency,
                    toCurrency: toCurrency,
                    fromAmount: fromAmount,
                    address: toAddress,
                    refundAddress: refundAddress
                })
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to create exchange:', error);
            return null;
        }
    }

    // Get exchange status
    async getExchangeStatus(exchangeId) {
        try {
            const url = this.useWorker ?
                `${this.workerUrl}/api/changenow/status/${exchangeId}` :
                `https://api.changenow.io/v2/exchange/by-id?id=${exchangeId}`;
            
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to get exchange status:', error);
            return null;
        }
    }

    // Map our crypto symbols to ChangeNow symbols
    getCurrencyCode(symbol) {
        const mapping = {
            'BTC': 'btc',
            'DOGE': 'doge',
            'LTC': 'ltc',
            'ETH': 'eth',
            'POL': 'matic', // ChangeNow still uses MATIC for Polygon
            'XTZ': 'xtz',
            'TRX': 'trx',
            'SOL': 'sol'
        };
        return mapping[symbol] || symbol.toLowerCase();
    }
}

const changeNowService = new ChangeNowService();
