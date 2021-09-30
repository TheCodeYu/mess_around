<template>
  <div>
    <webview v-if="query.type !== 'system'"
      id="webview"
      :src="path"
      :preload="preload"
    />
    <webview v-else
      id="webview"
      :src="systemPath" 
      :preload="preload"/>
  </div>
</template>

<script>
import path from "path";
import { mapMutations, mapState } from "vuex";
import {Event} from '../../../main/common/common'
export default {
  data() {
    return {
      preload: `File://${path.join(__static, "./preload.js")}`,
      query: this.$route.query,
      webview: null,
      config: {},
    };
  },
  mounted() {
    this.webview = document.querySelector("webview")

    this.webview.addEventListener("dom-ready", () => {
      this.webview.send(Event.lifetime.pluginEnter, this.pluginInfo);
      this.commonUpdate({
        pluginLoading: true,
      });
    });

    this.webview.addEventListener("did-finish-load", () => {
      this.commonUpdate({
        pluginLoading: false,
      });
      this.webview.send(Event.lifetime.pluginLoadingEnd, this.pluginInfo);
    });

    this.setSubPlaceHolder(`Hi ${this.pluginInfo.pluginName}`);
  },
  methods: {
    ...mapMutations("main", ["setSubPlaceHolder", "commonUpdate"]),
  },
  beforeDestroy() {
    this.setSubPlaceHolder(`Hi Mess Around`);
    this.commonUpdate({
      searchValue: "",
      options: [],
    });

    const webview = document.querySelector("webview");
    webview && webview.send(Event.lifetime.PluginExit);
  },
  computed: {
    ...mapState("main", ["searchValue", "devPlugins", "pluginInfo"]),
    pluginDetail() {
      return (
        this.devPlugins.filter(
          (plugin) => plugin.name === this.pluginInfo.name
        )[0] || {}
      ).features;
    },
    path() {
      // this.$nextTick(() => {
      //   this.webview && this.webview.send("onPluginEnter", this.pluginInfo);
      // });
      return `File://${this.pluginInfo.sourceFile}`;
    },
    ///文档插件
    systemPath() {
      return `File://${path.join(__static, "./plugins/tpl/index.html")}?code=&targetFile=${encodeURIComponent(
        this.pluginInfo.sourceFile
      )}&preloadPath=${this.pluginInfo.preload}`;
    },
  },
};
</script>

<style lang="less">
#webview {
  width: 100%;
  height: calc(~"100vh - 60px");
}
</style>