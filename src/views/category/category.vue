<template>
  <div class="category">
    <nav-bar>
      <template>商品分类</template>
    </nav-bar>

    <div class="mainBox">
      <!-- tab分类 -->
      <div class="orderTab">
        <van-tabs v-model="orderTabActive" @click="orderTabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评论排序"></van-tab>
        </van-tabs>
      </div>
      <div class="mainContent">
        <!-- 左边导航 -->
        <div class="leftmenu">
          <van-collapse v-model="activeNames" accordion :border="false">
            <van-collapse-item
              v-for="(item, index) in categoryData.slice(0, 6)"
              :title="item.name"
              :key="index"
              :name="index + 1"
              :border="false"
              @click.native="changeCollapse(item.id)"
            >
              <van-sidebar v-model="activeKey">
                <van-sidebar-item
                  v-for="(itemSon,i) in item.children.slice(0, 4)"
                  :title="itemSon.name"
                  :key="i"
                  @click="changeGoodsList(itemSon.id)"
                />
              </van-sidebar>
            </van-collapse-item>
          </van-collapse>
        </div>

        <!-- 商品列表 -->
        <scroll
          class="warpper"
          ref="scroll"
          :probeType="3"
          @_scroll="scroll"
          :pullUpLoad="true"
          @_pullingUp="pullingUp"
          :observeImage="{ debounceTime: 100 }"
        >
          <div class="goodsList">
            <van-card
              v-for="(item,i) in showGoods"
              :key="i"
              :num="0"
              :tag="item.sales >= 0 ? '流行' : '标签'"
              :price="item.price"
              :desc="item.updated_at"
              :title="item.title"
              :thumb="item.cover_url"
              :lazy-load="true"
              @click="goDetail(item.id)"
            />
          </div>
        </scroll>

      </div>
    </div>

    <back-top @click.native="backtop" v-show="isShowBackTop"></back-top>
    <div class="allGoods" v-show="goodsId" @click="showAllGoods">
      All
    </div>
  </div>
</template>

<script>
import { aGetCategoryData, aGetGoodsData } from "network/category.js";
import scroll from "components/common/scroll/Scroll.vue";
import backTop from '../../components/common/backTop/BackTop.vue';



export default {
  name: "category",
  data() {
    return {
      /* 左侧分类数据 */
      categoryData: [],

      /* 默认选中 下标 0  tab卡 */
      orderTabActive: 0,
      /* 默认选中 下标0  sidebar */
      activeKey: 0,
      /* 默认展开 下标 0 collapse */
      activeNames: 0,

      /* 计数 是否切换了collapse 切了值就变，值一变activeKey就赋值NaN,清除默认选中 */
      num: "",

      /* 商品列表请求参数 */
      currentType: "sales",
      goodsId: 0,

      /* 商品数据 */
      goodsData: {
        sales: { page: 1,list: [] },
        price: { page: 1,list: [] },
        comments_count: { page: 1,list: [] },
      },
      isShowBackTop:false,
      /* isShowAllGoods:false, */
    };
  },
  props: {},
  components: {
    scroll,
    backTop
  },
  updated(){
    this.$nextTick(()=>{
      this.$refs.scroll.scroll.refresh();
    })
  },
  mounted() {},
  watch: {
    /* 切换展开后，就清空当前默认选中 */
    num() {
      this.activeKey = NaN;
    },
  },
  computed: {
    /* 展示的数据 */
    showGoods() {
      return this.goodsData[this.currentType].list;
    },
  },
  methods: {
    backtop(){
       this.$refs.scroll.scrollTo(0, 0, 1000);
    },
    scroll(position) {
      //是否回到顶部
      this.isShowBackTop = -position.y > 300;
    },
    changeCollapse(id) {
      this.num = id;
    },
    /* 点击排序tab 默认传参 下标，title */
    orderTabClick(i, title) {
      let item = ["sales", "price", "comments_count"];
      this.currentType = item[i];
      this.getGoodsData(this.currentType);
      this.$refs.scroll.scroll.refresh();
      this.$refs.scroll.scrollTo(0, 0, 0);
    },
    /* 选择商品列表 */
    changeGoodsList(id) {
      this.goodsId = id;
       if(this.goodsId != 0){
        this.goodsData[this.currentType].page = 1
      }
      this.getGoodsData(this.currentType);
      this.$refs.scroll.scroll.refresh();
      this.$refs.scroll.scrollTo(0, 0, 0);
    },
    /* 请求函数 */
    getGoodsData(type) {
      aGetGoodsData(type, this.goodsData[type].page, this.goodsId)
        .then((res) => {
          if( this.goodsData[type].page == 1){
             this.goodsData[type].list = res.data.goods.data
          }else{
            /*  const arr1 = this.goodsData[type].list */
             this.goodsData[type].list.push(...res.data.goods.data);
            /*  if(arr1 != this.goodsData[type].list){
                this.goodsData[type].page -= 1
                this.$refs.scroll.scroll.refresh();
             } */
          }
           
       /*    this.goodsData[type].list = res.goods.data; */
          this.$refs.scroll.scroll.refresh();
        })
        .catch((err) => {
          this.goodsData[type].page -= 1
          console.log("请求商品列表数据失败")
          this.$refs.scroll.scroll.refresh();}); 
    },

    pullingUp(){
      this.goodsData[this.currentType].page += 1
      this.getGoodsData(this.currentType)
      /* 上拉加载时刷新，免得卡顿 */
      this.$refs.scroll.scroll.refresh();
      this.$refs.scroll.finishPullUp();
    },

    showAllGoods(){
      location.reload();
    },
    goDetail(id){
      this.$router.push({path:'/detail',query:{id}})
    },
  },
  created() {
    aGetCategoryData()
      .then((res) => {
        this.categoryData = res.data.categories;
      })
      .catch((err) => console.log("请求分类数据失败"));

    this.getGoodsData("sales");
    this.getGoodsData("price");
    this.getGoodsData("comments_count");
  },
};
</script>

<style lang="less" scoped>
.mainBox {
   height: 100%;
  .orderTab {
    width: 100%;
    height: 45px;
    padding-left: 150px;
    .van-tabs {
      height: 100%;
      overflow: hidden;
      /deep/.van-tabs__wrap {
        height: 100%;
      }
    }
  }

  .mainContent {
    height: 100%;
    display: flex;
    .leftmenu {
      width: 130px;
      .van-collapse {
        .van-sidebar {
          width: 100%;
        }
      }
    }
    .goodsList {
      flex: 1;
      min-height: 100vh;
      /*  padding: 5px 10px 0 10px; */
      .van-card {
        padding: 8px;
      }
    }
  }
}

.category {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
.warpper {
  overflow: hidden;
  position: absolute;
  top: 90px;
  bottom: 50px;
  left: 130px;
  right: 0; // 用绝对定位或者↓ 确定warpper的高度
  /*  height: calc(100% - 95px) // 顶部，底部导航栏的高度。 */
}

.allGoods{
  position: fixed;
  height: 35px;
  width: 35px;
  left: 10px;
  bottom: 60px;
  background-color: #41b983;
  font-size: 14px;
  border-radius: 50%;
  text-align: center;
  line-height: 35px;
  color: #f7f7f7;
}
</style>
