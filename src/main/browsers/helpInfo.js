const { BrowserWindow, ipcMain } = require('electron')

module.exports = () => {

    let win

    let init = (argv) => {
        if (win === null || win === undefined) {
            createWindow(argv);
        }

    }

    let createWindow = (argv) => {

        win = new BrowserWindow({
            frame: true,
            autoHideMenuBar: true,
            width: 800,
            minWidth: 800,
            height: 600,
            show: false,
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