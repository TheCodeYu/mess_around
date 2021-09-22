
import { WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT } from './constant'
const { ipcRenderer } = require("electron")
import Strore from 'electron-store'

const store = new Strore()

function getWindowHeight(searchList) {
    if (!searchList) return WINDOW_MAX_HEIGHT;
    if (!searchList.length) return WINDOW_MIN_HEIGHT;
    return searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5 > WINDOW_MAX_HEIGHT
        ? WINDOW_MAX_HEIGHT
        : searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5;
}
const sysFile = {

    savePlugins(plugins) {
        ipcRenderer.send('optionPlugin', {
            plugins: plugins.filter((plugin) => {
                let hasOption = false
                plugin.features.forEach((f) => {
                    f.cmds.forEach((cmd) => {
                        if (cmd.type) {
                            hasOption = true
                        }
                    })
                })
                return hasOption
            })
        })
        store.set('user-pligins', plugins)
    }
}

function debounce(fn, delay) {
    let timer;
    return function () {
        const context = this;
        const args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}
export {
    getWindowHeight,
    debounce,
    sysFile
}