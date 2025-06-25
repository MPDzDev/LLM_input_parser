const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  listFiles: (opts) => ipcRenderer.invoke('list-files', opts),
  generateSummary: (opts) => ipcRenderer.invoke('generate-summary', opts)
});
