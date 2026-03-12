/**
 * DogeGage Wallet - Desktop Edition
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

    const platformInfo = {
        'dmg': { icon: '🍎', name: 'macOS', color: '#667eea' },
        'exe': { icon: '🪟', name: 'Windows', color: '#0078d4' },
        'msi': { icon: '🪟', name: 'Windows', color: '#0078d4' },
        'AppImage': { icon: '🐧', name: 'Linux', color: '#f59e0b' },
        'deb': { icon: '🐧', name: 'Debian/Ubuntu', color: '#f59e0b' },
        'rpm': { icon: '🐧', name: 'Fedora/RHEL', color: '#f59e0b' },
        'apk': { icon: '🤖', name: 'Android', color: '#3ddc84' }
    };

    return assets.map(asset => {
        const ext = asset.name.split('.').pop();
        const platform = platformInfo[ext] || { icon: '📦', name: 'Other', color: '#94a3b8' };
        const size = (asset.size / 1024 / 1024).toFixed(2);
        
        return `
            <a href="${asset.browser_download_url}" class="download-card" style="display: block; background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; text-decoration: none; transition: all 0.3s; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: ${platform.color}; opacity: 0.05; border-radius: 50%; transform: translate(30%, -30%);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                        <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                            ${platform.icon}
                        </div>
                        <div style="flex: 1;">
                            <div style="color: ${platform.color}; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${platform.name}</div>
                            <div style="color: white; font-weight: 600; font-size: 15px;">${asset.name}</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
                        <div style="display: flex; gap: 16px; font-size: 13px; color: #94a3b8;">
                            <span>📦 ${size} MB</span>
                            <span>⬇️ ${asset.download_count}</span>
                        </div>
                        <span style="color: ${platform.color}; font-weight: 600; font-size: 14px;">Download →</span>
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

function renderDownloads() {
    // Fetch and display releases after DOM is ready
    setTimeout(() => {
        fetchLatestRelease().then(release => {
            const releaseInfo = document.querySelector('#release-info');
            const downloadsContainer = document.querySelector('#downloads-container');
            
            if (releaseInfo && downloadsContainer) {
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
            }
        });
    }, 100);

    return `
        <style>
            .downloads-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 16px;
            }
            
            @media (max-width: 768px) {
                .downloads-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            .download-card:hover {
                transform: translateY(-4px);
                border-color: rgba(102, 126, 234, 0.5);
                box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
            }
        </style>
        
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
                <div style="max-width: 1200px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: center; margin-bottom: 64px;">
                        <h1 style="font-size: 56px; color: white; margin-bottom: 16px; font-weight: 700;">Downloads</h1>
                        <p style="font-size: 20px; color: #94a3b8;">Get the latest version of DogeGage Wallet for your platform</p>
                    </div>
                    
                    <div id="release-info" style="margin-bottom: 48px; text-align: center;">
                        <div style="color: #94a3b8;">Loading latest release...</div>
                    </div>
                    
                    <div id="downloads-container" class="downloads-grid"></div>
                    
                    <div style="text-align: center; margin-top: 48px; padding-top: 48px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <p style="color: #94a3b8; margin-bottom: 16px;">Looking for older versions?</p>
                        <a href="https://github.com/dominic84p/DogeGage-Wallet/releases" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #667eea; text-decoration: none; font-weight: 600; transition: all 0.3s;">
                            <span>View all releases on GitHub</span>
                            <span>→</span>
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
}
