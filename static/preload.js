const { getlocalDataFile } = require("./utils");
const { Event, Config } = require('../src/main/common/common')
const path = require('path');
let filePath = '';
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

// if (location.href.indexOf('targetFile') > -1) {
//     filePath = decodeURIComponent(getQueryVariable('targetFile'));
// } else {

filePath = process.platform === 'win32' ? location.pathname.substring(1) : location.pathname.replace('file://', '');
//}

const { ipcRenderer } = require('electron');

Object.freeze(Event, Config)

window.mess = {

    event: Event,
    config: Config,
    ipcRenderer: ipcRenderer,
    setTitle(title){
        ipcRenderer.send(Event.setTitle,title)
        ipcRenderer.sendToHost('setSubInput', {a:1,b:'we'});
    },
    showNotification(body, clickFeatureCode) {
        const myNotification = new Notification('Mess 通知', {
            body
        });
        return myNotification;
        // todo 实现 clickFeatureCode
    },
    windowMoveInit(cb) {

        ipcRenderer.send(`move-${cb}`);
    }
}

const preloadPath = getQueryVariable('preloadPath') || './preload.js';

require(path.join(filePath, '../', preloadPath));

window.exports && ipcRenderer.sendToHost('templateConfig', { config: JSON.parse(JSON.stringify(window.exports)) });

