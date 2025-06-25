const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  generateSummary: (opts) => ipcRenderer.invoke('generate-summary', opts)
});
