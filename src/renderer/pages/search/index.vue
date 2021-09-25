<template>
  <div>
    <div v-show="showMain">
      <a-menu :selectedKeys="current" mode="horizontal" @select="changePath">
        <a-menu-item :key="item.key" v-for="item in MAIN_MENU">
          <a-icon :type="item.img" />
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </div>
    <router-view v-show="showMain" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { MAIN_MENU } from "../../assets/common/constant";
export default {
  name: "search",
  data() {
    return {
      MAIN_MENU: MAIN_MENU,
    };
  },
  methods: {
    ...mapActions("main", ["showMainUI"]),
    ...mapMutations("main", ["commonUpdate"]),
    changePath({ key }) {
      this.showMainUI({ key: key });
      this.$router.push({ path: `/home/${key}` });
      this.commonUpdate({
        current: [key],
      });
    },
  },
  computed: {
    ...mapState("main", ["showMain", "current"]),
  },
};
</script>

<style lang="less">
.main-input {
  height: 60px !important;
  flex: 1;

  .ant-select-selection,
  .ant-input,
  .ant-select-selection__rendered {
    height: 60px !important;
    font-size: 22px;
    border: none !important;
  }

  .icon-tool {
    font-size: 24px;
    background: #314659;
    color: #fff;
    height: 40px;
    width: 40px;
    border-radius: 100%;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
</style>
