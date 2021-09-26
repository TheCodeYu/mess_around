import {
    app,
    nativeImage,
    BrowserWindow,
    clipboard,
    globalShortcut,
    ipcMain,
    Notification,
    screen,
    TouchBar
} from "electron"
import { exec, spawn } from "child_process"
import { Platform, throttle } from './utils'
import ioHook from 'iohook'
import path from 'path'
import fs from "fs"
import {Event} from '../../resource/config'
const browsers = require("../browsers")()
const { picker, separator, superPanel } = browsers
export default class Listener {

    constructor() {
        this.optionPlugin = {}
        this.isWin = process.platform === 'win32'
    }

    registerShortCut(mainWindow) {
        const config = global.opConfig.get()
        globalShortcut.unregisterAll()

        //注册固定快捷键
        globalShortcut.register(config.perf.shortCut.showAndHidden, () => {
            const { x, y } = screen.getCursorScreenPoint()
            const current = screen.getDisplayNearestPoint({ x, y })
            const wx = parseInt(current.workArea.x + current.workArea.width / 2 - 400)
            const wy = parseInt(current.workArea.y + current.workArea.height / 2 - 200)

            // mainWindow.setAlwaysOnTop(true)
            mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
            mainWindow.focus()
            mainWindow.setVisibleOnAllWorkspaces(false, { visibleOnFullScreen: true })
            mainWindow.setPosition(wx, wy)
            mainWindow.show()
        })

        // globalShortcut.register(config.perf.shortCut.separate, () => {
        //     mainWindow.webContents.send('new-window')
        // })

        // globalShortcut.register(config.perf.shortCut.quit, () => {
        //     mainWindow.webContents.send('init-mess')
        //     mainWindow.show()
        // })

        // //注册全局自定义快捷键
        // config.global.forEach(sc => {
        //     if (!sc.key || !sc.value) return

        //     globalShortcut.register(sc.key, () => {
        //         mainWindow.webContents.send('global-short-key', sc.value)
        //     })

        // })
    }

    init(mainWindow) {
        //开始初始化一系列基础功能
        //this.setAutoLogin()
        //this.colorPicker()
        //this.initPlugin()
        //this.lockScreen()
        //this.separate()
        //this.initCapture()
        //this.initTouchBar(mainWindow)
        //this.superPanel(mainWindow)
        //this.reRegisterShortCut(mainWindow)
        this.changeSize(mainWindow)
        //this.msgTrigger(mainWindow)
        this.windowMoveInit(mainWindow)
    }

    separate() {
        // 窗口分离
        ipcMain.on('new-window', (event, arg) => {
            const opts = {
                ...arg,
                searchType: 'subWindow',
            }
            separator.init(JSON.stringify(opts))
        })
    }

    changeSize(mainWindow) {
        ipcMain.on(Event.changeWindowSize, (event, arg) => {
            mainWindow.setSize(arg.width || 800, arg.height)
        })
    }

    reRegisterShortCut(mainWindow) {
        ipcMain.on('re-register', (event, arg) => {
            //this.setAutoLogin()
            this.registerShortCut(mainWindow)
        })
    }
    windowMoveInit(win) {
        let hasInit = false
        ipcMain.on(Event.windowMove, () => {
            let bounds = win.getBounds()
            if (!hasInit) {
                hasInit = true
                ioHook.start(false)
                !this.isWin && ioHook.load()

                const winPosition = win.getPosition()
                const winStartPosition = { x: winPosition[0], y: winPosition[1] }
                const mouseStartPosition = screen.getCursorScreenPoint()

                ioHook.on('mousedrag', e => {
                    const cursorPosition = screen.getCursorScreenPoint()
                    const dx = winStartPosition.x + cursorPosition.x - mouseStartPosition.x
                    const dy = winStartPosition.y + cursorPosition.y - mouseStartPosition.y
                    bounds.x = parseInt(dx)
                    bounds.y = parseInt(dy)
                    win.setBounds(bounds)
                })

                ioHook.on('mouseup', e => {
                    hasInit = false
                    ioHook.stop()
                    ioHook.removeAllListeners()
                    !this.isWin && ioHook.unload()
                })
            }
        })
    }
}
