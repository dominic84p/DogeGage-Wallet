// News Page
function renderNews() {


    // News articles data
    const articles = [
        {
            date: 'January 15, 2026',
            title: 'Passkey Support Added 🔐',
            content: `We've added WebAuthn passkey support for faster and more secure wallet access!

**Features:**
- Unlock wallet with Touch ID, Face ID, or Windows Hello
- Biometric authentication on supported devices
- No need to type password every time
- Fully encrypted and secure
- Works on modern browsers (Chrome, Safari, Edge)

Enable passkeys in Settings > Security to get started. Your wallet remains non-custodial - passkeys just make unlocking faster and easier.`
        },
        {
            date: 'January 12, 2026',
            title: 'Desktop App v1.0 Released 🖥️',
            content: `The DogeGage Desktop App is now available for download!

**Features:**
- Native desktop experience built with Tauri
- All web features plus enhanced security
- Auto-lock functionality
- Encrypted local storage
- Available for Windows, macOS, and Linux

Download now from our Downloads page and enjoy a seamless desktop crypto experience.`
        },
        {
            date: 'January 8, 2026',
            title: 'Auto-Lock Security Feature �',
            content: `New security feature: Auto-lock your wallet after inactivity!

**Configurable Options:**
- Set custom lock timer (1-60 minutes)
- Enable/disable as needed
- Protects your wallet when you step away
- Available in Settings > Security

Keep your crypto safe with automatic wallet locking.`
        },
        {
            date: 'January 5, 2026',
            title: 'Multi-Currency Support Added 💱',
            content: `View your portfolio in your preferred currency!

**Supported Currencies:**
- USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, KRW

Real-time exchange rates powered by our API. Switch currencies anytime from the wallet navigation or settings.`
        },
        {
            date: 'January 2, 2026',
            title: 'Token Scanner Released �',
            content: `Automatic token detection is now live!

DogeGage now automatically scans and displays your ERC-20 tokens on Ethereum and Polygon networks. No manual adding required - if you have tokens, we'll find them.

**Supported Networks:**
- Ethereum (ERC-20)
- Polygon (ERC-20)

More networks coming soon!`
        },
        {
            date: 'December 28, 2025',
            title: 'Tuffbackup System Improved 💾',
            content: `Enhanced backup and recovery system!

**New Features:**
- Encrypted .dogegage backup files
- Password-protected exports
- Easy import/restore process
- Backup verification

Never lose access to your wallet. Export your Tuffbackup today from Settings > Backup & Recovery.`
        },
        {
            date: 'December 21, 2025',
            title: 'DogeGage Wallet Launch 🚀',
            content: `We're excited to announce the official launch of DogeGage Wallet! After months of development and testing, we're ready to provide you with a crypto wallet that actually works.

**What's Included:**
- Support for 8 major cryptocurrencies (BTC, ETH, SOL, DOGE, LTC, XTZ, TRX, POL)
- Built-in exchange powered by ChangeNow
- DogeGage Token (DGAGE) - our native token on Polygon
- Tuffbackup encrypted backup system
- Source available code on GitHub

`
        },
        {
            date: 'December 21, 2025',
            title: 'DGAGE Token Airdrop 🎁',
            content: `To celebrate our launch, we are distributing 10 DGAGE to early new users.
Just create a wallet and submit your DGAGE address via our Discord or live chat!

**Contract Address:** \`0x9b359461EDdCEd424e37c1b3d2e54c875a5a319D\` (Polygon)

DGAGE is our native utility token with unlimited minting capability. Join our community to learn more about upcoming DGAGE features and use cases.`
        },
        {
            date: 'Coming Soon',
            title: 'Roadmap 🗺️',
            content: `Here's what we're working on next:

- Staking support (ETH, SOL, POL, XTZ, TRX)
- Mobile app (iOS & Android)
- Hardware wallet integration
- Buy / Sell Support
- NFT support
- Multi-language support
- Advanced portfolio analytics
- DApp browser integration

Stay tuned for updates!`
        }
    ];

    return `
        <div class="news-page">
            <nav class="landing-nav">
                <div class="landing-logo" onclick="router.navigate('/')" style="cursor: pointer;">
                    <span class="logo-icon">⬢</span>
                    <span>DogeGage Wallet</span>
                </div>
                <div class="landing-nav-links">
                    <button class="nav-link-btn active">News</button>
                    <button class="nav-link-btn" onclick="router.navigate('/docs')">Docs</button>
                    <button class="nav-link-btn" onclick="router.navigate('/support')">Support</button>
                    <button class="nav-link-btn" onclick="router.navigate('/about')">About</button>
                </div>
                <div class="landing-nav-buttons">
                    <button class="btn-nav-outline" onclick="router.navigate('/import')">Import Wallet</button>
                    <button class="btn-nav-primary" onclick="router.navigate('/create')">Create Wallet</button>
                </div>
            </nav>
            
            <div class="page-content">
                <div class="page-hero">
                    <h1>Latest News</h1>
                    <p>Stay updated with DogeGage Wallet developments</p>
                </div>
                
                <div class="news-list">
                    ${articles.map((article, index) => `
                        <article class="news-article ${index === 0 ? 'featured' : ''}">
                            ${index === 0 ? '<div class="news-badge">Latest</div>' : ''}
                            <div class="news-date">${article.date}</div>
                            <h2>${article.title}</h2>
                            <div class="news-content">${formatMarkdown(article.content)}</div>
                        </article>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Simple markdown formatter
function formatMarkdown(text) {
    return text
        // Bold text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Inline code
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Wrap lists in ul
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        // Paragraphs
        .split('\n\n')
        .map(para => {
            if (para.startsWith('<ul>') || para.startsWith('<strong>')) {
                return para;
            }
            return `<p>${para}</p>`;
        })
        .join('');
}
