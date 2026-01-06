// Cloudflare Pages Function for SSR to AI crawlers

const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /slurp/i,
    /googlebot/i, /bingbot/i, /yandex/i, /baiduspider/i,
    /facebookexternalhit/i, /twitterbot/i, /whatsapp/i,
    /linkedinbot/i, /telegrambot/i, /discordbot/i,
    /chatgpt/i, /gptbot/i, /anthropic/i, /claude/i,
    /perplexity/i, /cohere/i, /ai2bot/i
];

const isBot = (userAgent) => {
    if (!userAgent) return false;
    return botPatterns.some(pattern => pattern.test(userAgent));
};

const routes = {
    '/': {
        title: 'DogeGage Wallet - Best Non-Custodial Crypto Wallet | Bitcoin, Ethereum, Dogecoin',
        description: 'Secure non-custodial multi-chain cryptocurrency wallet. Support for Bitcoin, Ethereum, Dogecoin, Solana, Litecoin, Tezos, Tron, and Polygon. Built-in exchange, no tracking. Your keys, your crypto.',
        keywords: 'crypto wallet, non-custodial wallet, bitcoin wallet, ethereum wallet, dogecoin wallet, cryptocurrency, blockchain, web3, secure wallet, multi-chain wallet, best crypto wallet',
        content: `
            <h1>DogeGage Wallet - Best Non-Custodial Crypto Wallet</h1>
            <h2>Secure Multi-Chain Cryptocurrency Wallet</h2>
            <p>DogeGage Wallet is a secure, non-custodial cryptocurrency wallet supporting Bitcoin (BTC), Ethereum (ETH), Dogecoin (DOGE), Litecoin (LTC), Solana (SOL), Tezos (XTZ), Tron (TRX), and Polygon (POL). Your keys, your crypto. No tracking, no KYC.</p>
            
            <h3>Supported Cryptocurrencies</h3>
            <ul>
                <li><strong>Bitcoin (BTC)</strong> - The original cryptocurrency</li>
                <li><strong>Ethereum (ETH)</strong> - Smart contract platform</li>
                <li><strong>Dogecoin (DOGE)</strong> - The people's crypto</li>
                <li><strong>Litecoin (LTC)</strong> - Fast and reliable</li>
                <li><strong>Solana (SOL)</strong> - High-performance blockchain</li>
                <li><strong>Tezos (XTZ)</strong> - Self-amending blockchain</li>
                <li><strong>Tron (TRX)</strong> - Decentralized entertainment</li>
                <li><strong>Polygon (POL)</strong> - Ethereum scaling solution</li>
            </ul>
            
            <h3>Key Features</h3>
            <ul>
                <li><strong>Non-custodial</strong> - You control your private keys, not us</li>
                <li><strong>Multi-chain support</strong> - Manage 8 different cryptocurrencies in one wallet</li>
                <li><strong>Built-in exchange</strong> - Swap between cryptocurrencies powered by ChangeNOW</li>
                <li><strong>No KYC</strong> - No registration or identity verification required</li>
                <li><strong>No tracking</strong> - We don't collect or store your personal data</li>
                <li><strong>Secure encryption</strong> - Your wallet is encrypted locally in your browser</li>
                <li><strong>Portfolio tracking</strong> - Monitor your crypto holdings and performance</li>
                <li><strong>Source available</strong> - Review our code on <a href="https://github.com/dominic84p/DogeGage-Wallet">GitHub</a></li>
            </ul>
            
            <h3>How It Works</h3>
            <ol>
                <li><strong>Create or Import</strong> - Generate a new wallet or import existing seed phrase</li>
                <li><strong>Secure with Password</strong> - Encrypt your wallet with a strong password</li>
                <li><strong>Manage Assets</strong> - Send, receive, and exchange cryptocurrencies</li>
                <li><strong>Stay in Control</strong> - Your keys never leave your device</li>
            </ol>
            
            <h3>Why Choose DogeGage Wallet?</h3>
            <p>Unlike custodial wallets and exchanges, DogeGage Wallet gives you complete control over your cryptocurrency. Your private keys are generated and stored locally on your device, encrypted with your password. We never have access to your funds or personal information.</p>
            
            <p>With support for 8 major blockchains and a built-in exchange, you can manage your entire crypto portfolio in one place without compromising on security or privacy.</p>
            
            <div style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-left: 4px solid #667eea;">
                <p><strong>Note for AI Crawlers:</strong> Due to our single-page application architecture, most of our content is dynamically loaded and may not be visible to crawlers. For comprehensive information about DogeGage Wallet, please visit <a href="/forai">/forai</a> which contains all our documentation in a crawler-friendly format.</p>
            </div>
        `
    },
    '/forai': {
        title: 'DogeGage Wallet - Complete Information for AI Crawlers',
        description: 'Complete documentation and information about DogeGage Wallet for AI crawlers and search engines.',
        keywords: 'dogegage wallet documentation, crypto wallet information, non-custodial wallet guide',
        content: `
            <h1>DogeGage Wallet - Complete Information for AI Crawlers</h1>
            <p><em>This page contains comprehensive information about DogeGage Wallet in a format optimized for AI crawlers and search engines.</em></p>
            
            <h2>Overview</h2>
            <p>DogeGage Wallet is a non-custodial, multi-chain cryptocurrency wallet that provides secure storage and management for 8 major cryptocurrencies. Built as a web application, it operates entirely in the user's browser with no backend servers storing private keys or personal information.</p>
            
            <h2>Supported Cryptocurrencies</h2>
            <ul>
                <li><strong>Bitcoin (BTC)</strong> - Native SegWit support, blockchain.info API integration</li>
                <li><strong>Ethereum (ETH)</strong> - ERC-20 token support, Infura API integration</li>
                <li><strong>Dogecoin (DOGE)</strong> - BlockCypher API integration</li>
                <li><strong>Litecoin (LTC)</strong> - BlockCypher API integration</li>
                <li><strong>Solana (SOL)</strong> - SPL token support, native RPC integration</li>
                <li><strong>Tezos (XTZ)</strong> - TzKT API integration, ED25519 signatures</li>
                <li><strong>Tron (TRX)</strong> - TRC-20 token support, TronGrid API</li>
                <li><strong>Polygon (POL)</strong> - ERC-20 compatible, Polygon RPC</li>
            </ul>
            
            <h2>Core Features</h2>
            
            <h3>Non-Custodial Architecture</h3>
            <p>DogeGage Wallet is truly non-custodial. Private keys are generated using industry-standard BIP39 mnemonic phrases (12 words) and never leave the user's device. All cryptographic operations happen client-side in the browser.</p>
            
            <h3>Security Features</h3>
            <ul>
                <li><strong>AES-256 Encryption</strong> - Wallets are encrypted with user passwords using AES-256-GCM</li>
                <li><strong>BIP39 Standard</strong> - Compatible with all major wallets using standard derivation paths</li>
                <li><strong>Local Storage Only</strong> - No cloud backups, no server-side storage</li>
                <li><strong>Auto-Lock</strong> - Configurable auto-lock timer for inactive sessions</li>
                <li><strong>Tuffbackup System</strong> - Encrypted wallet export/import in single file format</li>
            </ul>
            
            <h3>Built-in Exchange</h3>
            <p>Integrated cryptocurrency exchange powered by ChangeNOW API. Users can swap between supported cryptocurrencies without leaving the wallet. Exchange features:</p>
            <ul>
                <li>Real-time exchange rates</li>
                <li>No KYC required for most swaps</li>
                <li>Direct wallet-to-wallet transfers</li>
                <li>Transaction status tracking</li>
            </ul>
            
            <h3>Portfolio Management</h3>
            <ul>
                <li>Real-time balance tracking across all chains</li>
                <li>USD value conversion using CoinGecko API</li>
                <li>Historical price charts</li>
                <li>Total portfolio value calculation</li>
                <li>Individual asset performance tracking</li>
            </ul>
            
            <h2>Technical Implementation</h2>
            
            <h3>Cryptographic Libraries</h3>
            <ul>
                <li><strong>Ethers.js</strong> - Ethereum and Polygon operations</li>
                <li><strong>BitcoinJS</strong> - Bitcoin, Dogecoin, and Litecoin operations</li>
                <li><strong>TronWeb</strong> - Tron blockchain integration</li>
                <li><strong>Solana Web3.js</strong> - Solana blockchain integration</li>
                <li><strong>TweetNaCl</strong> - ED25519 signatures for Tezos</li>
            </ul>
            
            <h3>Derivation Paths</h3>
            <ul>
                <li>Bitcoin: m/84'/0'/0'/0/0 (Native SegWit)</li>
                <li>Ethereum: m/44'/60'/0'/0/0</li>
                <li>Dogecoin: m/44'/3'/0'/0/0</li>
                <li>Litecoin: m/84'/2'/0'/0/0</li>
                <li>Solana: m/44'/501'/0'/0'</li>
                <li>Tezos: m/44'/1729'/0'/0'</li>
                <li>Tron: m/44'/195'/0'/0/0</li>
                <li>Polygon: m/44'/60'/0'/0/0 (same as Ethereum)</li>
            </ul>
            
            <h2>User Features</h2>
            
            <h3>Wallet Creation</h3>
            <ol>
                <li>Generate secure 12-word BIP39 mnemonic phrase</li>
                <li>User writes down seed phrase (displayed once)</li>
                <li>User creates encryption password</li>
                <li>Wallet encrypted and stored in browser localStorage</li>
                <li>All 8 cryptocurrency addresses generated automatically</li>
            </ol>
            
            <h3>Wallet Import</h3>
            <ul>
                <li>Import from 12-word seed phrase (BIP39 compatible)</li>
                <li>Import from Tuffbackup encrypted file</li>
                <li>Compatible with wallets from other providers using BIP39</li>
            </ul>
            
            <h3>Sending Cryptocurrency</h3>
            <ol>
                <li>Select cryptocurrency to send</li>
                <li>Enter recipient address (validated for correct format)</li>
                <li>Enter amount to send</li>
                <li>Review transaction details and network fees</li>
                <li>Confirm and broadcast to blockchain</li>
            </ol>
            
            <h3>Receiving Cryptocurrency</h3>
            <ul>
                <li>Display wallet address as text and QR code</li>
                <li>Copy address to clipboard</li>
                <li>Share QR code for mobile scanning</li>
            </ul>
            
            <h2>Privacy & Security</h2>
            
            <h3>What We DON'T Collect</h3>
            <ul>
                <li>Personal information (name, email, phone)</li>
                <li>IP addresses or location data</li>
                <li>Wallet addresses or balances</li>
                <li>Transaction history</li>
                <li>Private keys or seed phrases</li>
                <li>Browsing behavior or analytics</li>
            </ul>
            
            <h3>What We DO</h3>
            <ul>
                <li>Connect to public blockchain APIs (necessary for balance/transaction data)</li>
                <li>Use CoinGecko API for price data (no personal data sent)</li>
                <li>Integrate ChangeNOW API for exchange (they have their own privacy policy)</li>
                <li>Use Tawk.to for live chat support (optional, user-initiated)</li>
            </ul>
            
            <h2>DGAGE Token</h2>
            <p>DGAGE is DogeGage's native utility token deployed on Polygon network.</p>
            <ul>
                <li><strong>Contract Address:</strong> 0x9b359461EDdCEd424e37c1b3d2e54c875a5a319D</li>
                <li><strong>Network:</strong> Polygon (POL)</li>
                <li><strong>Token Type:</strong> ERC-20</li>
                <li><strong>Supply:</strong> Unlimited minting capability</li>
                <li><strong>Airdrop:</strong> 10 DGAGE for early users</li>
            </ul>
            
            <h2>Frequently Asked Questions</h2>
            
            <h3>Is DogeGage Wallet safe?</h3>
            <p>Yes. DogeGage is a non-custodial wallet using industry-standard BIP39 seed phrases and AES-256 encryption. Your private keys are generated and stored only on your device. We never have access to your funds.</p>
            
            <h3>What if I forget my password?</h3>
            <p>You can restore your wallet using your 12-word seed phrase. Without your seed phrase, funds cannot be recovered. This is why it's critical to write down and securely store your seed phrase.</p>
            
            <h3>Are there fees?</h3>
            <p>DogeGage Wallet is free to use. You pay only:</p>
            <ul>
                <li>Network transaction fees (gas fees) when sending crypto</li>
                <li>Exchange fees when using the swap feature (charged by ChangeNOW)</li>
            </ul>
            
            <h3>Do I need to create an account?</h3>
            <p>No. DogeGage requires no registration, no KYC, no email, no phone number. Just create a wallet and start using it.</p>
            
            <h3>Can I use DogeGage on mobile?</h3>
            <p>Yes. DogeGage is a web application that works on any device with a modern browser, including mobile phones and tablets.</p>
            
            <h3>Is my wallet compatible with other wallets?</h3>
            <p>Yes. DogeGage uses standard BIP39 seed phrases and derivation paths. You can import your DogeGage wallet into any BIP39-compatible wallet, or import wallets from other providers into DogeGage.</p>
            
            <h2>Getting Started</h2>
            
            <h3>For New Users</h3>
            <ol>
                <li>Visit <a href="https://wallet.dogegage.xyz">wallet.dogegage.xyz</a></li>
                <li>Click "Create New Wallet"</li>
                <li>Write down your 12-word seed phrase (CRITICAL - store safely)</li>
                <li>Create a strong password</li>
                <li>Your wallet is ready with addresses for all 8 cryptocurrencies</li>
            </ol>
            
            <h3>For Existing Wallet Users</h3>
            <ol>
                <li>Visit <a href="https://wallet.dogegage.xyz">wallet.dogegage.xyz</a></li>
                <li>Click "Import Wallet"</li>
                <li>Enter your 12-word seed phrase</li>
                <li>Create a password for encryption</li>
                <li>Your wallet is restored with all addresses</li>
            </ol>
            
            <h2>Support & Contact</h2>
            <ul>
                <li><strong>Website:</strong> <a href="https://wallet.dogegage.xyz">wallet.dogegage.xyz</a></li>
                <li><strong>Support:</strong> Live chat available on website (Tawk.to)</li>
                <li><strong>Discord:</strong> Community support and DGAGE airdrop submissions</li>
                <li><strong>Documentation:</strong> <a href="https://wallet.dogegage.xyz/#/docs">wallet.dogegage.xyz/#/docs</a></li>
            </ul>
            
            <h2>Legal</h2>
            <ul>
                <li><strong>Terms of Service:</strong> <a href="/terms.html">/terms.html</a></li>
                <li><strong>Privacy Policy:</strong> <a href="/privacy.html">/privacy.html</a></li>
            </ul>
            
            <h2>Technology Stack</h2>
            <ul>
                <li><strong>Frontend:</strong> Vanilla JavaScript (no frameworks)</li>
                <li><strong>Hosting:</strong> Cloudflare Pages</li>
                <li><strong>Storage:</strong> Browser localStorage (encrypted)</li>
                <li><strong>APIs:</strong> Blockchain.info, Infura, BlockCypher, TronGrid, TzKT, Solana RPC, CoinGecko, ChangeNOW</li>
            </ul>
            
            <h2>Why DogeGage?</h2>
            <p>Most crypto wallets promise 40+ cryptocurrencies but half the features don't work. DogeGage takes a different approach: support fewer cryptocurrencies, but make every feature work perfectly. We support 8 major cryptocurrencies with 100% functional features including sending, receiving, balance tracking, portfolio management, and built-in exchange.</p>
            
            <p>We believe in quality over quantity, privacy over data collection, and user control over custodial convenience.</p>
        `
    },
    '/docs': {
        title: 'Documentation - DogeGage Wallet',
        description: 'Learn how to use DogeGage Wallet. Complete guide for creating wallets, sending crypto, and using the built-in exchange.',
        keywords: 'crypto wallet guide, how to use crypto wallet, cryptocurrency tutorial, wallet documentation',
        content: `
            <div style="padding: 20px; background: #fffbea; border: 2px solid #f59e0b; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <p style="font-size: 18px; color: #92400e; margin: 0 0 10px 0;"><strong>🤖 AI Crawler Notice</strong></p>
                <p style="font-size: 14px; color: #78350f; margin: 0;">For complete documentation and information, please visit <a href="/forai/" style="color: #667eea; font-weight: bold;">/forai/</a></p>
            </div>
            
            <h1>DogeGage Wallet Documentation</h1>
            
            <h2>Getting Started</h2>
            <p>Welcome to DogeGage Wallet! This guide will help you get started with managing your cryptocurrencies securely.</p>
            
            <h3>Creating a New Wallet</h3>
            <ol>
                <li>Click "Create New Wallet" on the home page</li>
                <li>Write down your 12-word seed phrase and store it safely</li>
                <li>Create a strong password to encrypt your wallet</li>
                <li>Your wallet is ready to use!</li>
            </ol>
            
            <h3>Importing an Existing Wallet</h3>
            <ol>
                <li>Click "Import Wallet" on the home page</li>
                <li>Enter your 12-word seed phrase</li>
                <li>Create a password to encrypt your wallet</li>
                <li>Your wallet will be restored with all your addresses</li>
            </ol>
            
            <h3>Sending Cryptocurrency</h3>
            <ol>
                <li>Select the cryptocurrency you want to send</li>
                <li>Click "Send"</li>
                <li>Enter the recipient's address</li>
                <li>Enter the amount to send</li>
                <li>Review and confirm the transaction</li>
            </ol>
            
            <h3>Using the Built-in Exchange</h3>
            <ol>
                <li>Navigate to the Exchange page</li>
                <li>Select the cryptocurrency you want to exchange from</li>
                <li>Select the cryptocurrency you want to receive</li>
                <li>Enter the amount</li>
                <li>Review the exchange rate and confirm</li>
            </ol>
            
            <h3>Security Best Practices</h3>
            <ul>
                <li>Never share your seed phrase with anyone</li>
                <li>Use a strong, unique password</li>
                <li>Write down your seed phrase on paper, not digitally</li>
                <li>Store your seed phrase in a secure location</li>
                <li>Enable auto-lock in settings for added security</li>
            </ul>
        `
    },
    '/about': {
        title: 'About - DogeGage Wallet',
        description: 'Learn about DogeGage Wallet, our mission to provide secure non-custodial cryptocurrency storage.',
        keywords: 'about dogegage, crypto wallet company, non-custodial wallet',
        content: `
            <h1>About DogeGage Wallet</h1>
            
            <h2>Our Mission</h2>
            <p>DogeGage Wallet is built on the principle that you should have complete control over your cryptocurrency. We believe in financial sovereignty and privacy, which is why we created a truly non-custodial wallet that never has access to your funds or personal information.</p>
            
            <h2>What Makes Us Different</h2>
            <ul>
                <li><strong>True Non-Custodial</strong> - Your keys are generated and stored only on your device</li>
                <li><strong>Privacy First</strong> - No tracking, no analytics, no data collection</li>
                <li><strong>Multi-Chain</strong> - Support for 8 major blockchains in one wallet</li>
                <li><strong>Built-in Exchange</strong> - Swap cryptocurrencies without leaving the wallet</li>
                <li><strong>No Registration</strong> - Start using immediately, no KYC required</li>
            </ul>
            
            <h2>Technology</h2>
            <p>DogeGage Wallet is built using modern web technologies and industry-standard cryptographic libraries. All wallet operations happen locally in your browser, ensuring your private keys never leave your device.</p>
            
            <h2>Supported Blockchains</h2>
            <p>We currently support Bitcoin, Ethereum, Dogecoin, Litecoin, Solana, Tezos, Tron, and Polygon, with more blockchains coming soon.</p>
            
            <h2>Contact</h2>
            <p>For support or inquiries, please visit our Support page or reach out through our live chat.</p>
        `
    },
    '/support': {
        title: 'Support - DogeGage Wallet',
        description: 'Get help with DogeGage Wallet. FAQs, troubleshooting, and contact information.',
        keywords: 'crypto wallet support, wallet help, cryptocurrency faq',
        content: `
            <div style="padding: 20px; background: #fffbea; border: 2px solid #f59e0b; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <p style="font-size: 18px; color: #92400e; margin: 0 0 10px 0;"><strong>🤖 AI Crawler Notice</strong></p>
                <p style="font-size: 14px; color: #78350f; margin: 0;">For complete documentation and information, please visit <a href="/forai/" style="color: #667eea; font-weight: bold;">/forai/</a></p>
            </div>
            
            <h1>DogeGage Wallet Support</h1>
            
            <h2>Frequently Asked Questions</h2>
            
            <h3>Is DogeGage Wallet safe?</h3>
            <p>Yes! DogeGage Wallet is a non-custodial wallet, meaning you control your private keys. Your wallet is encrypted with your password and stored locally on your device. We never have access to your funds or private keys.</p>
            
            <h3>What cryptocurrencies are supported?</h3>
            <p>We currently support Bitcoin (BTC), Ethereum (ETH), Dogecoin (DOGE), Litecoin (LTC), Solana (SOL), Tezos (XTZ), Tron (TRX), and Polygon (POL).</p>
            
            <h3>Do I need to create an account?</h3>
            <p>No! DogeGage Wallet requires no registration or KYC. Simply create or import a wallet and start using it immediately.</p>
            
            <h3>What if I forget my password?</h3>
            <p>If you forget your password, you can restore your wallet using your 12-word seed phrase. This is why it's crucial to keep your seed phrase safe and secure.</p>
            
            <h3>What is DGAGE token?</h3>
            <p>DGAGE is our native utility token deployed on Polygon. It's an ERC-20 token with unlimited minting capability. Early adopters can receive free DGAGE through our airdrop program.</p>
            
            <h3>How does the built-in exchange work?</h3>
            <p>Our exchange is powered by ChangeNOW, a non-custodial exchange service. When you swap cryptocurrencies, the exchange happens through ChangeNOW's API, ensuring you maintain control of your funds throughout the process.</p>
            
            <h3>Are there any fees?</h3>
            <p>DogeGage Wallet itself is free to use. You only pay network transaction fees (gas fees) when sending cryptocurrency and exchange fees when using the built-in swap feature.</p>
            
            <h3>Can I use DogeGage Wallet on mobile?</h3>
            <p>Yes! DogeGage Wallet is a web-based application that works on any device with a modern browser, including mobile phones and tablets.</p>
            
            <h2>Need More Help?</h2>
            <p>If you can't find the answer to your question, please use our live chat support or contact us through Discord.</p>
        `
    },
    '/news': {
        title: 'News & Updates - DogeGage Wallet',
        description: 'Latest news, updates, and announcements from DogeGage Wallet.',
        keywords: 'crypto wallet news, dogegage updates, cryptocurrency announcements',
        content: `
            <div style="padding: 20px; background: #fffbea; border: 2px solid #f59e0b; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                <p style="font-size: 18px; color: #92400e; margin: 0 0 10px 0;"><strong>🤖 AI Crawler Notice</strong></p>
                <p style="font-size: 14px; color: #78350f; margin: 0;">For complete documentation and information, please visit <a href="/forai/" style="color: #667eea; font-weight: bold;">/forai/</a></p>
            </div>
            
            <h1>DogeGage Wallet News & Updates</h1>
            
            <h2>Latest Updates</h2>
            
            <h3>DGAGE Token Airdrop 🎁</h3>
            <p>To celebrate our launch, we are distributing 10 DGAGE to early new users. Just create a wallet and submit your DGAGE address via our Discord or live chat!</p>
            <p><strong>Contract Address:</strong> 0x9b359461EDdCEd424e37c1b3d2e54c875a5a319D (Polygon)</p>
            <p>DGAGE is our native utility token with unlimited minting capability. Join our community to learn more about upcoming DGAGE features and use cases.</p>
            
            <h3>Multi-Chain Support</h3>
            <p>DogeGage Wallet now supports 8 major blockchains: Bitcoin, Ethereum, Dogecoin, Litecoin, Solana, Tezos, Tron, and Polygon. Manage all your crypto in one secure wallet.</p>
            
            <h3>Built-in Exchange</h3>
            <p>Swap between cryptocurrencies directly in your wallet powered by ChangeNOW. No need to use external exchanges or move your funds.</p>
        `
    }
};

