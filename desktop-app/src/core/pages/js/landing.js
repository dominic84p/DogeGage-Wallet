/**
 * DogeGage Wallet - Desktop Edition
 * Copyright (c) 2024-2026 DogeGage
 * Source Available License - See LICENSE file
 * https://github.com/dominic84p/DogeGage-Wallet
 */

// Landing Page - Desktop Version (Simple)
function renderLanding() {
    const hasWallet = encryptionService.hasStoredWallet();
    
    // If wallet exists, go straight to unlock
    if (hasWallet) {
        router.navigate('/unlock');
        return '';
    }

    return `
        <div class="landing-page" style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div style="text-align: center; max-width: 500px; padding: 40px;">
                <div style="font-size: 80px; margin-bottom: 20px;">⬢</div>
                <h1 style="font-size: 48px; color: white; margin-bottom: 10px; font-weight: bold;">Welcome to DogeGage Wallet</h1>
                <p style="font-size: 18px; color: rgba(255,255,255,0.9); margin-bottom: 40px;">Your keys, your crypto. Multi-chain wallet for desktop.</p>
                
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button class="btn-hero-primary" onclick="router.navigate('/create')" style="padding: 16px 32px; font-size: 18px; background: white; color: #667eea; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: transform 0.2s;">
                        Create New Wallet
                    </button>
                    <button class="btn-hero-secondary" onclick="router.navigate('/import')" style="padding: 16px 32px; font-size: 18px; background: transparent; color: white; border: 2px solid white; border-radius: 8px; cursor: pointer; font-weight: bold; transition: transform 0.2s;">
                        Import Wallet
                    </button>
                </div>
                
                <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.2);">
                    <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin: 0;">Supports: BTC • ETH • DOGE • LTC • SOL • XTZ • TRX • POL</p>
                </div>
            </div>
        </div>
    `;
}