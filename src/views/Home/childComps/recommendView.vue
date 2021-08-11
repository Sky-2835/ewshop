<template>
  <div class="recommendView">
      <div class="recommendView-item" v-for='item in recommendGoodsList.slice(0,4)' :key='item.id'>
        <a @click.prevent="goDetail(item.id)">   <!-- 取消默认跳转，改为点击事件 -->
          <img v-lazy="item.cover_url" alt="err" @load="imgLoad">
        </a> 
        <div>{{item.title}}</div> 
      </div>
      <!-- <div class="recommendView-item"><a href=""> <img src="~assets/img/icon-07.png" alt="err"></a> <div>风景</div> </div>
           <div class="recommendView-item"><a href=""> <img src="~assets/img/icon-07.png" alt="err"></a> <div>风景</div> </div>
           <div class="recommendView-item"><a href=""> <img src="~assets/img/icon-07.png" alt="err"></a> <div>风景</div> </div> -->
  </div>
</template>

<script>
export default {
  name: 'recommendView',
  data() { 
    return {
      loadNumber:0,
    }
  },
  props: {
    //首页传过来的数据
    recommendGoodsList:{
      type:Array,
      default(){
        return []
      },
    }
  },
  components:{
  },
  mounted(){
  },
  methods:{
    //点击跳转到商品详情页 
    goDetail(id){
       this.$router.push({path:'/detail',query:{id}})
    },

    //加载完发射事件 发出自身的高度
    imgLoad(){
      if(!this.loadNumber){
        this.$emit('reImgLoad')
        this.loadNumber++
      }
    }
  },
  created(){
  },
 }
</script>

<style lang='less' scoped>
.recommendView{
  width: 100%;
  display: flex;
  padding: 10px 0 10px 0;
  border-bottom: 8px solid #eee;
}

.recommendView-item{
  flex: 1;
  text-align: center;
  font-size: 13px;
  img{
    width: 70px;
    height: 70px;
    margin-bottom: 5px;
  }
}
</style>