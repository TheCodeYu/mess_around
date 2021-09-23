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

const APP_FINDER_PATH = process.platform === 'darwin' ? ['/System/Applications', '/Applications', '/System/Library/PreferencePanes'] : [];
export { WINDOW_MAX_HEIGHT, WINDOW_MIN_HEIGHT, PRE_ITEM_HEIGHT, SYSTEM_PLUGINS, APP_FINDER_PATH };
