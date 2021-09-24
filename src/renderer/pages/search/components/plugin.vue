<template></template>
<script>
export default {};
</script>

<style lang="less">
.dev-container {
  height: calc(~"100vh - 110px");
  overflow: auto;
  .dev-detail {
    display: flex;
    align-items: flex-start;
    height: 100%;
    overflow: auto;
  }
  .plugin-detail {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    .plugin-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .title {
        font-size: 20px;
        display: flex;
        align-items: center;
      }
      .desc {
        font-size: 13px;
        color: #999;
      }
    }
    .detail-container,
    .feature-container {
      height: 340px;
      overflow: auto;
    }
    .desc-item {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      .desc-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .desc-info {
        color: #999;
      }
    }
  }
  .empty {
    padding-top: 20px;
  }
}
</style>
