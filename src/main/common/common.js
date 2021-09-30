//import pkg from '../../../package.json'
const pkg = require('../../../package.json')
/**
 * 自定义的事件监听名称
 */
const Event = {
    changeWindowSize: 'change-window-size',//修改窗口尺寸
    windowMove: 'window-move',//移动窗体
    traySetting: 'tray-setting',//托盘设置
    newWindow: 'new-window',//新建窗口
    newHelpInfo: 'new-help-info',//打开帮助窗口
    helpReadyShow: 'help-ready-show',

    lifetime: {
        pluginStart: 'plugin-start',//'did-start-loading',
        pluginEnter: 'plugin-enter',//'dom-ready',
        pluginLoadingEnd: 'plugin-loading-end', //'did-finish-load'
        PluginExit: 'plugin-exit'
    }

}
/**
 * 全局配置信息
 * 如外部一些开放平台API
 */
const Config = {
    appInfo: {
        name: pkg.name,
        version: pkg.version,
        author: pkg.author,
        description: pkg.description,
        license: pkg.license,
        appid: pkg.build.appId
    }
}


module.exports = {
    Event,
    Config
}