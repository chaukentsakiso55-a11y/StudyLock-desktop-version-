const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('studyLockDesktop', {
  setFocusActive: active => ipcRenderer.invoke('desktop:set-focus-active', Boolean(active)),
  getFocusActive: () => ipcRenderer.invoke('desktop:get-focus-active'),
  quit: () => ipcRenderer.invoke('desktop:quit'),
  onExitBlocked: callback => {
    const listener = () => callback();
    ipcRenderer.on('desktop:exit-blocked', listener);
    return () => ipcRenderer.removeListener('desktop:exit-blocked', listener);
  }
});
