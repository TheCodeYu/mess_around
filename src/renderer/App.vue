<template>
  <div @mousedown="drag">
    <a-layout id="components-layout">
      <router-view></router-view>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "mess-around",
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
</style>
