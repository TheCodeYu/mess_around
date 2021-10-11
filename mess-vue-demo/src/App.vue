<template>
  <!-- <div>
    //<img alt="Vue logo" src="image/logo.png" /> 
    <HelloWorld msg="Welcome to Your Vue.js Calendar App" />
     <Calendar is-expanded title-position="left" trim-weeks/>
    <DatePicker v-model="date" /> 
    <ds-calendar-app :calendar="calendar"></ds-calendar-app>
    
    
  </div> -->
  <div id="main" ref="main"></div>
</template>

<script>
//import HelloWorld from "./components/HelloWorld.vue";
//import { Calendar, DatePicker } from "v-calendar";

import * as monaco from "monaco-editor";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
//import { StandaloneCodeEditorServiceImpl } from 'monaco-editor/esm/vs/editor/standalone/browser/standaloneCodeServiceImpl.js'

export default {
  name: "App",
  data() {
    return {
      // date: new Date(),
      editor: null,
      curTheme: "vs",
    };
  },
  mounted() {


    this.editor = monaco.editor.create(this.$refs.main, {
      theme: this.curTheme,
      value: "",
      language: "sql",
      automaticLayout: true,
    });
  },
  components: {
    //HelloWorld,
    // Calendar,
    // DatePicker,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: "Source Han Sans", "San Francisco", "PingFang SC",
    "Hiragino Sans GB", "Droid Sans Fallback", "Microsoft YaHei", sans-serif;
  transition: background-color 0.2s;
}

#main {
  position: fixed;
  left: 0;
  height: calc(100vh - 50px);
  right: 0;

  margin: 0 auto;
  display: block;

  transition: 0.2s;
  overflow: hidden;
  z-index: 0;
}
</style>
