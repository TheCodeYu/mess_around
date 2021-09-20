
import axios from 'axios'
import { dialog } from 'electron'
import { lt } from 'semver'
import pkg from '../../../package.json'

const os = require('os')

const version = pkg.version
const releaseUrl = 'http://118.195.176.247:8080/release/query'

const compareVersion2Update = (current, last) => {
    return lt(current, last)
}

/**
 * {"success":true,
 * "result":[{"id":1,"version":"0.0.6","downloadUrl":"https://github.com/clouDr-f2e/rubick/releases/tag/v0.0.6","msg":"bugfix","createdAt":"2021-06-30T08:35:33.000Z","updatedAt":"2021-06-30T08:35:33.000Z","deletedAt":null}]}
 */

export async function autoUpdate() {

    let res
    try {
        res = await axios.get(releaseUrl)
    } catch (err) {
        console.log(err)
    }

    if (res) {
        const last = res.data.result[0];
        const result = compareVersion2Update(version, last.version)
        if (result) {
            const temp = await dialog.showMessageBox({
                type: 'info',
                title: '发现新版本',
                buttons: ['Yes', 'No'],
                message: `发现新版本:${last.version}\n新功能:\n${last.msg}`,
                checkboxLabel: '以后不再提醒',
                checkboxChecked: false
            })
            if (temp.response === 0) {
                if (os.type() === 'Windows_NT') {
                    await shell.openExternal(latest.downloadUrl);
                } else if (os.type() === 'Darwin') {
                    await shell.openExternal(latest.downloadUrl);
                } else {
                    dialog.showErrorBox('提示', '系统不支持');
                }
            }
        }
    }



}