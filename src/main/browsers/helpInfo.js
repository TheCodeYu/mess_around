const { BrowserWindow, ipcMain } = require('electron')

module.exports = () => {

    let win

    let init = (arg) => {
        if (win === null || win === undefined) {
            createWindow(arg);
        }

    }

    let createWindow = (arg) => {
        
        win = new BrowserWindow({
            frame: true,
            autoHideMenuBar: true,
            width: 800,
            minWidth: 800,
            height: 600,
            show: false,
            icon: `${__static}/plugins/tpl/help.png`,
            title: '帮助文档',
            webPreferences: {
                webSecurity: false,
                enableRemoteModule: true,
                backgroundThrottling: false,
                nodeIntegration: true,
                devTools: true,
            }
        })
        win.loadURL(`file://${__static}/plugins/tpl/index.html`);
        win.on("closed", () => {
            win = undefined;
        });
    }

    let getWindow = () => win

    return {
        init: init,
        getWindow: getWindow
    }
}