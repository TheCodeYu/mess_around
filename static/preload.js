const { getlocalDataFile } = require("./utils");

const path = require('path');

console.log(location)
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

if (location.href.indexOf('targetFile') > -1) {
    filePath = decodeURIComponent(getQueryVariable('targetFile'));
} else {
    filePath = process.platform === 'win32' ? location.pathname.substring(1) : location.pathname.replace('file://', '');
}

const { ipcRenderer } = require('electron');

window.mess = {
    onPluginEnter(cb) {
        ipcRenderer.on('onPluginEnter', (e, message) => {
            const feature = message.detail;
            cb({ ...feature, type: message.cmd.type ? message.cmd.type : 'text', payload: message.payload })
        })
    },
    onPluginReady(cb) {
        ipcRenderer.once('onPluginReady', (e, message) => {
            const feature = message.detail
            cb({ ...feature, type: message.cmd.type ? message.cmd.type : 'text', payload: message.payload })
        })
    },
    onPluginOut(cb) {
        ipcRenderer.once('onPluginOut', (e, message) => {
            const feature = JSON.parse(message.detail)
            cb({ ...feature, type: 'text' })
        })
    },
    showNotification(body, clickFeatureCode) {
        const myNotification = new Notification('Mess 通知', {
            body
        });
        return myNotification;
        // todo 实现 clickFeatureCode
    },
}

const preloadPath = getQueryVariable('preloadPath') || './preload.js';
if (require('electron').remote) {
   console.log(require('electron').remote)
 }
require(path.join(filePath, '../', preloadPath));
window.exports && ipcRenderer.sendToHost('templateConfig', { config: JSON.parse(JSON.stringify(window.exports)) });
window.ipcRenderer = ipcRenderer;
console.log(window)