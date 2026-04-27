"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
try {
    if (require('electron-squirrel-startup')) {
        electron_1.app.quit();
    }
}
catch (e) {
    // Ignore if the module doesn't exist
}
// Check if we're in development mode
const isDev = !electron_1.app.isPackaged;
let mainWindow = null;
function createWindow() {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        show: false,
        autoHideMenuBar: false,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, 'preload.js'),
            sandbox: false,
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();
        console.log('[Electron] App window ready and shown');
    });
    // Open external links in the default browser.
    mainWindow.webContents.setWindowOpenHandler((details) => {
        electron_1.shell.openExternal(details.url);
        return { action: 'deny' };
    });
    // Load the app
    if (isDev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    }
    else {
        mainWindow.loadFile((0, path_1.join)(__dirname, '../dist/index.html'));
    }
}
// This method will be called when Electron has finished initialization.
electron_1.app.whenReady().then(() => {
    // Set app user model id for windows.
    electron_1.app.setAppUserModelId('com.mlimi.smart1');
    createWindow();
    electron_1.app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS.
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
