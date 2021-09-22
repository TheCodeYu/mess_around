import fs from 'fs'
import pkg from '../../../package.json'
export const Constants = {
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
    let localDataFile = process.env.LOCALAPPDATA + `/${pkg.build.appId}`
    if (!fs.existsSync(localDataFile)) {
        fs.mkdirSync(localDataFile)
    }

    return localDataFile

}

export function throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    let later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        let now = Date.now();
        if (!previous && options.leading === false) previous = now;
        // 计算剩余时间
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}