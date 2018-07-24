const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require("electron-updater");

//-------------------------------------------------------------------
// Define the menu
//-------------------------------------------------------------------
let template = [];
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [{
      label: 'About ' + name,
      role: 'about'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click() { app.quit(); }
    }]
  })
}

//-------------------------------------------------------------------
// Open a window that displays the version
//-------------------------------------------------------------------
let win;

function sendStatusToWindow(text) {
  console.log(text);
  win.webContents.send('message', text);
}
function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);

  return win;
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  const { bytesPerSecond, percent, transferred, total } = progressObj;

  sendStatusToWindow(`Download speed: ${bytesPerSecond} - Downloaded ${percent}% (${transferred}/${total})`);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

//-------------------------------------------------------------------
// Auto updates - Option 1 - Simplest version
//
// This will immediately download an update, then install when the
// app quits.
//-------------------------------------------------------------------
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

//-------------------------------------------------------------------
// Auto updates - Option 2 - More control
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// app.on('ready', function()  {
//   autoUpdater.checkForUpdates();
// });
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (info) => {
// })
// autoUpdater.on('update-not-available', (info) => {
// })
// autoUpdater.on('error', (err) => {
// })
// autoUpdater.on('download-progress', (progressObj) => {
// })
// autoUpdater.on('update-downloaded', (info) => {
//   autoUpdater.quitAndInstall();
// })
