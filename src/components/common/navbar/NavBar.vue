<template>
  <div class="NavBar">
      <div class='left'><slot name='left'><img src="~assets/img/left.png" alt="err" @click="btnImg"></slot></div>
      <div class='center'><slot></slot></div>
      <div class='right'><slot name='right'></slot></div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() { 
    return {

    }
  },
  props: {

  },
  components:{
  },
  mounted() {

  }, 
  methods:{
     btnImg(){
       this.$router.back()
     }
  },
 }
</script>

<style lang='less' scoped>
.NavBar{
  display: flex;
  height: 45px;
  text-align: center;
  line-height: 45px;
  box-shadow: 0 2px 0 rgba(100, 100,100,0.1);
  background-color: var(--color-high-text);
  color: #fff;
 /*  position: fixed; 在组件使用时再决定是否脱离文档流，脱离是为了 源生滚动时，它固定不动。用了Better-scroll后，就没必要了
  left: 0;
  right: 0;
  top: 0;
  z-index: 9999; */

  .left , .right{
    width: 60px;
    img{
      height: 28px;
      vertical-align: middle;
      padding: 5px;
    }
  };
  /*  & .right{
        width: 45px;
      }; */
  .center{
    flex: 1;
  }
}
</style>