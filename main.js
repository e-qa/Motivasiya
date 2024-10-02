const { Tray, Menu, Notification } = require('electron');
const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');
const quotes = require('./quotes');
let win;
let notificationTime = 3600000;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('index.html');

  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

let tray = null;

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, 'icon.jpeg');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        win.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      },
    },
  ]);
  tray.setToolTip('Motivasiya');
  tray.setContextMenu(contextMenu);
});

function showNotification() {
  const message = getRandomMessage();
  new Notification({
    title: 'Motivasiya Mesajı',
    body: message,
  }).show();
}
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  setInterval(showNotification, notificationTime);
});

function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}
