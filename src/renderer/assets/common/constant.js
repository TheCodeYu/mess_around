const WINDOW_MAX_HEIGHT = 600;
const WINDOW_MIN_HEIGHT = 60;
const PRE_ITEM_HEIGHT = 60;


const SYSTEM_PLUGINS = [
  {
    pluginName: 'rubick 帮助文档',
    logo: require('../imgs/help.png'),
    features: [
      {
        code: 'help',
        explain: 'rubick 帮助文档',
        cmds: ['Help', '帮助']
      }
    ],
    tag: 'rubick-help'
  },
]

const MAIN_MENU = {
  market: {
    key: "market",
    icon: 'appstore',
    name: "插件中心"
  },
  plugin: {
    key: "plugin",
    icon: 'heart',
    name: "已安装"
  },
  dev: {
    key: "dev",
    icon: 'code',
    name: "开发者"
  },
  settings: {
    key: "settings",
    icon: 'setting',
    name: "设置"
  }
}
const APP_FINDER_PATH = process.platform === 'darwin' ? ['/System/Applications', '/Applications', '/System/Library/PreferencePanes'] : [];
export { MAIN_MENU, WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS, APP_FINDER_PATH };
