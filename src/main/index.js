import { app, BrowserWindow, globalShortcut } from 'electron'
import { Constants } from './common/utils'
import { autoUpdate } from './common/autoUpdate'
import Strore from 'electron-store'
import init from './common/common'
import pkg from '../../package.json'
import createTray from './common/tray'

Strore.initRenderer()

const { main } = require("./browsers")()

if (Constants.production()) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.allowRendererProcessReuse = false

class Application {

  launchApp() {
    const appLock = app.requestSingleInstanceLock()
    if (!appLock) {
      ///[TODO] 没有处理软件启动参数
      app.quit()
    } else {
      this.beforeReady()
      this.onReady()
      this.onRunning()
      this.onQuit()
    }
  }

  createWindow() {
    main.init()
    init(main.getWindow())
  }


  beforeReady() {
    if (Constants.macOS()) {
      if (Constants.production() && !app.isInApplicationsFolder()) {
        app.moveToApplicationsFolder()
      } else {
        //Electron有API来配置macOS Dock中的应用程序图标
        app.dock.hide()
      }
    } else {
      /**
       * 离屏渲染允许你以位图的方式来获取 BrowserWindow 中的内容，所以它可以在任何地方被渲染
       * 1.GPU加速渲染意味着使用GPU用于合成。 这也就意味着帧必须从GPU拷贝过来，从而需求更多的资源，因此这会比软件输出设备更慢
       * 2.软件输出设备在 CPU 中渲染，因此帧 生成的速度要快得多。 因此，此模式优先于 GPU 加速模式。
       */
      app.disableHardwareAcceleration()
    }
  }
  onReady() {
    const readyFunction = () => {
      this.createWindow()
      //准备系统托盘
      createTray(main.getWindow())
      //autoUpdate()
    }
    if (!app.isReady()) {
      app.on('ready', readyFunction)
    } else {
      readyFunction()
    }
  }
  onRunning() {
    app.on('second-instance', (event, argv, workDir) => {
      // 当运行第二个实例时,将会聚焦到Window这个窗口
      let win = main.getWindow()
      if (win) {
        if (win.isMaximized()) {
          win.restore()
        }
        win.focus()
      }
    })
    app.on('activate', () => {
      if (!main.getWindow()) {
        this.createWindow()
      }
    })

    if (Constants.windows()) {
      app.setAppUserModelId(pkg.build.appId)
    }
  }
  onQuit() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('will-quit', () => {
      ///准备退出，取消快捷键注册等
    })
    if (Constants.dev()) {
      if (process.platform === 'win32') {
        process.on('message', data => {
          if (data === 'graceful-exit') {
            app.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }

  }

}


(new Application()).launchApp()