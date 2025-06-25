const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { generateSummary, listFiles } = require('./utils/fileUtils');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (canceled) return null;
  return filePaths[0];
});

ipcMain.handle('list-files', async (_event, opts) => {
  const { dir, extensions } = opts;
  const files = await listFiles(dir, extensions);
  return files.map(f => path.relative(dir, f));
});

ipcMain.handle('generate-summary', async (_event, opts) => {
  const { productDir, customizerDir, extensions, output, selectedFiles } = opts;
  const summary = await generateSummary(productDir, customizerDir, extensions, output, selectedFiles);
  return summary;
});
