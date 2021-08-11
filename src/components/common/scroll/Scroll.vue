<template>
  <div class="warpper" ref="warpper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";

export default {
  name: "",
  props: {
    probeType:{
      type:Number,
      default:0,
    },
    pullUpLoad:{
      type:Boolean,
      default:false
    },
    pullDownRefresh:{
      type:[Boolean,Object],
      default:false
    },
    observeImage:{
      type:[Boolean,Object],
      default:false
    },
    observeDOM:{
      type:Boolean,
      default:false
    }
  },
  components: {},
  data() {
    return {
      scroll: null,
    };
  },
  computed: {},
  watch: {},
  methods: {
    scrollTo(x, y, tiem = 300) {
      this.scroll && this.scroll.scrollTo(x, y, tiem);
    },
    finishPullUp(){
      this.scroll && this.scroll.finishPullUp() 
    },
    refresh(){
      this.scroll.refresh();
    },
  },
  created() {
  },
  mounted() {
    /* 创建实例对象 */
    this.scroll = new BScroll(this.$refs.warpper, {
      click: true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad,
      pullDownRefresh:this.pullDownRefresh,
      observeImage:this.observeImage,
      observeDOM:this.observeDOM,
    });
    
    /* 把实时监听的滚动位置数据 发送给父组件 */
    this.scroll.on('scroll',(position)=>{
        this.$emit('_scroll',position)
    })

    /* 监听上拉(加载更多)事件 */
   if(this.pullUpLoad){
      this.scroll.on('pullingUp',()=>{
      this.$emit('_pullingUp')
    })
   }
   /* 监听下拉(刷新)事件 */
   if(this.pullDownRefresh){
     this.scroll.on('pullingDown',()=>{
       this.$emit('_pullingDown')  
     }) 
     /* 1------1 */
     this.scroll.on('enterThreshold',()=>{
        this.$emit('_enterThreshold')  
     })

     this.scroll.on('leaveThreshold',()=>{
        this.$emit('_leaveThreshold')
     })
     /* 1------1 */
   }
  },
  beforeDestroy() {},
};
</script>
<style lang="less" scoped></style>
