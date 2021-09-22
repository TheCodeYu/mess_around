import { sysFile } from '../../assets/common/utils'

const state = {
    searchValue: '',
    selected: null,
    subPlaceHolder: '',
    pluginInfo: (() => {
        try {
            return window.pluginInfo || {}
        } catch (e) { }
    })()
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