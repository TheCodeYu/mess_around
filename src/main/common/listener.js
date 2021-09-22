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
import { Constants, throttle } from './utils'
import robot from "robotjs"
import ioHook from 'iohook'
import path from 'path'
import fs from "fs"

const browsers = require("../browsers")()
const { picker, separator, superPanel } = browsers
export default class Listener {

    constructor() {
        this.optionPlugin = {}
        this.isWin = process.platform === 'win32'
    }

    getSelectedContent() {
        return new Promise((resolve) => {
            const lastText = clipboard.readText('clipboard')
            // todo 缓存文件
            clipboard.clear()

            // 复制选中文案
            if (Constants.macOS()) {
                robot.keyTap('c', 'command')
            } else {
                robot.keyTap('c', 'control')
            }

            setTimeout(() => {
                // 延时一定时间才能从剪切板内读取到内容
                const text = clipboard.readText('clipboard') || ''
                const fileUrl = clipboard.read('public.file-url')
                if (this.isWin) {
                    // todo https://github.com/njzydark/Aragorn/blob/afe4a60972b4255dd417480ca6aca2af1fd8e637/packages/aragorn-app-main/src/uploaderManager.ts#L88
                }
                // 如果之前是文案，则回填
                clipboard.writeText(lastText)

                resolve({
                    text,
                    fileUrl
                })
            }, 300)
        })
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

            mainWindow.setAlwaysOnTop(true)
            mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
            mainWindow.focus()
            mainWindow.setVisibleOnAllWorkspaces(false, { visibleOnFullScreen: true })
            mainWindow.setPosition(wx, wy)
            mainWindow.show()
        })

        globalShortcut.register(config.perf.shortCut.separate, () => {
            mainWindow.webContents.send('new-window')
        })

        globalShortcut.register(config.perf.shortCut.quit, () => {
            mainWindow.webContents.send('init-mess')
            mainWindow.show()
        })

        //注册全局自定义快捷键
        config.global.forEach(sc => {
            if (!sc.key || !sc.value) return

            globalShortcut.register(sc.key, () => {
                mainWindow.webContents.send('global-short-key', sc.value)
            })

        })
    }

    init(mainWindow) {
        this.fn = throttle(({ x, y }, picker) => {
            const { scaleFactor } = screen.getDisplayNearestPoint({ x, y })
            const img = robot.screen.capture(
                x - parseInt(5 / scaleFactor),
                y - parseInt(5 / scaleFactor),
                10,
                10
            )

            const colors = {}

            for (let i = 0; i < 9; i++) {
                colors[i] = {}
                for (let j = 0; j < 9; j++) {
                    colors[i][j] = img.colorAt(j, i)
                }
            }
            picker.getWindow().webContents.send("updatePicker", colors)
        }, 100)

        //开始初始化一系列基础功能
        //this.setAutoLogin()
        //this.colorPicker()
        //this.initPlugin()
        //this.lockScreen()
        this.separate()
        //this.initCapture()
        //this.initTouchBar(mainWindow)
        this.superPanel(mainWindow)
        this.reRegisterShortCut(mainWindow)
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
        // 修改窗口尺寸
        ipcMain.on('changeWindowSize-mess', (event, arg) => {
            mainWindow.setSize(arg.width || 800, arg.height)
        })
    }

    reRegisterShortCut(mainWindow) {
        ipcMain.on('re-register', (event, arg) => {
            //this.setAutoLogin()
            this.registerShortCut(mainWindow)
        })
    }

    superPanel(mainWindow) {
        superPanel.init(mainWindow)
        ipcMain.on('right-down', async () => {

            const copyResult = await this.getSelectedContent()
            let win = superPanel.getWindow()

            win.webContents.send('trigger-super-panel', {
                ...copyResult,
                optionPlugin: this.optionPlugin.plugins,
            })
            const pos = this.getPos(robot.getMousePos())
            win.setPosition(parseInt(pos.x), parseInt(pos.y))
            win.setAlwaysOnTop(true)
            win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
            win.focus()
            win.setVisibleOnAllWorkspaces(false, { visibleOnFullScreen: true })
            win.show()
        })
    }
    windowMoveInit(win) {
        let hasInit = false
        ipcMain.on('window-move', () => {
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
