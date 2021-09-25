<template>
  <div>
    <h2>1112</h2>
    <webview
      v-if="!pluginInfo.subType"
      id="webview"
      :src="path"
      :preload="preload"
    ></webview>
    <div v-else>
      <h2>222</h2>
      <webview id="webview" :src="templatePath" :preload="preload"></webview>
    </div>
  </div>
</template>

<script>
import path from "path";
import { mapMutations, mapState } from "vuex";
import { remote } from "electron";
const currentWindow = remote.getCurrentWindow();
const winId = currentWindow.id;
export default {
  name: "index.vue",
  data() {
    return {
      preload: `File://${path.join(__static, "./preload.js")}`,
      webview: null,
      config: {},
    };
  },
  mounted() {
    console.log(this.path);
    console.log(this.preload);
    this.webview = document.querySelector("webview");

    this.webview.addEventListener("dom-ready", () => {
      this.webview.send("onPluginReady", this.pluginInfo);
      this.webview.send("onPluginEnter", this.pluginInfo);
      this.commonUpdate({
        pluginLoading: true,
      });
    });
    this.webview.addEventListener("did-finish-load", () => {
      this.commonUpdate({
        pluginLoading: false,
      });
    });
    this.setSubPlaceHolder("Hi, Rubick");
  },
  methods: {
    ...mapMutations("main", ["setSubPlaceHolder", "commonUpdate"]),
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
      //   this.$nextTick(() => {
      //     this.webview && this.webview.send("onPluginEnter", this.pluginInfo);
      //   });
      return `File://${this.pluginInfo.sourceFile}`;
    },
    templatePath() {
      return `File://${path.join(__static, "./plugins/tpl/index.html")}?code=${
        this.pluginInfo.detail.code
      }&targetFile=${encodeURIComponent(
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