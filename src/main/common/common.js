import pkg from '../../../package.json'

/**
 * 自定义的事件监听名称
 */
export const Event = {
    changeWindowSize: 'changeWindowSize',//修改窗口尺寸
    windowMove: 'window-move',//移动窗体
    traySetting: 'tray-setting',//托盘设置
    newWindow:'new-window'//新建窗口
}
/**
 * 全局配置信息
 * 如外部一些开放平台API
 */
export const Config = {
    appInfo: {
        name: pkg.name,
        version: pkg.version,
        author: pkg.author,
        description: pkg.description,
        license: pkg.license,
        appid: pkg.build.appId
    }
}