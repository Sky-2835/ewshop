<template>
  <div class='tabControl'> 
     <div class="tab-control-item" v-for="(item,i) in titles" :key="i"><span  :class="{'active':i == currentNum}" @click="btnCurrent(i)">{{item}}</span></div>
  </div>
</template>
<script>
export default {
  name: 'tabControl',
  props: {
      /* 父组件首页传来的 titles tabs标题 数据 */
      titles:{
          type:Array,
          default:()=>[],
      }
  },
  components: {},
  data() {
    return {
        currentNum:0,
    };
  },
  computed: {},
  watch: {},
  methods: {
      /* 当前选中 */
      btnCurrent(i){
        this.currentNum = i;
        /* 传个父组件，当前选中的数据 */ 
        this.$emit('tabClick',i)
      },
      
  },
  created() {},
  mounted() {},
  beforeDestroy() {}
};
</script>
<style lang='less' scoped>
.tabControl{
    height: 40px;
    display: flex;
    align-items: center;
    line-height: 40px;
   /*  position: sticky;
       top: 45px; 粘滞定位，滚动到此位置时，不动  。
       backdrop-filter: blur(10px);  只是首页需要，所以在首页写*/
   background-color: #FFFFFF;    /* 跟上面冲突 */
    .tab-control-item{
        flex: 1;
        text-align: center;
        span{
           font-size: 15px;
           padding: 6px;
           border-bottom: 2px solid transparent;
        }
        /* 选中时 */
        .active{
            color:var(--color-tint);
            border-bottom: 2px solid var(--color-tint)
        }
    }
}
</style>