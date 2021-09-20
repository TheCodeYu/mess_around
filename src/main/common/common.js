import { BrowserView } from 'electron'
import Listener from './listener'

export default function init(mainWindow) {
    const listener = new Listener()

    //[todo] 注册快捷键
    // listener.registerShortCut(win);
    // listener.init(win);

}