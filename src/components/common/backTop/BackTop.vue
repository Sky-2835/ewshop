<template>
  <div class="backTop">
    <img src="~assets/img/back-top.png" alt="err" />
  </div>
</template>
<script>
export default {
  name: "backTop",
  props: {},
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
@media screen and (max-width: 500px) {
  .backTop {
    position: fixed;
    right: 8px;
    bottom: 58px;
    img {
      width: 35px;
      height: 35px;
      vertical-align: middle;
    }
  }
}

@media screen and(min-width: 500px){
  .backTop {
    position: fixed;
    right:12px;
    bottom: 63px;
    img {
      width: 60px;
      height: 60px;
      vertical-align: middle;
    }
  }
}
</style>
