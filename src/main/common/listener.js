import { globalShortcut, screen, BrowserWindow } from "electron";
import { throttle } from './utils';
import robot from "robotjs";

const browsers = require("../browsers")();
const { picker, separator, superPanel } = browsers;
export default class Listener {

    constructor() {
        this.optionPlugin = {};
        this.isWin = process.platform === 'win32';
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
            mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
            mainWindow.focus();
            mainWindow.setVisibleOnAllWorkspaces(false, { visibleOnFullScreen: true });
            mainWindow.setPosition(wx, wy);
            mainWindow.show();
        })

        globalShortcut.register(config.perf.shortCut.separate, () => {
            mainWindow.webContents.send('new-window')
        })

        globalShortcut.register(config.perf.shortCut.quit, () => {
            mainWindow.webContents.send('init-mess');
            mainWindow.show();
        })

        //注册全局自定义快捷键
        config.global.forEach(sc => {
            if (!sc.key || !sc.value) return

            globalShortcut.register(sc.key, () => {
                mainWindow.webContents.send('global-short-key', sc.value);
            })

        });
    }

    init(mainWindow) {
        this.fn = throttle(({ x, y }, picker) => {
            const { scaleFactor } = screen.getDisplayNearestPoint({ x, y });
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
            picker.getWindow().webContents.send("updatePicker", colors);
        }, 100)
    }
}
