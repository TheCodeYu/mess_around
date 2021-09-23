import { ipcRenderer } from 'electron';
import { getWindowHeight, mergePlugins, sysFile } from '../../assets/common/utils'

const state = {
    selected: null,
    options: [],
    showMain: false,
    //    current: ["market"],
    searchValue: "",
    devPlugins: mergePlugins(sysFile.getUserPlugins() || []),
    subPlaceHolder: "",
    pluginLoading: true,
    pluginInfo: (() => {
        try {
            return window.pluginInfo || {};
        } catch (e) { }
    })(),
}


const mutations = {
    commonUpdate(state, payload) {
        Object.keys(payload).forEach((key) => {
            state[key] = payload[key]
            if (key === 'devPligins') {
                sysFile.savePlugins(payload[key])
            }
        })
    },
    setSubPlaceHolder(state, payload) {
        state.subPlaceHolder = payload;
    },
}

const actions = {

    showMainUI({ commit, state }, paylpad) {
        ipcRenderer.send('changeWindowSize-mess', {
            height: getWindowHeight()
        })
        setTimeout(() => {
            commit("commonUpdate", {
                showMain: true,
                selected: {
                    key: "market",
                    name: "插件中心"
                }
            })
        }, 50)
    },
    async onSearch({ commit }, paylpad) {
        console.log(1111)
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}