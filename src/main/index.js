import { app, BrowserWindow } from 'electron'
import '../renderer/store'

 
 const nodeAbi = require('node-abi');
 console.log(nodeAbi.getAbi('14.0.1','node'))// 89
    console.log(nodeAbi.getAbi('14.0.1','electron'))// 89
  console.log(nodeAbi.getTarget())//5.0.0
  console.log(nodeAbi.getTarget())//5.0.0
  const ioHook = require('iohook');
    ioHook.start(false);
    const eventHandler =function(type){
        switch (type) {
            case 'mouseclick':
                console.log('mouse is click!')
                break;
            case 'mousedown':
                console.log('mouse is press!')
                break;
            case 'mouseup':
                console.log('mouse is release!')
                break;
            case 'mousedrag':
                console.log('mouse is moving!')
                break;
            case 'mousedrag':
                console.log('mouse is moving!')
                break;
            case 'mousewheel':
                console.log('keybord is rolling!')
                break;
            case 'keydown':
                console.log('keybord is press!')
                break;
            default:
                console.log('move mouse or keyboard try it!')
                break;
        }
    }
    ioHook.start(false);
    ioHook.on('mouseclick', ()=>{eventHandler('mouseclick')});
    ioHook.on('mousedown', ()=>{eventHandler('mousedown')});
    ioHook.on('mouseup', ()=>{eventHandler('mouseup')});
    ioHook.on('mousedrag', ()=>{eventHandler('mousedrag')});
    ioHook.on('mousewheel', ()=>{eventHandler('mousewheel')});
    ioHook.on('mouse', ()=>{eventHandler('mousedrag')});
    ioHook.on('keyup', ()=>{eventHandler('keyup')});
    ioHook.on('keydown', ()=>{eventHandler('keydown')});


    // console.log(nodeAbi.getTarget('68','node'))// 12.0.0
    // console.log(nodeAbi.getTarget('70','electron'))//5.0.0


app.on('before-quit', () => {
    // 卸载iohook监听
    ioHook.unload();
    ioHook.stop();
});
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
