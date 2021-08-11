<template>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1989fa">
      <van-swipe-item v-for="(item,i) in banners" :key='i'>
        <img v-lazy="item.img_url" alt="err" @load="imgLoad">
      </van-swipe-item>
    </van-swipe>
</template>
<script>
export default {
  name: "",
  props: {
    banners: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      loadNumber:0,
    };
  },
  computed: {},
  watch: {},
  methods: {
    imgLoad(){
      if(!this.loadNumber){
         this.$emit('reImgLoad')
         this.loadNumber++
      }
    }
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
.my-swipe{
  img{
     width: 100%;
     height: 180px !important; /* 不写死 用auto 必须设置懒加载图片(确定了高度) 不然计算的是 懒加载时图片的高度会偏大，tabControl不准确了 */
  }
}
</style>
