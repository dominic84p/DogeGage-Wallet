/**
 * DogeGage Wallet - Desktop Edition
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Downloads Page
function renderDownloads() {
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
                    <button class="nav-link-btn" onclick="router.navigate('/')">Home</button>
                    <button class="nav-link-btn" onclick="router.navigate('/news')">News</button>
                    <button class="nav-link-btn" onclick="router.navigate('/docs')">Docs</button>
                    <button class="nav-link-btn" onclick="router.navigate('/support')">Support</button>
                    <button class="nav-link-btn" onclick="router.navigate('/about')">About</button>
                </div>
            </nav>
            
            <section class="hero-section" style="padding-top: 120px; display: flex; align-items: center; justify-content: center; min-height: 60vh;">
                <div style="text-align: center; max-width: 800px; padding: 40px;">
                    <h1 style="font-size: 32px; color: white; margin-bottom: 40px; line-height: 1.5;">
                        My PC cannot build all platforms. Please build yourself by downloading the source from GitHub, or wait for GitHub Actions to build them automatically!
                    </h1>
                    <a href="https://github.com/dominic84p/DogeGage-Wallet/releases" target="_blank" style="display: inline-block; padding: 16px 48px; background: #667eea; color: white; border-radius: 8px; text-decoration: none; font-size: 18px; font-weight: 600; transition: all 0.3s;">
                        View Releases on GitHub
                    </a>
                </div>
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
