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
    console.log(this.query);
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
    this.setSubPlaceHolder(`Hi ${this.pluginInfo.name}`);
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
    webview && webview.send("onPluginOut", this.pluginInfo);
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