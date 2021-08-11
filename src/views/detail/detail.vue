<template>
  <div class="detail">
    <nav-bar>
      <template>商品详情</template
      ><!-- :{{ $route.query.id }} -->
    </nav-bar>

    <van-tabs
      v-model="active1"
      v-show="isCopyTabShow"
      class="copyTab"
      @click="tabClick1"
    >
      <van-tab title="概述"></van-tab>
      <van-tab title="热评"></van-tab>
      <van-tab title="相关图书"></van-tab>
    </van-tabs>

    <scroll
      class="warpper"
      ref="scroll"
      :observeImage="{ debounceTime: 100 }"
      :probeType="3"
      @_scroll="scroll"
    >
      <div ref="imgCardLoad">
        <div style="width:100%;display:flex;justify-content:center">
          <van-image
            width="80%"
            height="auto"
            lazy-load
            :src="book.detail.cover_url"
            @load="imgLoad"
          />
        </div>

        <van-card
          :num="book.detail.stock"
          :price="book.detail.price + '.00'"
          :desc="book.detail.description"
          :title="book.detail.title"
        >
          <template #tags>
            <van-tag plain type="danger">新书</van-tag>
            <van-tag plain type="danger">推荐</van-tag>
          </template>
          <template #footer>
            <van-button type="warning" @click="goCart">加入购物车</van-button>
            <van-button type="danger" @click="goBuy">立即购买</van-button>
          </template>
        </van-card>
      </div>

      <van-tabs v-model="active2" @click="tabClick2">
        <van-tab title="概述">
          <div v-html="book.detail.details" class="details"></div>
        </van-tab>
        <van-tab title="热评">
          <div v-if="book.comments">
            <div v-for="(item, i) in book.comments" :key="i">
              <span>{{ item.content }}</span>
            </div>
          </div>
          <span v-else>{{ "当前没有评论" }}</span>
        </van-tab>
        <van-tab title="相关图书">
          <goods-list :goodsListData="book.like_goods"></goods-list>
        </van-tab>
      </van-tabs>
    </scroll>

  </div>
</template>

<script>
import { aGetDetail } from "network/detail.js";
import goodsList from "../../components/content/goods/goodsList.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";
import { aAddCart } from "network/shopcart.js";

export default {
  name: "detail",
  props: {},
  components: { goodsList, Scroll },
  data() {
    return {
      addGoodsQuery: {
        goods_id: "",
        num: 1,
      },
      book: {
        detail: {},
        like_goods: [],
      },
      active1: 0,
      active2: 0,
      runNumber: 0,
      isCopyTabShow: false,
    };
  },
  computed: {
    id(){
      return this.$route.query.id
    }
  },
  watch: {
    /* active1(newVal, oldVal) {
      this.active2 = newVal
      this.$refs.scroll.scroll.refresh();
      
    },
     active2(newVal, oldVal) {
      this.active1 = newVal
      this.$refs.scroll.scroll.refresh();
    }, */
    id(a,b){
      location.reload()
    }
  },
  methods: {
    imgLoad() {
      this.runNumber = this.$refs.imgCardLoad.offsetHeight;
    },
    scroll(position) {
      this.isCopyTabShow = -position.y > this.runNumber;
    },
    tabClick1(i) {
      this.active2 = i;
      if (this.isCopyTabShow) {
        this.$refs.scroll.scrollTo(0, -this.runNumber, 1000);
      }
    },
    tabClick2(i) {
      this.active1 = i;
    },
    goCart() {
      aAddCart(this.addGoodsQuery)
        .then((res) => {
          if (res.status == 201) {
            this.$toast.success("添加成功");
            this.$store.dispatch('upCartLIst')
          }
          if(res.status == 204){
            this.$toast.success("商品数量+1");
            this.$store.dispatch('upCartLIst')
          }
          if (res.response.status == 422) {
            this.$toast.fail("添加失败");
          }
        })
        .catch((err) => err);
    },
    goBuy() {
      aAddCart(this.addGoodsQuery)
        .then((res) => {
          if (res.status == 201 || res.status == 204) {
            this.$toast.success("添加成功，立即跳转");
            this.$store.dispatch('upCartLIst')
            setTimeout(() => {
              this.$router.push('/shopcart')
            }, 500);
          }
          if (res.response.status == 422) {
            this.$toast.fail("错误");
          }
        })
        .catch((err) => err);
    },
  },
  created() {
    aGetDetail(this.$route.query.id)
      .then((res) => {
        console.log('11111');
        console.log(res);
        console.log('22222');
        this.book.detail = res.data.goods;
        /*  this.book.comments = res.goods.comments */
        this.book.like_goods = res.data.like_goods;
        this.addGoodsQuery.goods_id = this.$route.query.id;
      })
      .catch((err) => console.log("获取所有数据失败"));
  },
  mounted() {},
  beforeDestroy() {},
  updated(){
  },
  
};
</script>
<style lang="less" scoped>
.detail {
  width: 100%;
  position: relative;
  height: 100vh;
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

.copyTab {
  z-index: 99;
}

.details{
  /deep/img{
    width: 100%;
  }
}
</style>