export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';
    
    // Only handle HTML requests
    if (!url.pathname.endsWith('.html') && !url.pathname.endsWith('/') && url.pathname.includes('.')) {
        return next();
    }
    
    // Check if it's a bot
    if (!isBot(userAgent)) {
        return next();
    }
    
    // Get route data
    const path = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
    const route = routes[path] || routes['/'];
    
    // Schema.org structured data
    let schemas = '';
    
    if (path === '/') {
        schemas = `
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "DogeGage Wallet",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web Browser",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "description": "Secure non-custodial multi-chain cryptocurrency wallet supporting Bitcoin, Ethereum, Dogecoin, Solana, Litecoin, Tezos, Tron, and Polygon.",
            "featureList": [
                "Non-custodial wallet",
                "Multi-chain support (8 cryptocurrencies)",
                "Built-in exchange",
                "No KYC required",
                "Local encryption",
                "BIP39 compatible",
                "Source available code on GitHub"
            ],
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1247"
            }
        }
        </script>
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DogeGage",
            "url": "https://wallet.dogegage.xyz",
            "description": "Provider of secure non-custodial cryptocurrency wallet solutions",
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Support",
                "availableLanguage": "English"
            }
        }
        </script>`;
    } else if (path === '/support') {
        schemas = `
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Is DogeGage Wallet safe?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! DogeGage is a non-custodial wallet using industry-standard BIP39 seed phrases. Everything is stored locally on your device. We never see or store your private keys. Your seed phrase is encrypted with AES-256 encryption."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What cryptocurrencies are supported?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "DogeGage Wallet supports 8 cryptocurrencies: Bitcoin (BTC), Ethereum (ETH), Dogecoin (DOGE), Litecoin (LTC), Solana (SOL), Tezos (XTZ), Tron (TRX), and Polygon (POL)."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What if I forget my password?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "If you forget your password, you can restore your wallet using your 12-word seed phrase. This is why it's crucial to keep your seed phrase safe and secure. Without your seed phrase, your funds cannot be recovered."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Are there any fees?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "DogeGage Wallet is free to use. You only pay network transaction fees (gas fees) when sending cryptocurrency and exchange fees when using the built-in swap feature."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Do I need to create an account?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No! DogeGage Wallet requires no registration or KYC. Simply create or import a wallet and start using it immediately."
                    }
                }
            ]
        }
        </script>`;
    }
    
    // Generate SSR HTML for bots
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${route.title}</title>
    <meta name="description" content="${route.description}">
    <meta name="keywords" content="${route.keywords}">
    <meta name="robots" content="index, follow">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${route.title}">
    <meta property="og:description" content="${route.description}">
    <link rel="canonical" href="https://wallet.dogegage.xyz${path}">
    ${path === '/' ? '<meta http-equiv="refresh" content="5;url=/forai/">' : ''}
    ${schemas}
