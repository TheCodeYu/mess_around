import { clipboard, ipcRenderer, remote } from 'electron';
import {
  getWindowHeight,
  mergePlugins,
  sysFile,
  searchKeyValues,
  fileLists
} from '../../assets/common/utils'
import { v4 as uuidv4 } from "uuid";
import { MAIN_MENU } from '../../assets/common/constant'
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { Event } from '../../../resource/config'
const state = {
  selected: null,
  options: [],
  showMain: false,
  current: [],
  searchValue: "",
  devPlugins: mergePlugins(sysFile.getUserPlugins() || []),
  subPlaceHolder: 'Hi,Mess Around',
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

  showMainUI({ commit, state }, payload) {
    ipcRenderer.send(Event.changeWindowSize, {
      height: getWindowHeight()
    })
    console.log(payload)
    setTimeout(() => {
      commit("commonUpdate", {
        showMain: true,
        selected: MAIN_MENU[payload.key]
      })
    }, 50)
  },
  async onSearch({ commit }, payload) {
    console.log(1111)
    // if (state.selected && state.selected.key !== "plugin-container") {
    //   commit("commonUpdate", { searchValue: "" });
    //   return;
    // }
    const value = payload.value;
    // 在插件界面不触发其他功能
    if (
      (state.selected && state.selected.key === "plugin-container") ||
      payload.searchType === "subWindow"
    ) {
      commit("commonUpdate", { searchValue: value });
      return;
    }
    const fileUrl =
      payload.filePath ||
      clipboard.read("public.file-url").replace("file://", "");
    commit("commonUpdate", { searchValue: value });
    // 复制文件
    if (payload.filePath || (fileUrl && value === "plugin.json")) {
      const config = JSON.parse(fs.readFileSync(fileUrl, "utf-8"));

      const pluginConfig = {
        ...config,
        sourceFile: path.join(fileUrl, `../${config.main || "index.html"}`),
        id: uuidv4(),
        type: "dev",
        icon: "image://" + path.join(fileUrl, `../${config.logo}`),
        subType: (() => {
          if (config.main) {
            return "";
          }
          return "template";
        })(),
      };
      commit("commonUpdate", {
        selected: {
          key: "plugin",
          name: "plugin.json",
        },
        searchValue: "",
        options: [
          {
            name: "新建rubick开发插件",
            value: "new-plugin",
            icon:
              "https://static.91jkys.com/activity/img/b37ff555c748489f88f3adac15b76f18.png",
            desc: "新建rubick开发插件",
            click: (router) => {
              commit("commonUpdate", {
                showMain: true,
                devPlugins: [pluginConfig, ...state.devPlugins],
                selected: {
                  key: "plugin",
                  name: "新建rubick开发插件",
                },
                current: ["dev"],
              });
              ipcRenderer.send("changeWindowSize-mess", {
                height: getWindowHeight(),
              });
              router.push("/home/dev");
            },
          },
          {
            name: "复制路径",
            desc: "复制路径",
            value: "copy-path",
            icon:
              "https://static.91jkys.com/activity/img/ac0d4df0247345b9a84c8cd7ea3dd696.png",
            click: () => {
              clipboard.writeText(fileUrl);
              commit("commonUpdate", {
                showMain: false,
                selected: null,
                options: [],
              });
              ipcRenderer.send("changeWindowSize-mess", {
                height: getWindowHeight([]),
              });
              remote.Notification("Rubick 通知", { body: "复制成功" });
            },
          },
        ],
      });
      // 调整窗口大小
      ipcRenderer.send("changeWindowSize-mess", {
        height: getWindowHeight(state.options),
      });
      return;
    }
    let options = [];

    // check 是否是插件
    if (value) {
      state.devPlugins.forEach((plugin) => {
        // dev 插件未开启
        if (plugin.type === "dev" && !plugin.status) return;
        const feature = plugin.features;
        feature.forEach((fe) => {
          const cmds = searchKeyValues(fe.cmds, value);
          options = [
            ...options,
            ...cmds.map((cmd) => ({
              name: cmd,
              value: "plugin",
              icon: plugin.sourceFile
                ? "image://" + path.join(plugin.sourceFile, `../${plugin.logo}`)
                : plugin.logo,
              desc: fe.explain,
              type: plugin.type,
              click: (router) => {
                actions.openPlugin(
                  { commit },
                  { cmd, plugin, feature: fe, router }
                );
              },
            })),
          ];
        });
      });

      let descMap = new Map();
      options = [
        ...options,
        ...fileLists
          .filter((plugin) => {
            if (!descMap.get(plugin)) {
              descMap.set(plugin, true);
              let has = false;
              plugin.keyWords.some((keyWord) => {
                if (
                  keyWord
                    .toLocaleUpperCase()
                    .indexOf(value.toLocaleUpperCase()) >= 0
                ) {
                  has = keyWord;
                  plugin.name = keyWord;
                  return true;
                }
                return false;
              });
              return has;
            } else {
              return false;
            }
          })
          .map((plugin) => {
            plugin.click = () => {
              actions.openPlugin({ commit }, { plugin });
            };
            return plugin;
          }),
      ];

      descMap = null;
    }

    commit("commonUpdate", {
      options,
    });
    ipcRenderer.send("changeWindowSize-mess", {
      height: getWindowHeight(state.options),
    });
  },
  openPlugin({ commit }, { cmd, plugin, feature, router, payload }) {
    if (plugin.type === "app") {
      execSync(plugin.action);
      commit("commonUpdate", {
        selected: null,
        showMain: false,
        options: [],
        searchValue: "",
      });
      ipcRenderer.send("changeWindowSize-mess", {
        height: getWindowHeight([]),
      });
      return;
    }
    commit("commonUpdate", {
      selected: {
        key: "plugin-container",
        name: cmd.label ? cmd.label : cmd,
        icon: "image://" + path.join(plugin.sourceFile, `../${plugin.logo}`),
      },
      searchValue: "",
      showMain: true,
    });
    ipcRenderer.send("changeWindowSize-mess", {
      height: getWindowHeight(),
    });
    if (plugin.type === "system") {
      systemMethod[plugin.tag][feature.code]();
      commit("commonUpdate", {
        selected: null,
        showMain: false,
        options: [],
      });
      ipcRenderer.send("changeWindowSize-mess", {
        height: getWindowHeight([]),
      });
      router.push({
        path: "/home",
      });
      return;
    }
    commit("commonUpdate", {
      pluginInfo: {
        cmd,
        ...plugin,
        detail: feature,
        payload,
      },
    });

    router.push({
      path: "/plugin",
      query: {
        ...plugin,
        _modify: Date.now(),
        detail: JSON.stringify(feature),
      },
    });
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}