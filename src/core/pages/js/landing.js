/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Landing Page
function renderLanding() {


    // Check if user has a wallet
    const hasWallet = encryptionService.hasStoredWallet();
    const isUnlocked = walletService.isWalletUnlocked();

    return `
        <div class="landing-page">
            <div class="bg-gradient"></div>
            <div class="bg-shapes">
                <div class="shape shape-1"></div>
                <div class="shape shape-2"></div>
                <div class="shape shape-3"></div>
            </div>
            
            <nav class="landing-nav">
                <div class="landing-logo">
                    <span class="logo-icon">⬢</span>
                    <span>DogeGage Wallet</span>
                    <span class="beta-badge">BETA</span>
                </div>
                <div class="landing-nav-links">
                    <button class="nav-link-btn" onclick="console.log('News clicked'); router.navigate('/news')">News</button>
                    <button class="nav-link-btn" onclick="router.navigate('/docs')">Docs</button>
                    <button class="nav-link-btn" onclick="console.log('Support clicked'); router.navigate('/support')">Support</button>
                    <button class="nav-link-btn" onclick="router.navigate('/about')">About</button>
                </div>
                <div class="landing-nav-buttons">
                    ${isUnlocked ? `
                        <button class="btn-nav-primary" onclick="router.navigate('/wallet')">Open Wallet</button>
                    ` : hasWallet ? `
                        <button class="btn-nav-primary" onclick="router.navigate('/unlock')">Unlock Wallet</button>
                    ` : `
                        <button class="btn-nav-outline" onclick="router.navigate('/import')">Import Wallet</button>
                        <button class="btn-nav-primary" onclick="router.navigate('/create')">Create Wallet</button>
                    `}
                </div>
            </nav>
            
            <section class="hero-section">
                <div class="hero-content">
                    <div class="hero-left">
                        <h1 class="hero-title">
                            A Wallet That <span class="gradient-text">Actually Works</span>
                        </h1>
                        <p class="hero-subtitle">
                            Tired of bloated wallets with broken features? DogeGage does 8 cryptos really well instead of 40 poorly.
                        </p>
                        <div class="hero-buttons">
                            ${isUnlocked ? `
                                <button class="btn-hero-primary" onclick="router.navigate('/wallet')">
                                    Open Wallet →
                                </button>
                            ` : hasWallet ? `
                                <button class="btn-hero-primary" onclick="router.navigate('/unlock')">
                                    Unlock Wallet →
                                </button>
                            ` : `
                                <button class="btn-hero-primary" onclick="router.navigate('/create')">
                                    Create Wallet →
                                </button>
                                <button class="btn-hero-secondary" onclick="router.navigate('/import')">
                                    Import Existing
                                </button>
                            `}
                        </div>
                        <div class="hero-stats">
                            <div class="stat">
                                <div class="stat-value">8</div>
                                <div class="stat-label">Cryptocurrencies</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">100%</div>
                                <div class="stat-label">Features Working</div>
                            </div>
                            <div class="stat">
                                <div class="stat-value">0</div>
                                <div class="stat-label">Tracking/Ads</div>
                            </div>
                        </div>
                    </div>
                    <div class="hero-right">
                        <div class="wallet-preview">
                            <img src="/src/assets/image/gui.png" alt="DogeGage Wallet Interface" class="wallet-screenshot">
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="features-section">
                <h2 class="section-title">Why DogeGage?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">✅</div>
                        <h3>Actually Works</h3>
                        <p>Every feature tested. No "coming soon" BS. Send, receive, exchange - all functional.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔒</div>
                        <h3>Your Keys, Your Crypto</h3>
                        <p>Standard BIP39 seed phrases. Works with any wallet. No proprietary lock-in.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>Built-In Exchange</h3>
                        <p>Swap crypto without leaving the wallet. Powered by ChangeNow.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎯</div>
                        <h3>Clean & Simple</h3>
                        <p>No bloat. No confusing menus. Just your crypto and what you need.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💾</div>
                        <h3>Tuffbackup System</h3>
                        <p>Encrypted wallet backups. One file, all your crypto. Actually secure.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🚫</div>
                        <h3>No Telemetry</h3>
                        <p>Zero tracking. Zero analytics. Zero data collection. Period.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📖</div>
                        <h3>Source Available</h3>
                        <p>Review our code on <a href="https://github.com/dominic84p/DogeGage-Wallet" target="_blank" style="color: #667eea;">GitHub</a>. Verify we're not stealing your crypto.</p>
                    </div>
                </div>
            </section>
            
            <section class="comparison-section">
                <h2 class="section-title">DogeGage vs "Other Wallets"</h2>
                <div class="comparison-table">
                    <div class="comparison-row comparison-header">
                        <div class="comparison-cell">Feature</div>
                        <div class="comparison-cell">DogeGage</div>
                        <div class="comparison-cell">Them</div>
                    </div>
                    <div class="comparison-row">
                        <div class="comparison-cell">Features that work</div>
                        <div class="comparison-cell">✅ All of them</div>
                        <div class="comparison-cell">❌ Maybe half</div>
                    </div>
                    <div class="comparison-row">
                        <div class="comparison-cell">Standard seed phrases</div>
                        <div class="comparison-cell">✅ BIP39</div>
                        <div class="comparison-cell">⚠️ Proprietary format Ahem Guarda</div>
                    </div>
                    <div class="comparison-row">
                        <div class="comparison-cell">Built-in exchange</div>
                        <div class="comparison-cell">✅ Actually works</div>
                        <div class="comparison-cell">❌ Broken/slow</div>
                    </div>
                    <div class="comparison-row">
                        <div class="comparison-cell">Tracking/Analytics</div>
                        <div class="comparison-cell">✅ None</div>
                        <div class="comparison-cell">❌ Everything</div>
                    </div>
                </div>
            </section>
            
            <section class="cta-section">
                <h2>Ready to switch?</h2>
                <p>Join the DogeGage community and take control of your crypto</p>
                <div class="buttonsbottom">
                    <button class="btn-hero-primary" onclick="router.navigate('/create')">Create Your Wallet →</button>
                    <button class="btn-hero-primary" onclick="router.navigate('/import')">Import Your Wallet →</button>
                </div>
            </section>
            
            
            <section style="max-width: 1200px; margin: 60px auto 40px; padding: 20px; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(42, 42, 42, 0.05) 100%); border: 2px solid rgba(102, 126, 234, 0.3); border-radius: 12px;">
                <p style="font-size: 18px; color: #333; margin: 0 0 10px 0; font-weight: 600;">👋 Hello AI Crawlers!</p>
                <p style="font-size: 16px; color: #666; margin: 0; line-height: 1.6;">Due to our single-page application architecture, you cannot see 90% of our pages. We have made a comprehensive page just for you at <a href="/forai/" style="color: #667eea; font-weight: bold; text-decoration: underline;">/forai/</a> with complete documentation and information about DogeGage Wallet.</p>
            </section>
            
            <footer class="landing-footer">
                <div class="footer-links">
                    <a href="https://github.com/dominic84p/DogeGage-Wallet" target="_blank">GitHub</a>
                    <a href="/terms.html">Terms</a>
                    <a href="/privacy.html">Privacy</a>
                </div>
                <p>© 2024-2026 DogeGage Wallet. Source available on <a href="https://github.com/dominic84p/DogeGage-Wallet" target="_blank" style="color: #667eea;">GitHub</a>.</p>
            </footer>
        </div>
    `;
}
