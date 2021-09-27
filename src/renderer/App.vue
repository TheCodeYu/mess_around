<template>
  <div @mousedown="drag">
    <a-layout id="components-layout">
      <div v-if="!searchType" class="mess-select">
        <div class="tag-container" v-if="selected">
          <a-tag
            :key="selected.key"
            @close="closeTag"
            class="select-tag"
            color="green"
            closable
          >
            {{ selected.name }}
          </a-tag>
        </div>
        <a-input
          id="search"
          :placeholder="subPlaceHolder"
          @mousedown.stop="dragWhenInput"
          class="main-input"
          @change="(e) => search({ value: e.target.value })"
          @keydown.ctrl.86="shouldPaste"
          :value="searchValue"
          :maxLength="1000"
          @keydown.down="() => changeCurrent(1)"
          @keydown.up="() => changeCurrent(-1)"
          @keypress.enter="
            (e) => targetSearch({ value: e.target.value, type: 'enter' })
          "
          @keypress.space="
            (e) => targetSearch({ value: e.target.value, type: 'space' })
          "
        >
          <div @click="goMenu" class="suffix-tool" slot="suffix">
            <a-icon
              v-show="selected && selected.key === 'plugin-container'"
              class="icon-more"
              type="more"
            />
            <div v-if="selected && selected.icon" style="position: relative">
              <a-spin v-show="pluginLoading" class="loading">
                <a-icon
                  slot="indicator"
                  type="loading"
                  style="font-size: 42px"
                  spin
                />
              </a-spin>
              <img class="icon-tool" :src="selected.icon" />
            </div>
            <div v-else class="mess-logo">
              <img src="./assets/imgs/logo.png" />
            </div>
          </div>
        </a-input>
        <div class="options" v-show="showOptions">
          <a-list item-layout="horizontal" :data-source="options">
            <a-list-item
              @click="() => item.click($router)"
              :class="currentSelect === index ? 'active op-item' : 'op-item'"
              slot="renderItem"
              slot-scope="item, index"
            >
              <a-list-item-meta :description="item.desc">
                <span slot="title" v-html="renderTitle(item.name)"></span>
                <a-avatar
                  slot="avatar"
                  style="border-radius: 0"
                  :src="item.icon"
                />
              </a-list-item-meta>
              <a-tag v-show="item.type === 'dev'">开发者</a-tag>
              <a-tag v-show="item.type === 'system'">系统</a-tag>
            </a-list-item>
          </a-list>
        </div>
      </div>
      <div class="mess-select-subMenu" v-else>
        <div>
          <img
            class="icon-tool-sub"
            v-if="pluginInfo.icon"
            :src="pluginInfo.icon"
          />
          <a-input
            :placeholder="subPlaceHolder"
            class="sub-input"
            @change="
              (e) =>
                search({
                  value: e.target.value,
                  searchType: pluginInfo.searchType,
                })
            "
            :value="searchValue"
            @keypress.enter="
              (e) => targetSearch({ value: e.target.value, type: 'enter' })
            "
            @keypress.space="
              (e) => targetSearch({ value: e.target.value, type: 'space' })
            "
          ></a-input>
        </div>
        <div class="icon-container">
          <a-icon class="icon" type="info-circle" />
          <a-icon class="icon" @click="goMenu('separate')" type="setting" />
        </div>
      </div>
      <router-view></router-view>
    </a-layout>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { clipboard, ipcRenderer, remote } from "electron";
