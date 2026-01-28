const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // Security: Keep true isolation like a browser
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js') // Optional, good for future use
        },
        icon: path.join(__dirname, '../src/assets/crypto/SVG/dgage.png')
    });

    // Determine environment
    const isDev = process.env.NODE_ENV === 'development';

    // In production (bundled app), load the built file.
    // In dev, we can still point to the local file.
    // We are pointing to the PARENT directory's index.html
    win.loadFile(path.join(__dirname, '../index.html'));

    // Remove menu bar (optional, makes it look cleaner like a native app)
    // win.setMenuBarVisibility(false);

    // Open external links in default browser, not Electron
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
