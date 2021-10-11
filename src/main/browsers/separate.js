const { BrowserWindow } = require('electron')

module.exports = () => {

  let win

  let title

  let init = (arg) => {
    createWindow(arg)
  }

  let createWindow = (arg) => {
    const winURL = process.env.NODE_ENV === 'development' ?
      'http://localhost:9080/#/plugin' : `${__dirname}/index.html`

    let temp = JSON.parse(arg)
    title = temp.pluginName
    let frame = temp.frame === undefined ? true : temp.frame
    win = new BrowserWindow({
      height: 600,
      useContentSize: true,
      width: 800,
      minWidth: 800,
      autoHideMenuBar: true,
      title: title,
      frame: frame,
      icon: JSON.parse(arg).icon.substring(8),
      show: false,
      webPreferences: {
        webSecurity: false,
        enableRemoteModule: true,
        backgroundThrottling: false,
        contextIsolation: false,
        webviewTag: true,
        nodeIntegration: true // 在网页中集成Node
      }
    })

    process.env.NODE_ENV === 'development' ? win.loadURL(winURL) : win.loadFile(winURL, {
      hash: `#/plugin`,
    })

    win.webContents.executeJavaScript(`window.setPluginInfo(${arg})`).then(() => {
      ///消隐作用
      setTimeout(() => {
        win.show()
      }, 1500)
    })

    win.on("closed", () => {
      win = undefined
    })
  }
  let getWindow = () => win

  let setTitle = (arg) => {
    win.setTitle(`${title}-` + arg)
  }
  return {
    init: init,
    getWindow: getWindow,
    setTitle: setTitle
  }

}