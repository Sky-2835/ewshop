<template>
  <div class='goodsList'>
       <!-- 商品组件 -->  
       <goods-list-item v-for="(item,i) in goodsListData" :key='i' :goodsData='item'></goods-list-item>
  </div>
</template>
<script>

/* 商品组件 */
import goodsListItem from './goodsList-item.vue';

export default {
  name: 'goodsList',
  props: {
      goodsListData:{
          type:Array,
          defaule:()=>[],
      }
  },
  components: {goodsListItem},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {},
  created() {},
  mounted() {},
  beforeDestroy() {}
};
</script>
<style lang='less' scoped>
.goodsList{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 5px 5px 5px 5px;
}
</style>