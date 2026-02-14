// Support Page
function renderSupport() {


    // Add FAQ structured data for SEO
    const faqSchema = {
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
    };

    // Inject schema into page
    if (!document.getElementById('faq-schema')) {
        const script = document.createElement('script');
        script.id = 'faq-schema';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(faqSchema);
        document.head.appendChild(script);
    }

    return `
        <div class="support-page">
            <nav class="landing-nav">
                <div class="landing-logo" onclick="router.navigate('/')" style="cursor: pointer;">
                    <span class="logo-icon">⬢</span>
                    <span>DogeGage Wallet</span>
                </div>
                <div class="landing-nav-links">
                    <button class="nav-link-btn" onclick="router.navigate('/news')">News</button>
                    <button class="nav-link-btn" onclick="router.navigate('/docs')">Docs</button>
                    <button class="nav-link-btn active">Support</button>
                    <button class="nav-link-btn" onclick="router.navigate('/about')">About</button>
                </div>
                <div class="landing-nav-buttons">
                    <button class="btn-nav-outline" onclick="router.navigate('/import')">Import Wallet</button>
                    <button class="btn-nav-primary" onclick="router.navigate('/create')">Create Wallet</button>
                </div>
            </nav>
            
            <div class="page-content">
                <div class="page-hero">
                    <h1>Support & FAQ</h1>
                    <p>Get help with DogeGage Wallet</p>
                </div>
                
                <div class="support-layout">
                    <div class="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        
                        <div class="faq-grid">
                            <div class="faq-card">
                                <div class="faq-icon">🔒</div>
                                <h3>Is DogeGage Wallet safe?</h3>
                                <p>Yes! DogeGage is a non-custodial wallet using industry-standard BIP39 seed phrases. Everything is stored locally on your device. We never see or store your private keys. Your seed phrase is encrypted with AES-256 encryption. You have full control of your crypto.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">📥</div>
                                <h3>Can I import my existing wallet?</h3>
                                <p>Absolutely! DogeGage supports standard BIP39 seed phrases (12 or 24 words). If you have a wallet from another provider that uses BIP39, you can import it seamlessly.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">💰</div>
                                <h3>What cryptocurrencies are supported?</h3>
                                <p>We support 8 cryptocurrencies: Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Dogecoin (DOGE), Litecoin (LTC), Tezos (XTZ), Tron (TRX), Polygon (POL), and DogeGage Token (DGAGE).</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">🔄</div>
                                <h3>How does the built-in exchange work?</h3>
                                <p>Our exchange is powered by ChangeNow, a trusted crypto exchange service. You can swap between any supported cryptocurrencies directly from your wallet. We don't charge any additional fees beyond ChangeNow's standard rates.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">💾</div>
                                <h3>What is Tuffbackup?</h3>
                                <p>Tuffbackup is our encrypted backup system. It creates a single encrypted file containing your wallet data that you can save and restore later. The backup is protected with your password and can only be decrypted by you.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">🚫</div>
                                <h3>Do you collect any data?</h3>
                                <p>No. Zero tracking, zero analytics, zero telemetry. We don't know who you are, what you do, or how much crypto you have. Your privacy is absolute.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">🎯</div>
                                <h3>What is DGAGE token?</h3>
                                <p>DGAGE is our native utility token deployed on Polygon. It's an ERC-20 token with unlimited minting capability. Early adopters can receive free DGAGE through our airdrop program.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">⚠️</div>
                                <h3>I lost my seed phrase. Can you help?</h3>
                                <p>Unfortunately, no. If you lose your seed phrase, your funds are permanently lost. This is the nature of decentralized, non-custodial crypto - no one can recover your wallet, not even us. Always keep multiple secure backups of your seed phrase.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">✨</div>
                                <h3>Why only 8 cryptocurrencies?</h3>
                                <p>Quality over quantity. We'd rather support 8 cryptos with 100% working features than 40 cryptos with half-broken functionality. Every feature in DogeGage is tested and functional.</p>
                            </div>
                            
                            <div class="faq-card">
                                <div class="faq-icon">🔑</div>
                                <h3>What does non-custodial mean?</h3>
                                <p>Non-custodial means YOU control your private keys and crypto. We never have access to your funds. Unlike custodial wallets (like exchanges), your crypto can't be frozen, seized, or lost if our service goes down. Your keys, your crypto.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="support-bottom">
                        <div class="support-card">
                            <h3>Need More Help?</h3>
                            <p>Join our community for real-time support and updates</p>
                            
                            <div class="community-links">
                                <a href="https://discord.gg/8fVs2rdgFT" class="community-link" target="_blank">
                                    <span class="community-icon">💬</span>
                                    <div>
                                        <strong>Discord</strong>
                                        <p>Join our server</p>
                                    </div>
                                </a>
                                <a href="https://x.com/DogeGageistaken" class="community-link" target="_blank">
                                    <span class="community-icon">X</span>
                                    <div>
                                        <strong>"X"</strong>
                                        <p>Follow for updates</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                        
                        <div class="support-card security-card">
                            <h3>🛡️ Security Tips</h3>
                            <ul class="security-list">
                                <li>✅ Never share your seed phrase</li>
                                <li>✅ Store backups in multiple secure locations</li>
                                <li>✅ Use a strong password</li>
                                <li>✅ Enable auto-lock</li>
                                <li>✅ Verify addresses before sending</li>
                                <li>❌ Don't store seed phrases digitally</li>
                                <li>❌ Don't trust unsolicited messages</li>
                                <li>❌ Never enter seed phrase on websites</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
