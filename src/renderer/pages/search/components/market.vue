<template>
  <div class="market">
    <a-carousel v-if="bannerList && !!bannerList.length" arrows>
      <div class="custom-slick-arrow" style="left: 10px; zindex: 1">
        <a-icon type="left-circle" />
      </div>
      <div class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle" />
      </div>
      <div v-for="banner in bannerList" v-bind:key="banner">
        <img @click="jumpTo(banner.link)" width="100%" :src="banner.src" />
      </div>
    </a-carousel>
    <a-divider v-if="bannerList && !!bannerList.length"></a-divider>
    <h2>插件</h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pluginList: [],
      loading: {},
      bannerList: [],
      show: false,
      currentSelect: {},
    };
  },
};
</script>

<style lang="less">
.market-plugin-detail {
  img {
    width: 100%;
  }
  height: 430px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
}
.plugin-market-desc {
  display: flex;
  img {
    margin-right: 20px;
  }
  .desc {
    flex: 1;
  }
  .info {
    font-size: 12px;
    color: #999;
    font-weight: normal;
    padding-right: 40px;
  }
  .actor {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }
}
.market {
  height: calc(~"100vh - 110px");
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  .ant-carousel .slick-slide {
    text-align: center;
    height: 235px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }
  .ant-carousel .custom-slick-arrow:before {
    display: none;
  }
  .ant-carousel .custom-slick-arrow:hover {
    opacity: 0.5;
  }

  .ant-carousel .slick-slide h3 {
    color: #fff;
  }
  .ant-list-item {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
  }
  .ant-list-item-meta-description {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
