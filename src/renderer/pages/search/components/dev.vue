<template></template>
<script>
export default {};
</script>


<style lang="less">
.dev-container {
  height: calc(~"100vh - 110px");
  width: 100%;
  .ant-menu-item {
    height: 60px !important;
    display: flex;
    align-items: center;
    .menu-item {
      display: flex;
      align-items: center;
      line-height: 22px !important;
      img {
        margin-right: 10px;
      }
      .title {
        color: rgba(0, 0, 0, 0.8);
      }
      .desc {
        color: #999;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .dev-detail {
    display: flex;
    align-items: flex-start;
    height: 100%;
    width: 100%;
  }
  .plugin-detail {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    flex: 1;
    width: 500px;
    .detail-container {
      height: 320px;
      overflow: auto;
      max-height: 320px;
      width: 100%;
      margin: 0;
      padding: 0;

      * {
        width: 100%;
      }
    }
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
    .desc-item {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      width: 100%;
      overflow: auto;
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
