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
          :placeholder="
            subPlaceHolder && selected && selected.key === 'plugin-container'
              ? subPlaceHolder
              : 'Hi,Mess Around'
          "
          class="main-input"
          @change="(e) => search({ value: e.target.value })"
          @keydown.ctrl.86="shouldPaste"
          :value="searchValue"
          :maxLength="
            selected && selected.key !== 'plugin-container' ? 0 : 1000
          "
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
      </div>
      <router-view></router-view>
    </a-layout>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { clipboard, ipcRenderer, remote } from "electron";
import { getWindowHeight, debounce } from "./assets/common/utils";
const opConfig = remote.getGlobal("opConfig");
export default {
  data() {
    return {
      searchFn: null,
      config: opConfig.get(),
      currentSelect: 0,
    };
  },
  created() {
    window.setPluginInfo = (pluginInfo) => {
      this.commonUpdate({ pluginInfo: pluginInfo });
    };
  },
  mounted() {
    ipcRenderer.on("init-mess", this.closeTag);
  },
  methods: {
    ...mapActions("main", ["onSearch"]),
    ...mapMutations("main", ["commonUpdate"]),
    shouldPaste(v) {
      let filePath;
      if (process.platform === "win32") {
        const rawFilePath = clipboard.read("FileNameW");
        filePath = rawFilePath.replace(
          new RegExp(String.fromCharCode(0), "g"),
          ""
        );
        if (filePath.indexOf("plugin.json") >= 0) {
          this.search({ filePath });
        }
      }
    },
    search(v) {
      if (!this.searchFn) {
        this.searchFn = debounce(this.onSearch, 200);
      }
      this.searchFn(v);
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
      ipcRenderer.send("window-move");
    },
    closeTag(v) {
      this.commonUpdate({
        selected: null,
        showMain: false,
        option: [],
      });
      ipcRenderer.send("changeWindowSize-mess", {
        height: getWindowHeight(),
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
      "searchValue",
      "subPlaceHolder",
      "pluginInfo",
      "selected",
    ]),
    searchType() {
      console.log(this.pluginInfo.searchType);
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
