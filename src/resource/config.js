
import pkg from '../../package.json'
/**
 * 事件监听名称
 */
const Event = {

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


export default {
  Event,
  Config
}