
import { WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS, APP_FINDER_PATH } from './constant'
const { ipcRenderer } = require("electron")
import Strore from 'electron-store'
const getApp = process.platform === 'win32' ? require('./win-app').getApp : require('./darwin-app').getApp;
const store = new Strore()
getApp.init();
const fileLists = getApp.fileLists;
function getWindowHeight(searchList) {
    if (!searchList) return WINDOW_MAX_HEIGHT;
    if (!searchList.length) return WINDOW_MIN_HEIGHT;
    return searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5 > WINDOW_MAX_HEIGHT
        ? WINDOW_MAX_HEIGHT
        : searchList.length * PRE_ITEM_HEIGHT + WINDOW_MIN_HEIGHT + 5;
}

function searchKeyValues(lists, value) {
    return lists.filter((item) => {
        if (typeof item === 'string') return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        return item.type.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
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
        const target = []
        plugins.forEach((item) => {
            if (item.type !== 'system') {
                target.push(item)
            }
        })
        store.set('user-plugins', target)
    },
    getUserPlugins() {
        try {
            return store.get('user-plugins');
        } catch (e) {
            return [];
        }
    },
    removeAllPlugins() {
        store.delete('user-plugins');
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

function mergePlugins(plugins) {
    const result = [
        ...plugins,
        ...SYSTEM_PLUGINS.map((plugin) => {
            return {
                ...plugin,
                status: true,
                type: 'system'
            }
        })
    ]
    const target = []
    //去重
    result.forEach((item) => {
        let targetIndex = -1
        target.forEach((tg, j) => {
            if (tg.tag === item.tag && tg.type === 'system') {
                targetIndex = j
            }
        })
        if (targetIndex === -1) {
            target.push(item)
        }
    })
    ipcRenderer && ipcRenderer.send('optionPlugin', {
        plugins: target.filter((plugin) => {
            let hasOption = false
            plugin.features.forEach((fe) => {
                fe.cmds.forEach((cmd) => {
                    if (cmd.type) {
                        hasOption = true
                    }
                })
            })
            return hasOption
        })

    })
    ipcRenderer && ipcRenderer.send('pluginInit', {
        plugins: target
    })
    return target
}
export {
    getWindowHeight,
    mergePlugins,
    debounce,
    sysFile,
    searchKeyValues,
    fileLists
}