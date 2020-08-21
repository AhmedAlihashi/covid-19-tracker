const { app, session, BrowserWindow } = require("electron");
const electronDl = require("electron-dl");

const path = require("path");
const url = require("url");

electronDl();
let mainWindow;

const createWindow = async () => {
  await app.whenReady();
  mainWindow = new BrowserWindow({
    icon: __dirname + "/build/favicon.ico",
    frame: false,
    transparent: true,
    width: 1150,
    height: 750,
    minHeight: 815,
    minWidth: 616,
    maxHeight: 1500,
    maxWidth: 2050,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, "/build/index.html"),
        protocol: "file:",
        slashes: true,
      })
  );

  mainWindow.on("closed", () => (mainWindow = null));

  mainWindow.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });

  mainWindow.webContents.session.clearStorageData();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());

app.on("activate", () => mainWindow === null && createWindow());
