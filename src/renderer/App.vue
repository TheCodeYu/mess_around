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
          @mousedown.stop="dragWhenInput"
          class="main-input"
          @change="(e) => serach({ value: e.target.value })"
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
        </a-input>
      </div>
      <router-view></router-view>
    </a-layout>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { ipcRenderer, remote } from "electron";
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
        height: 100,
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
    ...mapState("main", ["pluginInfo"]),
    seachType() {
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
</style>
