<template></template>
<script>
export default {};
</script>


<style lang="less">
.pg-settings {
  height: calc(~"100vh - 110px");
  overflow: auto;
  .dev-detail {
    height: 100%;
    display: flex;
    align-items: flex-start;
    background: #fff;
  }
  .settings-detail {
    padding: 20px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    height: 100%;
    .setting-item {
      margin-bottom: 20px;
      .ant-form-item {
        margin-bottom: 0;
      }
      .title {
        color: #6c9fe2;
        font-size: 15px;
        margin-bottom: 10px;
      }
      .settings-item-li {
        padding-left: 20px;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        .label {
          color: #646464;
        }
        .value {
          width: 300px;
          text-align: center;
          border: 1px solid #ddd;
          color: #6c9fe2;
          font-size: 14px;
          height: 24px;
          font-weight: lighter;
        }
      }
    }
  }
  .feature-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;
    .item {
      flex: 1;
    }
    .short-cut {
      margin-left: 20px;
    }
    .value {
      text-align: center;
      border: 1px solid #ddd;
      color: #6c9fe2;
      font-size: 14px;
      height: 24px;
      font-weight: lighter;
      margin-top: 10px;
    }
  }
  .add-global {
    color: #6c9fe2;
    margin-top: 20px;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }
}
</style>
