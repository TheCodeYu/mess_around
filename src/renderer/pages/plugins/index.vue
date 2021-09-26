<template>
  <div>
    <webview
      v-if="!pluginInfo.subType"
      id="webview"
      :src="path"
      :preload="preload"
    ></webview>
    <div v-else>
      <webview id="webview" :src="templatePath" :preload="preload"></webview>
    </div>
  </div>
</template>

<script>
import path from "path";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      preload: `File://${path.join(__static, './preload.js')}`,
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
    this.setSubPlaceHolder(`Hi ${this.pluginInfo.name}`);
  },
  methods: {
    ...mapMutations("main", ["setSubPlaceHolder", "commonUpdate"]),
  },
   beforeDestroy() {
     this.setSubPlaceHolder(`Hi Mess Around`);
     this.commonUpdate({
        searchValue: '',
        options:[]
      });
    
    const webview = document.querySelector('webview');
    webview && webview.send('onPluginOut', this.pluginInfo)
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
      return `File://D:\\zhouyu\\Git\\mess_around\\plugin-demo\\index.html`;
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