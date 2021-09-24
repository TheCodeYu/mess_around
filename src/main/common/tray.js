import { Platform } from "./utils"
import os from 'os'
import { app, dialog, Menu, shell, Tray } from "electron"
import path from "path"
import {Event,Config} from '../../resource/config'
export default function createTray(window) {

    return new Promise((resolve, reject) => {
        let icon
        if (Platform.macOS()) {
            icon = './icon@3x.png'
        } else if (Platform.windows()) {
            icon = parseInt(os.release()) < 10 ? './icon@2x.png' : './icon@3x.png'
        } else {
            icon = './icon@2x.png'
        }

        const appIcon = new Tray(path.join(__static, icon))

        const contextMenu = Menu.buildFromTemplate([
            {
                label: '帮助文档',
                click: () => {
                    process.nextTick(() => {
                        shell.openExternal('https://github.com/TheCodeYu/mess_around')
                    })
                }
            },
            {
                label: '意见反馈',
                click: () => {
                    process.nextTick(() => {
                        shell.openExternal('https://github.com/TheCodeYu/mess_around/issues')
                    })
                }
            },
            { type: 'separator' },
            {
                label: '显示窗口',
                accelerator: Event.traySetting,
                click: () => {
                    window.show()
                }
            },
            {
                label: '退出',
                role: 'quit'
            },
            {
                label: '重启',
                click: () => {
                    app.relaunch(),
                        app.quit()
                }
            },
            { type: 'separator' },
            {
                label: '偏好设置',
                click: () => {
                    window.show()
                    window.webContents.send('tray-setting');
                }
            },
            {
                label: '关于mess',
                click: () => {
                    dialog.showMessageBox({
                        title: 'mess around',
                        message: '程序员的摸鱼软件',
                        detail: `Version:${Config.appInfo.version}\nAuthor:${Config.appInfo.author}`
                    })
                }
            },
        ])

        appIcon.on('click', () => {
            appIcon.popUpContextMenu(contextMenu)
        })
        appIcon.setContextMenu(contextMenu)
        resolve(appIcon)
    })

}