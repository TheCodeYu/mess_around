import { app, BrowserWindow, globalShortcut } from 'electron'
import { Platform } from './common/utils'
import { autoUpdate } from './common/autoUpdate'
import Strore from 'electron-store'
import { Config } from '../main/common/common'
import createTray from './common/tray'
import Listener from './common/listener'
Strore.initRenderer()

const { main } = require("./browsers")()

if (Platform.production()) {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.allowRendererProcessReuse = false

const listener = new Listener()

class Application {

  launchApp() {
    const appLock = app.requestSingleInstanceLock()
    /// 环境变量处理软件启动参数
    /// console.log(process.env)
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
    listener.registerShortCut(main.getWindow())
    listener.init(main.getWindow())

  }


  beforeReady() {
    if (Platform.macOS()) {
      if (Platform.production() && !app.isInApplicationsFolder()) {
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

    if (Platform.windows()) {
      app.setAppUserModelId(Config.appInfo.appid)
    }
  }
  onQuit() {
    app.on('window-all-closed', () => {
      if (!Platform.macOS()) {
        app.quit()
      }
    })

    app.on('will-quit', () => {
      ///准备退出，取消快捷键注册等
    })
    if (Platform.dev()) {
      if (!Platform.windows()) {
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