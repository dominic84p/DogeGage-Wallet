// News Page
function renderNews() {
    // Load tawk.to chat widget
    loadTawkTo();
    
    // News articles data
    const articles = [
        {
            date: 'December 21, 2025',
            title: 'DogeGage Wallet Launch 🚀',
            content: `We're excited to announce the official launch of DogeGage Wallet! After months of development and testing, we're ready to provide you with a crypto wallet that actually works.

**What's Included:**
- Support for 8 major cryptocurrencies (BTC, ETH, SOL, DOGE, LTC, XTZ, TRX, POL)
- Built-in exchange powered by ChangeNow
- DogeGage Token (DGAGE) - our native token on Polygon
- Tuffbackup encrypted backup system

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

- Mobile app (iOS & Android)
- Hardware wallet integration
- Buy / Sell Support
- NFT support
- Multi-language support
- Advanced portfolio analytics

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
