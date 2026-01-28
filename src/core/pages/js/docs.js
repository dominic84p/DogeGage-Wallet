// Documentation Page
function renderDocs() {


    return `
        <div class="docs-page">
            <nav class="landing-nav">
                <div class="landing-logo">
                    <span class="logo-icon">⬢</span>
                    <span>DogeGage Wallet</span>
                </div>
                <div class="landing-nav-links">
                    <button class="nav-link-btn" onclick="router.navigate('/')">Home</button>
                    <button class="nav-link-btn" onclick="router.navigate('/docs')">Docs</button>
                    <button class="nav-link-btn" onclick="router.navigate('/news')">News</button>
                    <button class="nav-link-btn" onclick="router.navigate('/support')">Support</button>
                    <button class="nav-link-btn" onclick="router.navigate('/about')">About</button>
                </div>
            </nav>
            
            <div class="docs-container">
                <aside class="docs-sidebar">
                    <div class="docs-sidebar-section">
                        <h3>Getting Started</h3>
                        <a href="#create-wallet" class="docs-link">Creating a Wallet</a>
                        <a href="#import-wallet" class="docs-link">Importing a Wallet</a>
                        <a href="#backup" class="docs-link">Backup & Recovery</a>
                    </div>
                    
                    <div class="docs-sidebar-section">
                        <h3>Using DogeGage</h3>
                        <a href="#send" class="docs-link">Sending Crypto</a>
                        <a href="#receive" class="docs-link">Receiving Crypto</a>
                        <a href="#exchange" class="docs-link">Exchanging Crypto</a>
                        <a href="#portfolio" class="docs-link">Portfolio Tracking</a>
                    </div>
                    
                    <div class="docs-sidebar-section">
                        <h3>Security</h3>
                        <a href="#seed-phrase" class="docs-link">Seed Phrase Security</a>
                        <a href="#tuffbackup" class="docs-link">Tuffbackup System</a>
                        <a href="#auto-lock" class="docs-link">Auto-Lock Feature</a>
                    </div>
                    
                    <div class="docs-sidebar-section">
                        <h3>Technical</h3>
                        <a href="#supported-coins" class="docs-link">Supported Cryptocurrencies</a>
                        <a href="#standards" class="docs-link">Standards & Compatibility</a>
                        <a href="#privacy" class="docs-link">Privacy & Data</a>
                    </div>
                </aside>
                
                <main class="docs-content">
                    <h1>DogeGage Wallet Documentation</h1>
                    <p class="docs-intro">Everything you need to know about using DogeGage Wallet securely and effectively.</p>
                    
                    <!-- Getting Started -->
                    <section class="docs-section" id="create-wallet">
                        <h2>Creating a Wallet</h2>
                        <p>Creating a new wallet generates a unique 12-word seed phrase that controls your crypto.</p>
                        
                        <div class="docs-steps">
                            <div class="docs-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Click "Create Wallet"</h4>
                                    <p>From the landing page, click the "Create Wallet" button.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>Write Down Your Seed Phrase</h4>
                                    <p>You'll see 12 words. Write them down on paper in order. Never store them digitally or take a screenshot.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Set a Password</h4>
                                    <p>Create a strong password to encrypt your wallet. This password is only for this device.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h4>Done!</h4>
                                    <p>Your wallet is created and ready to use. Keep your seed phrase safe!</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="docs-warning">
                            <strong>⚠️ Important:</strong> Your seed phrase is the ONLY way to recover your wallet. If you lose it, your crypto is gone forever. DogeGage cannot recover it for you.
                        </div>
                    </section>
                    
                    <section class="docs-section" id="import-wallet">
                        <h2>Importing a Wallet</h2>
                        <p>Import an existing wallet using your 12-word seed phrase.</p>
                        
                        <div class="docs-steps">
                            <div class="docs-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Click "Import Wallet"</h4>
                                    <p>From the landing page, click "Import Wallet".</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>Enter Your Seed Phrase</h4>
                                    <p>Type or paste your 12-word seed phrase. Make sure the words are in the correct order.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Set a Password</h4>
                                    <p>Create a password to encrypt your wallet on this device.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="docs-tip">
                            <strong>💡 Tip:</strong> DogeGage uses standard BIP39 seed phrases. You can import wallets from other BIP39-compatible wallets.
                        </div>
                    </section>
                    
                    <section class="docs-section" id="backup">
                        <h2>Backup & Recovery</h2>
                        <p>DogeGage offers two backup methods: seed phrase and Tuffbackup.</p>
                        
                        <h3>Seed Phrase Backup</h3>
                        <p>Your 12-word seed phrase is the master backup. Write it down and store it securely offline.</p>
                        
                        <h3>Tuffbackup System</h3>
                        <p>Tuffbackup creates an encrypted file containing your wallet. It's protected by your password.</p>
                        
                        <div class="docs-code">
                            <p><strong>To create a Tuffbackup:</strong></p>
                            <ol>
                                <li>Go to Settings</li>
                                <li>Click "Download Tuffbackup"</li>
                                <li>Save the <code>tuffbackup.dogegage</code> file</li>
                            </ol>
                        </div>
                        
                        <div class="docs-code">
                            <p><strong>To restore from Tuffbackup:</strong></p>
                            <ol>
                                <li>Click "Import Wallet"</li>
                                <li>Select "Import from Tuffbackup"</li>
                                <li>Upload your <code>tuffbackup.dogegage</code> file</li>
                                <li>Enter your password</li>
                            </ol>
                        </div>
                    </section>
                    
                    <!-- Using DogeGage -->
                    <section class="docs-section" id="send">
                        <h2>Sending Crypto</h2>
                        
                        <div class="docs-steps">
                            <div class="docs-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Select Cryptocurrency</h4>
                                    <p>Click on the crypto you want to send from your wallet.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>Click "Send"</h4>
                                    <p>Enter the recipient's address and amount.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Review & Confirm</h4>
                                    <p>Double-check the address and amount. Crypto transactions cannot be reversed!</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="docs-warning">
                            <strong>⚠️ Warning:</strong> Always verify the recipient address. Sending to the wrong address means your crypto is lost forever.
                        </div>
                    </section>
                    
                    <section class="docs-section" id="receive">
                        <h2>Receiving Crypto</h2>
                        <p>To receive crypto, share your wallet address with the sender.</p>
                        
                        <div class="docs-steps">
                            <div class="docs-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Select Cryptocurrency</h4>
                                    <p>Click on the crypto you want to receive.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>Click "Receive"</h4>
                                    <p>Your wallet address and QR code will be displayed.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Share Your Address</h4>
                                    <p>Copy the address or let the sender scan your QR code.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="docs-tip">
                            <strong>💡 Tip:</strong> Each cryptocurrency has its own address. Make sure you're sharing the correct address for the crypto you want to receive.
                        </div>
                    </section>
                    
                    <section class="docs-section" id="exchange">
                        <h2>Exchanging Crypto</h2>
                        <p>DogeGage has a built-in exchange powered by ChangeNow. Swap crypto without leaving the wallet.</p>
                        
                        <div class="docs-steps">
                            <div class="docs-step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h4>Go to Exchange</h4>
                                    <p>Click "Exchange" in the navigation.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h4>Select Currencies</h4>
                                    <p>Choose what you're sending and what you want to receive.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h4>Enter Amount</h4>
                                    <p>Type the amount you want to exchange. You'll see the estimated amount you'll receive.</p>
                                </div>
                            </div>
                            
                            <div class="docs-step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h4>Confirm Exchange</h4>
                                    <p>Review the details and confirm. The exchange will process automatically.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <section class="docs-section" id="portfolio">
                        <h2>Portfolio Tracking</h2>
                        <p>The Portfolio page shows your total balance across all cryptocurrencies with charts and history.</p>
                        
                        <ul class="docs-list">
                            <li><strong>Total Balance:</strong> See your combined USD value</li>
                            <li><strong>Asset Breakdown:</strong> View percentage allocation</li>
                            <li><strong>Price Charts:</strong> Track price movements</li>
                            <li><strong>Transaction History:</strong> See all your transactions</li>
                        </ul>
                    </section>
                    
                    <!-- Security -->
                    <section class="docs-section" id="seed-phrase">
                        <h2>Seed Phrase Security</h2>
                        <p>Your seed phrase is the most important thing to protect. Here's how to keep it safe:</p>
                        
                        <div class="docs-do-dont">
                            <div class="docs-do">
                                <h4>✅ DO</h4>
                                <ul>
                                    <li>Write it down on paper</li>
                                    <li>Store it in a safe place</li>
                                    <li>Keep multiple copies in different locations</li>
                                    <li>Use a fireproof/waterproof safe</li>
                                </ul>
                            </div>
                            
                            <div class="docs-dont">
                                <h4>❌ DON'T</h4>
                                <ul>
                                    <li>Take a screenshot</li>
                                    <li>Store it in cloud storage</li>
                                    <li>Email it to yourself</li>
                                    <li>Share it with anyone</li>
                                    <li>Type it on any website</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    
                    <section class="docs-section" id="tuffbackup">
                        <h2>Tuffbackup System</h2>
                        <p>Tuffbackup is DogeGage's encrypted backup system. It's a single file that contains your entire wallet.</p>
                        
                        <h3>How It Works</h3>
                        <ul class="docs-list">
                            <li>Your wallet is encrypted with your password</li>
                            <li>The encrypted data is saved to a <code>tuffbackup.dogegage</code> file</li>
                            <li>You can restore your wallet by uploading this file and entering your password</li>
                        </ul>
                        
                        <div class="docs-tip">
                            <strong>💡 Tip:</strong> Store your Tuffbackup file on a USB drive or external hard drive. Don't rely on it as your only backup - always keep your seed phrase written down too.
                        </div>
                    </section>
                    
                    <section class="docs-section" id="auto-lock">
                        <h2>Auto-Lock Feature</h2>
                        <p>DogeGage automatically locks your wallet after a period of inactivity to protect your crypto.</p>
                        
                        <h3>Settings</h3>
                        <ul class="docs-list">
                            <li>Default: 5 minutes of inactivity</li>
                            <li>Customizable in Settings</li>
                            <li>Can be disabled (not recommended)</li>
                        </ul>
                        
                        <p>When locked, you'll need to enter your password to unlock the wallet again.</p>
                    </section>
                    
                    <!-- Technical -->
                    <section class="docs-section" id="supported-coins">
                        <h2>Supported Cryptocurrencies</h2>
                        <p>DogeGage supports 8 major cryptocurrencies:</p>
                        
                        <div class="docs-coins-grid">
                            <div class="docs-coin-card">
                                <h4>Bitcoin (BTC)</h4>
                                <p>The original cryptocurrency</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>Ethereum (ETH)</h4>
                                <p>Smart contract platform</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>Dogecoin (DOGE)</h4>
                                <p>The people's crypto</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>Litecoin (LTC)</h4>
                                <p>Silver to Bitcoin's gold</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>Solana (SOL)</h4>
                                <p>High-speed blockchain</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>Tron (TRX)</h4>
                                <p>Decentralized entertainment</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>Tezos (XTZ)</h4>
                                <p>Self-amending blockchain</p>
                            </div>
                            <div class="docs-coin-card">
                                <h4>DGAGE</h4>
                                <p>DogeGage native token</p>
                            </div>
                        </div>
                    </section>
                    
                    <section class="docs-section" id="standards">
                        <h2>Standards & Compatibility</h2>
                        <p>DogeGage uses industry-standard protocols for maximum compatibility.</p>
                        
                        <h3>BIP39 Seed Phrases</h3>
                        <p>DogeGage uses BIP39 standard for seed phrase generation. This means:</p>
                        <ul class="docs-list">
                            <li>Your seed phrase works with other BIP39 wallets</li>
                            <li>You can import wallets from other BIP39-compatible wallets</li>
                            <li>Standard 12-word phrases (not proprietary formats)</li>
                        </ul>
                        
                        <h3>Derivation Paths</h3>
                        <p>DogeGage uses standard derivation paths for each cryptocurrency:</p>
                        <ul class="docs-list">
                            <li>Bitcoin: m/44'/0'/0'/0/0</li>
                            <li>Ethereum: m/44'/60'/0'/0/0</li>
                            <li>Dogecoin: m/44'/3'/0'/0/0</li>
                            <li>And more...</li>
                        </ul>
                    </section>
                    
                    <section class="docs-section" id="privacy">
                        <h2>Privacy & Data</h2>
                        <p>DogeGage is built with privacy in mind.</p>
                        
                        <h3>What We DON'T Collect</h3>
                        <ul class="docs-list">
                            <li>❌ No analytics or tracking</li>
                            <li>❌ No user accounts or emails</li>
                            <li>❌ No IP address logging</li>
                            <li>❌ No transaction monitoring</li>
                            <li>❌ No personal information</li>
                        </ul>
                        
                        <h3>What's Stored Locally</h3>
                        <ul class="docs-list">
                            <li>✅ Encrypted wallet (in browser storage)</li>
                            <li>✅ User preferences (auto-lock settings, etc.)</li>
                        </ul>
                        
                        <div class="docs-tip">
                            <strong>💡 Note:</strong> All wallet data is stored locally in your browser. DogeGage servers never see your seed phrase, private keys, or passwords.
                        </div>
                    </section>
                    
                    <section class="docs-section">
                        <h2>Need More Help?</h2>
                        <p>Can't find what you're looking for? We're here to help!</p>
                        
                        <div class="docs-help-buttons">
                            <button class="btn-docs-primary" onclick="router.navigate('/support')">Visit Support</button>
                            <button class="btn-docs-secondary" onclick="if(window.Tawk_API) Tawk_API.toggle()">Live Chat</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    `;
}
