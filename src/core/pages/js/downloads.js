/**
 * DogeGage Wallet
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Downloads Page
async function fetchLatestRelease() {
    try {
        const response = await fetch('https://api.github.com/repos/dominic84p/DogeGage-Wallet/releases/latest');
        const release = await response.json();
        return release;
    } catch (error) {
        console.error('Failed to fetch releases:', error);
        return null;
    }
}

function renderDownloadAssets(assets) {
    if (!assets || assets.length === 0) {
        return '<p style="color: #94a3b8;">No downloads available yet.</p>';
    }

    const platformIcons = {
        'dmg': '🍎',
        'exe': '🪟',
        'msi': '🪟',
        'AppImage': '🐧',
        'deb': '🐧',
        'rpm': '🐧'
    };

    return assets.map(asset => {
        const ext = asset.name.split('.').pop();
        const icon = platformIcons[ext] || '📦';
        const size = (asset.size / 1024 / 1024).toFixed(2);
        
        return `
            <a href="${asset.browser_download_url}" class="download-card" style="display: block; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 12px; text-decoration: none; transition: all 0.3s;">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 32px;">${icon}</span>
                        <div>
                            <div style="color: white; font-weight: 600; margin-bottom: 4px;">${asset.name}</div>
                            <div style="color: #94a3b8; font-size: 14px;">${size} MB • ${asset.download_count} downloads</div>
                        </div>
                    </div>
                    <span style="color: #667eea; font-weight: 600;">Download →</span>
                </div>
            </a>
        `;
    }).join('');
}

function renderDownloads() {
    const container = document.createElement('div');
    container.innerHTML = `
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
            
            <section class="hero-section" style="padding-top: 120px; min-height: 80vh;">
                <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px;">
                    <h1 style="font-size: 48px; color: white; margin-bottom: 16px; text-align: center;">Downloads</h1>
                    <p style="font-size: 18px; color: #94a3b8; text-align: center; margin-bottom: 48px;">Get the latest version of DogeGage Wallet</p>
                    
                    <div id="release-info" style="margin-bottom: 32px; text-align: center;">
                        <div style="color: #94a3b8;">Loading latest release...</div>
                    </div>
                    
                    <div id="downloads-container"></div>
                    
                    <div style="text-align: center; margin-top: 32px;">
                        <a href="https://github.com/dominic84p/DogeGage-Wallet/releases" target="_blank" style="color: #667eea; text-decoration: none;">
                            View all releases on GitHub →
                        </a>
                    </div>
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

    // Fetch and display releases
    fetchLatestRelease().then(release => {
        const releaseInfo = container.querySelector('#release-info');
        const downloadsContainer = container.querySelector('#downloads-container');
        
        if (release && !release.message) {
            releaseInfo.innerHTML = `
                <div style="background: rgba(102, 126, 234, 0.1); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 12px; padding: 20px; display: inline-block;">
                    <div style="color: white; font-size: 20px; font-weight: 600; margin-bottom: 8px;">${release.name || release.tag_name}</div>
                    <div style="color: #94a3b8; font-size: 14px;">Released ${new Date(release.published_at).toLocaleDateString()}</div>
                </div>
            `;
            downloadsContainer.innerHTML = renderDownloadAssets(release.assets);
        } else {
            releaseInfo.innerHTML = '<div style="color: #94a3b8;">No releases available yet. Check back soon!</div>';
        }
    });

    return container.innerHTML;
}
