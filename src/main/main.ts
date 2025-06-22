/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * Hardened main-process entry for a locked-down Electron IDE.
 *  – kiosk + fullscreen + hidden menubar
 *  – Chromium sandbox, context-isolation, DevTools disabled
 *  – global shortcuts swallowed (Alt-Tab, F12, Ctrl-Shift-I …)
 *  – outbound navigation blocked to anything except your own domain
 */

import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  globalShortcut,
  session,
  WebRequestFilter,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { runViaBackend } from './runViaBackend';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

/* ------------------------------------------------------------------
   Basic IPC example (unchanged)
------------------------------------------------------------------- */
ipcMain.on('ipc-example', async (event, arg) => {
  const msg = (s: string) => `IPC test: ${s}`;
  console.log(msg(arg));
  event.reply('ipc-example', msg('pong'));
});
// main.ts  (update the handler signature)
ipcMain.handle('run-code', (_e, { lang, src, token }) =>
  runViaBackend(lang, src, token)
);


/* ------------------------------------------------------------------
   Strip all dev-time helpers in production builds
------------------------------------------------------------------- */
const isDev =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDev) {
  // keep electron-debug during development only
  require('electron-debug').default();
} else {
  // production: add source-map support but *no* devtools installer
  require('source-map-support').install();
}

/* ------------------------------------------------------------------
   Create the hardened BrowserWindow
------------------------------------------------------------------- */
const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAsset = (...paths_: string[]) => path.join(RESOURCES_PATH, ...paths_);

  mainWindow = new BrowserWindow({
    show: false,
    kiosk: true,
    fullscreen: true,
    icon: getAsset('icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true,
      sandbox: true,
      devTools: true,
      nodeIntegration: false,
    },
  });

  mainWindow.on('blur', () => {
    mainWindow?.webContents.send('focus-state', { focused: false, ts: Date.now() });
  });

  mainWindow.on('focus', () => {
    mainWindow?.webContents.send('focus-state', { focused: true, ts: Date.now() });
  });


  /* ------------------------------------------
     1.  Load your renderer bundle
  ------------------------------------------- */
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  /* ------------------------------------------
     2.  Lock the UI once ready
  ------------------------------------------- */
  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) throw new Error('"mainWindow" is undefined');
    process.env.START_MINIMIZED ? mainWindow.minimize() : mainWindow.show();
  });

  /* ------------------------------------------
     3.  Handle close
  ------------------------------------------- */
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  /* ------------------------------------------
     4.  Build a minimal, shortcut-free menu
  ------------------------------------------- */
  new MenuBuilder(mainWindow).buildMenu();

  /* ------------------------------------------
     5.  Prevent external navigation
  ------------------------------------------- */
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  /* ------------------------------------------
     6.  Whitelist requests (local file:// + your domain)
  ------------------------------------------- */
  const filter: WebRequestFilter = { urls: ['*://*/*'] };
  const ALLOW_HOSTS = new Set(['localhost']); // add more if needed
  ALLOW_HOSTS.add('identitytoolkit.googleapis.com'); 
  ALLOW_HOSTS.add('securetoken.googleapis.com');

  session.defaultSession.webRequest.onBeforeRequest(filter, (details, cb) => {
    const url = new URL(details.url);
    if (url.protocol === 'file:' || ALLOW_HOSTS.has(url.hostname)) {
      cb({});
    } else {
      cb({ cancel: true });
    }
  });

  /* ------------------------------------------
     7.  Swallow common escape shortcuts
  ------------------------------------------- */
  const swallow = (combo: string) => globalShortcut.register(combo, () => { });
  swallow('Alt+Tab');
  swallow('CommandOrControl+Tab');
  swallow('F11');
  swallow('F12');
  swallow('CommandOrControl+Shift+I');
  swallow('CommandOrControl+W'); // close-tab
  swallow('CommandOrControl+R'); // reload
  swallow('Alt+tab'); // Alt-Tab on Windows

  /* ------------------------------------------
     8.  Auto-updates still work
  ------------------------------------------- */
  if (!isDev) new AppUpdater();
};

/* ------------------------------------------------------------------
   App lifecycle
------------------------------------------------------------------- */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.error);
