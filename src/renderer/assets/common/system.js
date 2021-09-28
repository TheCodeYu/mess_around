import { shell, ipcRenderer } from 'electron'
import { Event } from '../../../main/common/common'

export default {
    'mess-help': {
        help(f) {
            ipcRenderer.send(Event.newHelpInfo, f)
        }
    },
}