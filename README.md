# DogeGage Wallet

A non-custodial, multi-chain cryptocurrency wallet. Your keys, your crypto.

🌐 **Live:** [wallet.dogegage.xyz](https://wallet.dogegage.xyz)

## Supported Cryptocurrencies

- Bitcoin (BTC)
- Ethereum (ETH)
- Dogecoin (DOGE)
- Litecoin (LTC)
- Solana (SOL)
- Tezos (XTZ)
- Tron (TRX)
- Polygon (POL)

## Features

- **Non-custodial** - Private keys never leave your device
- **Multi-chain** - 8 cryptocurrencies in one wallet
- **Built-in exchange** - Swap via ChangeNOW
- **No KYC** - No registration required
- **No tracking** - We don't collect data
- **BIP39 compatible** - Works with other wallets

## Tech Stack

- Vanilla JavaScript (no frameworks)
- Cloudflare Pages hosting
- Ethers.js, BitcoinJS, TronWeb, Solana Web3.js
- CoinGecko API for prices
- ChangeNOW API for exchange

## Running Locally

```bash
# Any static server works
python3 -m http.server 8080
# or
npx serve
```

Then open `http://localhost:8080`

## Project Structure

```
├── index.html          # Main entry point
├── app.js              # App initialization
├── src/
│   ├── core/
│   │   ├── js/         # Core services (wallet, router)
│   │   └── pages/      # Page components
│   ├── services/       # Blockchain services
│   └── css/            # Styles
├── functions/          # Cloudflare Pages Functions (SSR)
└── worker.js           # API proxy (not included - contains keys)
```

## License

**Source Available** - See [LICENSE](LICENSE)

You can view, fork, and modify for personal use. You cannot host as a public service or redistribute commercially.

## Links

- Website: [wallet.dogegage.xyz](https://wallet.dogegage.xyz)
- Docs: [/forai](https://wallet.dogegage.xyz/forai/)