import { getWindowHeight, debounce } from "./assets/common/utils";
import { Platform } from "../main/common/utils";
import { Event } from "../main/common/common";
import { MAIN_MENU } from "../renderer/assets/common/constant";
const opConfig = remote.getGlobal("opConfig");
const { Menu } = remote;
export default {
  data() {
    return {
      searchFn: null,
      config: opConfig.get(),
      currentSelect: 0,
      menu: MAIN_MENU,
    };
  },
  created() {
    ///设置当前插件信息
    window.setPluginInfo = (pluginInfo) => {
      this.commonUpdate({ pluginInfo: pluginInfo });
    };
  },

  mounted() {
    // 打开偏好设置
    ipcRenderer.on(Event.traySetting, () => {
      this.showMainUI({ key: "settings" });
      this.changePath({ key: "settings" });
    });
    const searchNd = document.getElementById("search");
    searchNd && searchNd.addEventListener("keydown", this.checkNeedInit);
  },
  methods: {
    ...mapActions("main", ["onSearch", "showMainUI"]),
    ...mapMutations("main", ["commonUpdate"]),
    shouldPaste(v) {
      let filePath;
      if (Platform.windows()) {
        const rawFilePath = clipboard.read("FileNameW");
        filePath = rawFilePath.replace(
          new RegExp(String.fromCharCode(0), "g"),
          ""
        );
        if (filePath.indexOf("plugin.json") >= 0) {
          this.search({ filePath, disableDebounce: true });
        }
      }
    },
    targetSearch(action) {
      // 在插件界面唤起搜索功能
      if (
        (this.selected && this.selected.key === "plugin-container") ||
        this.searchType === "subWindow"
      ) {
        const webview = document.getElementById("webview");
        if (action.type === "space") {
          if (this.config.perf.common.space) {
            webview.send("msg-back-setSubInput", this.searchValue);
          }
          return;
        }
        webview.send("msg-back-setSubInput", this.searchValue);
      } else if (this.showOptions) {
        const item = this.options[this.currentSelect];
        item.click(this.$router);
      }
    },
    renderTitle(title) {
      if (typeof title !== "string") return;
      const result = title.toLowerCase().split(this.searchValue.toLowerCase());
      if (result && result.length > 1) {
        return `<div>${result[0]}<span style="color: red">${this.searchValue}</span>${result[1]}</div>`;
      } else {
        return `<div>${result[0]}</div>`;
      }
    },
    checkNeedInit(e) {
      // 如果搜索栏无内容，且按了删除键，则清空 tag
      if (this.searchValue === "" && e.keyCode === 8) {
        this.closeTag();
      }
    },
    search(v) {
      if (!v.disableDebounce) {
        this.onSearch(v);
        return;
      }
      if (!this.searchFn) {
        this.searchFn = debounce(this.onSearch, 200);
      }
      this.searchFn(v);
    },
    newWindow() {
      ipcRenderer.send("new-window", {
        ...this.pluginInfo,
      });
      this.closeTag();
    },
    goMenu(type) {
      if (
        (this.selected && this.selected.key === "plugin-container") ||
        type === "separate"
      ) {
        const pluginMenu = [
          {
            label: "开发者工具",
            click: () => {
              document.getElementById("webview").openDevTools();
            },
          },
          {
            label: "当前插件信息",
            submenu: [
              {
                label: "简介",
              },
              {
                label: "功能",
              },
            ],
          },
          {
            label: "隐藏插件",
          },
        ];
        if (type !== "separate") {
          pluginMenu.unshift({ label: "分离窗口", click: this.newWindow });
        }
        let menu = Menu.buildFromTemplate(pluginMenu);
        menu.popup();
        return;
      }
      if (this.selected) {
        this.closeTag();
      } else {
        this.showMainUI({ key: this.current[0] });
        this.changePath({ key: this.current[0] });
      }
    },
    changePath({ key }) {
      this.$router.push({ path: `/home/${key}` });
      this.commonUpdate({
        current: [key],
      });
    },
    changeCurrent(index) {
      const webview = document.getElementById("webview");
      webview && webview.send("changeCurrent", index);
      if (!this.options) return;
      if (
        this.currentSelect + index > this.options.length - 1 ||
        this.currentSelect + index < 0
      )
        return;
      this.currentSelect = this.currentSelect + index;
    },
    drag() {
      ipcRenderer.send(Event.windowMove);
    },
    dragWhenInput(e) {
      if (this.searchValue == "") {
        ipcRenderer.send(Event.windowMove);
      }
    },
    closeTag(v) {
      this.commonUpdate({
        selected: null,
        showMain: false,
        option: [],
      });
      ipcRenderer.send(Event.changeWindowSize, {
        height: 60,
      });
      if (this.$router.history.current.fullPath !== "/home") {
        // 该if是为了避免跳转到相同路由而报错。
        // (之前在输入栏为空时按退格会疯狂报错)
        this.$router.push({
          path: "/home",
        });
      }
    },
  },
  computed: {
    ...mapState("main", [
      "showMain",
      "devPlugins",
      "current",
      "options",
      "selected",
      "searchValue",
      "subPlaceHolder",
      "pluginInfo",
      "pluginLoading",
    ]),
    showOptions() {
      //显示搜索选项，没有MainUI时
      if (this.options.length && !this.showMain) {
        return true;
      }
      return false;
    },
    searchType() {
      return this.pluginInfo.searchType ? "subWindow" : "";
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#components-layout {
  padding-top: 60px;
  height: 100vh;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0;
  }
}
.mess-select,
.mess-select-subMenu {
  display: flex;
  padding-left: 10px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .mess-logo {
    width: 40px;
    height: 40px;
    background: #574778;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    img {
      width: 32px;
    }
  }
  .tag-container {
    display: flex;
    align-items: center;
    background: #fff;

    .select-tag {
      height: 36px;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
  }

  .ant-input:focus {
    border: none;
    box-shadow: none;
  }

  .options {
    position: absolute;
    top: 62px;
    left: 0;
    width: 100%;
    z-index: 99;
    max-height: calc(~"100vh - 60px");
    overflow: auto;
    .op-item {
      padding: 0 10px;
      height: 60px;
      line-height: 50px;
      max-height: 500px;
      overflow: auto;
      background: #fafafa;
      &.active {
        background: #dee2e8;
      }
    }
  }
}
.mess-select-subMenu {
  -webkit-app-region: drag;
  background: #eee;
  height: 50px;
  padding-left: 200px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon-tool-sub {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    margin-right: 10px;
  }
  .icon-container {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #999;
    .icon {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .sub-input {
    width: 310px;
    border-radius: 100px;
  }
}
.suffix-tool {
  display: flex;
  align-items: center;
  .icon-more {
    font-size: 26px;
    font-weight: bold;
    cursor: pointer;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
