<template>
  <div class="goods-item"> 
    <img v-lazy="goodsData.cover_url" alt="err"  @click.stop="goDetail(goodsData.id)"  />
    <div class="goodsInfo">
      <p>{{goodsData.title}}</p>
      <span class="price"><small>￥</small>{{goodsData.price}}</span>
      <span class="collect"><i class="iconfont icon-colect"></i><span>{{goodsData.collects_count}}</span></span>
    </div>
  </div>
</template>
<script>
export default {
  name: "goods-item",
  props: {
      goodsData:{
          type:Object,
          default:()=>{}
      }
  },
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    //点击跳转到商品详情页 
    goDetail(id){
       this.$router.push({path:'/detail',query:{id}},onComplete => {},onAbort => {})
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
.goods-item {
  width: 46%;
  padding-bottom: 20px;
  text-align: center;
  overflow: hidden;
  > img {
    width: 85%;
    border-radius: 5px;
  }
  .goodsInfo {
    text-align: center;
    /* margin-top: 6px; */
    font-size: 12px;
    p {
      margin-bottom: 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .price {
      color: red;
      margin-right: 27px;
    }
    .collect {
      position: relative;
      /*   ↓直接Icon 图标 不用伪类 
            position: relative;
            &::before{
                color: red;
                position: absolute;
                filter: drop-shadow(0 0 0 black);
                top: -1px;
                left: -16px; 
                height: 14px;     必须写宽高  
                width: 14px;
                content:'';
                background: url('~assets/img/colect.png') no-repeat;
                background-size: 100% 100%;        不能在上面简写 不然无效 
                padding-right: 4px;
            }
        */
      i {
        transform: scale(1.3);
        position: absolute;
        top:-4px;
        left: -14px;
        color: white;
        filter: drop-shadow(0 0 0 black);
        &:hover {
          color: red;
        }
      }
      span{
          margin-left: 6px;
      }
    }
  }
}
</style>
