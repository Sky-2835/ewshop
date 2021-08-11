<template>
  <div id="app">

    <keep-alive include="Home">    <!-- exclude="detail,register,login,shopcart,addressEdit,address,createOrder" -->
      <router-view/> 
    </keep-alive>

    <div class="footer van-hairline--top">
       <div class="tab-bar-item">
         <router-link to="/Home"><i class="iconfont icon-index"></i>首页</router-link>
       </div>
       <div class="tab-bar-item">
         <router-link to="/category"><i class="iconfont icon-shangpin1"></i>分类</router-link>
       </div>
       <div class="tab-bar-item">
         <router-link to="/shopcart">
         <van-badge :content='count' max='9'>
           <i class="iconfont icon-leimupinleifenleileibie2"></i>购物车
         </van-badge>
        </router-link>
       </div>
       <div class="tab-bar-item">
         <router-link to="/users"><i class="iconfont icon-wode1"></i>我的</router-link>
       </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  computed:{
    count(){
      return this.$store.state.cartCount
    }
  },
  created(){
      //获取购物车数量。在这儿或者全局路由导航设置  避免页面刷新，数剧为0。 不论任何页面刷新都行
      //this.$store.dispatch('upCartLIst')
  }
}
</script>

<style lang='less' scoped>

@import 'assets/css/base.css' ;
/* .tab-bar-item{
      background-color:green;
      & .router-link-active{
           color: var(--color-high-text);
      }
  }  */
.router-link-active{
  color: var(--color-high-text);
}

.footer{
  height: 50px;
  display: flex;
  justify-content: space-around;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f6f6f6;
  box-shadow: 0 -2px 1px rgba(100, 100, 100, 0.1);
}

.tab-bar-item{
  margin-top: 5px;
}

i{
  display: block;
  text-align: center;
  margin-bottom: 8px;
}

/deep/.van-badge--fixed{
  top:4px ;
}

</style>