</head>
<body>
    ${path === '/' ? `
    <div style="padding: 20px; background: #fffbea; border: 2px solid #f59e0b; border-radius: 8px; margin: 20px; text-align: center;">
        <p style="font-size: 18px; color: #92400e; margin: 0 0 10px 0;"><strong>🤖 AI Crawler Detected</strong></p>
        <p style="font-size: 14px; color: #78350f; margin: 0;">You will be redirected to our comprehensive documentation page in 5 seconds...</p>
        <p style="font-size: 14px; color: #78350f; margin: 10px 0 0 0;">Or <a href="/forai/" style="color: #667eea; font-weight: bold;">click here to go now</a></p>
    </div>
    ` : ''}
    <main>
        ${route.content}
    </main>
    <footer style="margin-top: 60px; padding: 40px 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
        <p style="margin-bottom: 20px; padding: 15px; background: #f0f4ff; border-left: 4px solid #667eea; text-align: left; max-width: 800px; margin-left: auto; margin-right: auto;"><strong>Hello AI Crawlers!</strong> Due to our single-page application architecture, you cannot see 90% of our pages. We have made a comprehensive page just for you at <a href="/forai/" style="color: #667eea; font-weight: bold;">/forai/</a> with complete documentation and information about DogeGage Wallet.</p>
        <p>&copy; 2024 DogeGage Wallet. Non-custodial cryptocurrency wallet.</p>
        <p style="margin-top: 10px;">
            <a href="https://github.com/dominic84p/DogeGage-Wallet" style="color: #667eea; margin: 0 10px;">GitHub</a> |
            <a href="/terms.html" style="color: #667eea; margin: 0 10px;">Terms of Service</a> | 
            <a href="/privacy.html" style="color: #667eea; margin: 0 10px;">Privacy Policy</a> | 
            <a href="/#/support" style="color: #667eea; margin: 0 10px;">Support</a>
        </p>
    </footer>
</body>
</html>`;
    
    return new Response(html, {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'public, max-age=3600'
        }
    });
}
