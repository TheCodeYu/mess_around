import fs from 'fs'
import { Config } from '../../resource/config'
export const Platform = {
    linux: function () {
        return process.platform === 'linux'
    },
    macOS() {
        return process.platform === 'darwin';
    },
    windows() {
        return process.platform === 'win32'
    },
    production: function () {
        return process.env.NODE_ENV !== 'development';
    },
    dev: function () {
        return process.env.NODE_ENV === 'development';
    },
}

export const getlocalDataFile = () => {
    let localDataFile = process.env.LOCALAPPDATA + `/${Config.appInfo.appid}`
    if (!fs.existsSync(localDataFile)) {
        fs.mkdirSync(localDataFile)
    }
    return localDataFile
}

