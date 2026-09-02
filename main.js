const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('node:path');

let mainWindow;
let focusActive = false;
let allowClose = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 980,
    minHeight: 700,
    backgroundColor: '#070911',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('close', event => {
    if (focusActive && !allowClose) {
      event.preventDefault();
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('desktop:exit-blocked');
    }
  });

  mainWindow.on('minimize', event => {
    if (focusActive) {
      event.preventDefault();
      mainWindow.restore();
      mainWindow.focus();
      mainWindow.webContents.send('desktop:exit-blocked');
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (focusActive) {
      mainWindow.webContents.send('desktop:exit-blocked');
      return { action: 'deny' };
    }
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

ipcMain.handle('desktop:set-focus-active', (_event, active) => {
  focusActive = Boolean(active);
  if (!mainWindow || mainWindow.isDestroyed()) return focusActive;
  mainWindow.setAlwaysOnTop(focusActive, focusActive ? 'screen-saver' : 'normal');
  mainWindow.setKiosk(focusActive);
  if (focusActive) {
    mainWindow.show();
    mainWindow.focus();
  }
  return focusActive;
});

ipcMain.handle('desktop:get-focus-active', () => focusActive);

ipcMain.handle('desktop:quit', () => {
  if (focusActive) return false;
  allowClose = true;
  app.quit();
  return true;
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', event => {
  if (focusActive && !allowClose) {
    event.preventDefault();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('desktop:exit-blocked');
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !focusActive) app.quit();
});

module.exports = { isExitBlocked: () => focusActive && !allowClose };
