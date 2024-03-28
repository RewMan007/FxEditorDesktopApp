const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    saveFile: (data, filePath , type , fileName) => {
        ipcRenderer.send('save-file', { data, filePath , type , fileName});
    }
});
