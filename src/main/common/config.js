

import path from 'path'
import { getlocalDataFile } from './utils'
import os from 'os'
import fs from 'fs'
const configPath = path.join(getlocalDataFile(), './mess-config.json')

let defaultConfig = {
    Darwin: {
        version: 1,
        perf: {
            shortCut: {
                showAndHidden: 'Option+R',
                separate: 'Ctrl+D',
                quit: 'Shift+Escape'
            },
            common: {
                start: true,
                space: true
            },
            local: {
                search: true
            }
        },
        superPanel: {
            baiduAPI: {
                key: '',
                appid: ''
            },
            mouseDownTime: 500
        },
        global: []
    },
    Windows_NT: {
        version: 1,
        perf: {
            shortCut: {
                showAndHidden: 'Option+R',
                separate: 'Ctrl+D',
                quit: 'Shift+Escape'
            },
            common: {
                start: true,
                space: true
            },
            local: {
                search: true
            }
        },
        superPanel: {
            baiduAPI: {
                key: '',
                appid: ''
            },
            mouseDownTime: 500
        },
        global: []
    },
    Linux: {
        version: 1,
        perf: {
            shortCut: {
                showAndHidden: 'Option+R',
                separate: 'Ctrl+D',
                quit: 'Shift+Escape'
            },
            common: {
                start: true,
                space: true
            },
            local: {
                search: true
            }
        },
        superPanel: {
            baiduAPI: {
                key: '',
                appid: ''
            },
            mouseDownTime: 500
        },
        global: []
    }
}

global.opConfig = {
    config: null,
    get() {
        const platform = os.type()
        try {
            if (!opConfig.config) {
                opConfig.config = JSON.parse(fs.readFileSync(configPath) || JSON.stringify(defaultConfig[platform]))

            }
            ///重置设置
            if (!opConfig.config.version || opConfig.config.version < defaultConfig[platform].version) {

                opConfig.config = defaultConfig[platform]

                fs.writeFileSync(configPath, JSON.stringify(opConfig.config))
            }
        } catch (error) {

            opConfig.config = defaultConfig[platform]

        }
        return opConfig.config
    },
    set(key, value) {
        opConfig.config[key] = value
        fs.writeFileSync(configPath, JSON.stringify(opConfig.config))
    }

}

