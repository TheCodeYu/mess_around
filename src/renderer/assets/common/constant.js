const WINDOW_MAX_HEIGHT = 600;
const WINDOW_MIN_HEIGHT = 60;
const PRE_ITEM_HEIGHT = 60;


const SYSTEM_PLUGINS = [
  {
    pluginName: '帮助文档',
    name:'document',
    logo: require('../imgs/help.png'),
    isPlugin: true,
    preload:'preload.js',
    features: [
      {
        code: 'help',
        explain: 'Mess  帮助文档',
        cmds: ['Help', '帮助']
      }
    ],
    tag: 'Mess-help'
  },
]

const MAIN_MENU = {
  market: {
    key: "market",
    img: 'appstore',
    name: "插件中心"
  },
  plugin: {
    key: "plugin",
    img: 'heart',
    name: "已安装"
  },
  dev: {
    key: "dev",
    img: 'code',
    name: "开发者"
  },
  settings: {
    key: "settings",
    img: 'setting',
    name: "设置"
  }
}
const APP_FINDER_PATH = process.platform === 'darwin' ? ['/System/Applications', '/Applications', '/System/Library/PreferencePanes'] : [];
export { MAIN_MENU, WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS, APP_FINDER_PATH };
