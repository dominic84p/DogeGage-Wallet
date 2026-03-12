// About Us Page
function renderAbout() {


    return `
        <div class="about-page">
            <nav class="landing-nav">
                <div class="landing-logo" onclick="router.navigate('/')" style="cursor: pointer;">
                    <span class="logo-icon">⬢</span>
                    <span>DogeGage Wallet</span>
                </div>
                <div class="landing-nav-links">
                    <button class="nav-link-btn" onclick="router.navigate('/news')">News</button>
                    <button class="nav-link-btn" onclick="router.navigate('/docs')">Docs</button>
                    <button class="nav-link-btn" onclick="router.navigate('/support')">Support</button>
                    <button class="nav-link-btn active">About</button>
                </div>
                <div class="landing-nav-buttons">
                    <button class="btn-nav-outline" onclick="router.navigate('/import')">Import Wallet</button>
                    <button class="btn-nav-primary" onclick="router.navigate('/create')">Create Wallet</button>
                </div>
            </nav>
            
            <div class="about-hero-banner">
                <div class="about-hero-content">
                    <h1>About Us</h1>
                    <p>DogeGage Wallet is a non-custodial cryptocurrency wallet that actually works. We support 9 major cryptocurrencies with 100% functional features including BTC, ETH, SOL, DOGE, LTC, XTZ, TRX, POL, and our native DGAGE token.</p>
                    
                    <div class="about-stats">
                        <div class="stat-item">
                            <div class="stat-number">9</div>
                            <div class="stat-label">CRYPTOCURRENCIES<br>SUPPORTED</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">100%</div>
                            <div class="stat-label">FEATURES<br>WORKING</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">24/7</div>
                            <div class="stat-label">COMMUNITY<br>SUPPORT</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="page-content">
                <div class="about-content">
                    <section class="about-section">
                        <h2>Our Mission</h2>
                        <p>We built DogeGage because we were tired of crypto wallets that promise everything and deliver nothing. You know the type - they claim to support 40+ cryptocurrencies, but half the features don't work. Transactions fail. Balances don't update. The UI is confusing. And good luck getting support.</p>
                        <p>DogeGage is different. We support 9 cryptocurrencies, and every single feature works. Send, receive, exchange, backup - all tested, all functional. We'd rather do 9 cryptos perfectly than 40 poorly.</p>
                    </section>
                    
                    <section class="about-section">
                        <h2>Why DogeGage?</h2>
                        <div class="features-grid-about">
                            <div class="feature-about">
                                <div class="feature-icon-about">🔒</div>
                                <h3>Non-Custodial</h3>
                                <p>Your keys, your crypto. We never have access to your funds. Everything is stored locally on your device with AES-256 encryption.</p>
                            </div>
                            <div class="feature-about">
                                <div class="feature-icon-about">✅</div>
                                <h3>Actually Works</h3>
                                <p>Every feature is tested and functional. No "coming soon" promises. No broken transactions. No missing balances.</p>
                            </div>
                            <div class="feature-about">
                                <div class="feature-icon-about">🔄</div>
                                <h3>Built-In Exchange</h3>
                                <p>Swap crypto without leaving the wallet. Powered by ChangeNow. No hidden fees.</p>
                            </div>
                            <div class="feature-about">
                                <div class="feature-icon-about">🚫</div>
                                <h3>Zero Tracking</h3>
                                <p>No analytics. No telemetry. No data collection. We don't know who you are or what you do.</p>
                            </div>
                            <div class="feature-about">
                                <div class="feature-icon-about">💾</div>
                                <h3>Tuffbackup System</h3>
                                <p>Encrypted wallet backups in a single file. Easier than typing seed phrases. Protected with your password.</p>
                            </div>
                            <div class="feature-about">
                                <div class="feature-icon-about">🎯</div>
                                <h3>Standard BIP39</h3>
                                <p>No proprietary formats. Your seed phrase works with any BIP39 wallet. No lock-in.</p>
                            </div>
                        </div>
                    </section>
                    
                    <section class="about-section">
                        <h2>Supported Cryptocurrencies</h2>
                        <div class="crypto-grid">
                            <div class="crypto-item">
                                <strong>Bitcoin</strong>
                                <span>BTC</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Ethereum</strong>
                                <span>ETH</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Solana</strong>
                                <span>SOL</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Dogecoin</strong>
                                <span>DOGE</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Litecoin</strong>
                                <span>LTC</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Tezos</strong>
                                <span>XTZ</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Tron</strong>
                                <span>TRX</span>
                            </div>
                            <div class="crypto-item">
                                <strong>Polygon</strong>
                                <span>POL</span>
                            </div>
                        </div>
                    </section>
                    
                    <section class="about-section">
                        <h2>Our Team</h2>
                        <p>DogeGage is built by a small group of developers who got fed up with crypto wallets that don't work. We're not some big corporate team - just people who wanted a wallet that actually does what it says.</p>
                        <p>We've been in crypto for a while, learned from our mistakes, and decided to build something simple that works. No fancy offices, no venture capital, no bullshit. Just a wallet that sends, receives, and swaps crypto without breaking.</p>
                        <p>We're learning as we go, fixing bugs as they come up, and trying to make something useful. That's it.</p>
                    </section>
                    
                    <section class="about-section">
                        <h2>What We're Not</h2>
                        <div class="not-list">
                            <div class="not-item">
                                <span class="not-icon">❌</span>
                                <div>
                                    <strong>Not a custodial service</strong>
                                    <p>We can't freeze your funds, seize your crypto, or lock you out. You're in control.</p>
                                </div>
                            </div>
                            <div class="not-item">
                                <span class="not-icon">❌</span>
                                <div>
                                    <strong>Not tracking you</strong>
                                    <p>No analytics, no telemetry, no data collection. Your privacy is absolute.</p>
                                </div>
                            </div>
                            <div class="not-item">
                                <span class="not-icon">❌</span>
                                <div>
                                    <strong>Not using proprietary formats</strong>
                                    <p>Standard BIP39 seed phrases. Your wallet works anywhere.</p>
                                </div>
                            </div>
                            <div class="not-item">
                                <span class="not-icon">❌</span>
                                <div>
                                    <strong>Not promising 40+ coins</strong>
                                    <p>We support 9 cryptos with 100% working features. Quality over quantity.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section class="about-cta">
                        <h2>Ready to try a wallet that actually works?</h2>
                        <p>Join thousands of users who switched from broken wallets to DogeGage</p>
                        <div class="cta-buttons">
                            <button class="btn-hero-primary" onclick="router.navigate('/create')">Create Wallet →</button>
                            <button class="btn-hero-secondary" onclick="router.navigate('/import')">Import Wallet</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `;
}
