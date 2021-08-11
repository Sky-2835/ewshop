<template>
  <div class="home">
    <!-- 导航条 -->
    <nav-bar class="topNavBar">
      <template>图书兄弟</template>
      <!-- v-slot:default 可写可不行，本来就插匿名槽 -->
    </nav-bar>

    <!-- 假吸顶 选项卡 -->
    <tab-control
      :titles="['畅销', '新书', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isSuckTop"
      class="tab-control"
    ></tab-control>

    <scroll
      class="warpper"
      ref="scroll"
      :probeType="3"
      @_scroll="scroll"
      :pullUpLoad="true"
      @_pullingUp="pullingUp"
      :pullDownRefresh="false"
      @_pullingDown="pullingDown"
      @_enterThreshold="enterThreshold"
      @_leaveThreshold="leaveThreshold"
      :observeImage="{ debounceTime: 100 }"
      :observeDOM='true'
    >
      <!--  1------1   -->
      <div
        class="box"
        v-show="showBox"
        style="min-height:40px;text-align:center;line-height:40px"
      >
        {{ howText ? "下拉刷新" : istext1 ? "松开手指刷新" : "我要刷新了" }}
      </div>
      <!--  1------1   -->

      <div ref="banRe">
        <!-- 轮播图 -->
          <home-swiper :banners='banners' @reImgLoad="reImgLoad"></home-swiper>

        <!-- 推荐列表 -->
        <recommend-view
          :recommendGoodsList="recommendGoodsList"
          @reImgLoad="reImgLoad"
        ></recommend-view>
      </div>

      <!-- 选项卡 Tabs-->
      <!-- 子组件发射的自定↓义事件,触发时执行后面的回调函数-->
      <tab-control
        :titles="['畅销', '新书', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>

      <!-- 商品列表 -->
      <goods-list :goodsListData="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backtop" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
/* 轮播图 */
import HomeSwiper from "views/Home/childComps/HomeSwiper.vue";

/* 简单封装的BS组件 */
import scroll from "components/common/scroll/Scroll.vue";

/* 回到顶部组件 */
import backTop from "components/common/backTop/BackTop.vue";

/* import NavBar from 'components/common/navbar/NavBar.vue' */

/* 推荐列表组件 */
import recommendView from "views/Home/childComps/recommendView.vue";

/* 请求所有首页数据 请求商品列表数据*/
import { aGetHomeAllData, aGetHomeGoods } from "network/home.js";

/* 选项卡Tabs组件 */
import tabControl from "components/content/tabControl/tabControl.vue";

/* 商品列表组件 */
import goodsList from "components/content/goods/goodsList.vue";

export default {
  name: "Home",
  components: {
    HomeSwiper,
    backTop,
    scroll,
    /*  NavBar, */
    recommendView,
    tabControl,
    goodsList
  },
  data() {
    return {
      /* 推荐商品列表数据 */
      recommendGoodsList: [],

      /* 商品列表数据 */
      currentType: "scale",
      goodsListData: {
        scale: { page: 0, list: [] },
        new: { page: 0, list: [] },
        recommend: { page: 0, list: [] },
      },

      isShowBackTop: false,
      isSuckTop: false,
      isLoad: 0,
      runNumber: null,
      /* 1------1 */
      showBox: false,
      howText: true,
      istext1: false,
      pullDownRefreshConfig: { threshold: 50, stop: 40 },
      /* 1-------1 */
      /* 轮播图数据 */
      banners:[],
    };
  },
  computed: {
    /* 商品数据 */
    showGoods() {
      return this.goodsListData[this.currentType].list;
    },
  },
  methods: {
    /* 根据监听子组件自定义事件，传来的选中的title数值 */
    tabClick(a) {
      let type = ["scale", "new", "recommend"];
      this.currentType = type[a];
      // 让假选项卡内的 选中值也变；只是为了让他们样式保持一致。点击谁 本页面数据都是一致的
      this.$refs.tabControl1.currentNum = a;
      this.$refs.tabControl2.currentNum = a;
      if(this.isSuckTop){
        this.$refs.scroll.scrollTo(0,-this.runNumber,0)
      }
    },

    GetHomeGoods(type) {
      const page = this.goodsListData[type].page + 1;
      aGetHomeGoods(type, page)
        .then((res) => {
          this.goodsListData[type].list.push(...res.data.goods.data);
          this.goodsListData[type].page += 1;
          this.$refs.scroll.scroll.refresh();
        })
        .catch((err) => console.log("获取商品数据错误"));
    },

    /* 回到顶部 */
    backtop() {
      /*  if(window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop){
        window.scroll(0,0)
      }else{
        this.$refs.scroll.scrollTo(0,0,1000)
      } */
      this.$refs.scroll.scrollTo(0, 0, 1000);
    },

    /* 距离大于500时 显示回到顶部按钮 */
    scroll(position) {
      //是否回到顶部
      this.isShowBackTop = -position.y > 500;
      //是否假吸顶
      this.isSuckTop = -position.y > this.runNumber;
    },

    /* 上拉加载更多 */
    pullingUp() {
      this.GetHomeGoods(this.currentType);
      /* 是否无限上拉加载更多 ↓ */
      this.$refs.scroll.finishPullUp();
      /* 上拉加载时刷新，免得卡顿 */
      this.$refs.scroll.scroll.refresh();
    },

    /* 下拉刷新 */
    pullingDown() {
      console.log("我要刷新了");
      this.istext1 = false;
      setTimeout(() => {
        location.reload();
      }, 2000);
      /* location.reload() */
    },
    /* 1-------1  */
    enterThreshold() {
      console.log("下拉刷新");
      this.showBox = true;
    },
    leaveThreshold() {
      console.log("松开手指刷新");
      this.howText = false;
      this.istext1 = true;
    },
    /* 1-------1  */

    reImgLoad() {
      this.isLoad++;
    },
  },

  created() {
    aGetHomeAllData()
      .then((res) => {
        /* console.log(res); */
        this.recommendGoodsList = res.data.goods.data;
        this.banners = res.data.slides;
      })
      .catch((err) => console.log('获取所有数据失败'));

    this.GetHomeGoods("scale");
    this.GetHomeGoods("new");
    this.GetHomeGoods("recommend");
  },
  mounted() {
  },

  watch: {
    isLoad(newVal, oldVal) {
      if (newVal == 2) {
        this.runNumber = this.$refs.banRe.offsetHeight;
        console.log(this.runNumber);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home {
  position: relative;
  height: 100vh;
}

.tab-control {
  position: relative;
  z-index: 8;
}
.warpper {
  overflow: hidden;
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0;
  right: 0; // 用绝对定位或者↓ 确定warpper的高度
  /*  height: calc(100% - 95px) // 顶部，底部导航栏的高度。 */
}
</style>
