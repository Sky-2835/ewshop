<template>
  <div class="orderdetail">
    <nav-bar>
      <template>
        订单详情
      </template>
    </nav-bar>

    <div class="orderTitle">
      <div>
        <span>订单状态: </span><span>{{ status }}</span>
      </div>
      <div>
        <span>订单编号: </span><span>{{ orderDetail.order_no }}</span>
      </div>
      <div>
        <span>下单时间: </span><span>{{ orderDetail.created_at }}</span>
      </div>
      <van-button
        type="primary"
        size="large"
        v-if="orderDetail.status == 1"
        @click="goPay"
        >去支付</van-button
      >
      <van-button
        type="default"
        size="large"
        v-if="orderDetail.status == 1"
        @click="confirmOrder"
        >确认订单</van-button
      >
      <!-- 后台商家发货后，status变为3 才能点。  这里模拟 所以改为1 ,本来只会显示一个按钮，没办法这里都显示会挡住下面-->
      <van-button
        type="warning"
        size="large"
        v-if="orderDetail.status == 5"
        disabled
        >已过期</van-button
      >
    </div>

    <div class="orderPrice">
      <div>
        <span>商品金额: </span><span>￥{{ allPrice }}.00</span>
      </div>
      <div><span>配送方式: </span><span>普通快递</span></div>
    </div>

    <scroll class="wrapper" ref="scroll" :observeImage="{ debounceTime: 100 }">
      <div class="orderGoods">
        <van-card
          v-for="(item, i) in goodLIst"
          :key="i"
          :num="item.num"
          :price="item.price + '.00'"
          desc="全场包邮"
          :title="item.goods.title"
          :thumb="item.goods.cover_url"
        />
      </div>
    </scroll>

    <van-popup
      v-model="isShowPopup"
      position="bottom"
      :style="{ height: '35%' }"
    >
      <div class="pay">
        <!--   原本弹出这2个按钮 ，点击设置就可以打开手机支付宝，微信 付款 。这里没法验证 所以用二维码
        <div><van-button type="info" size="large">支付宝支付</van-button></div>
        <div><van-button type="primary" size="large">微信支付</van-button></div> 
        -->
        <van-grid :border="false" :column-num="2">
          <van-grid-item>
            支付宝二维码
            <van-image :src="imgSrc1" />
          </van-grid-item>
          <van-grid-item>
            微信二维码
            <van-image :src="imgSrc2" />
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>
<script>
import NavBar from "../../components/common/navbar/NavBar.vue";
import Scroll from "../../components/common/scroll/Scroll.vue";

import {
  aOrderDetails,
  aGetQrCode,
  aQueryStatus,
  aConfirmGoods,
} from "network/order.js";

export default {
  name: "orderDetail",
  props: {},
  components: { NavBar, Scroll },
  data() {
    return {
      orderDetail: {},
      allPrice: "",
      goodLIst: [],
      isShowPopup: false,
      imgSrc1: "",
      imgSrc2: "",
    };
  },
  computed: {
    status() {
      // 订单状态 status       1下单 2支付 3发货 4收货 5过期
      const a = ["", "已下单", "已支付", "已发货", "已收货", "已过期"];
      return a[this.orderDetail.status];
    },
  },
  watch: {},
  methods: {
    init() {
      aOrderDetails(this.$route.query.id, "orderDetails.goods,address")
        .then((res) => {
          console.log(res);
          if (res.status !== 200) return this.$toast.fail("获取数据失败");
          this.orderDetail = res.data;
          this.allPrice = res.data.orderDetails.data.reduce((a, b) => {
            return a + b.price;
          }, 0);
          this.goodLIst = res.data.orderDetails.data;
        })
        .catch((err) => console.log("err"));
    },
    goPay() {
      this.isShowPopup = true;
      aGetQrCode(this.$route.query.id, "aliyun")
        .then((res) => {
          this.imgSrc1 = res.data.qr_code_url;
          this.imgSrc2 = res.data.qr_code_url;
          // 暂时没法模拟付款，只能手动跳转 ↓ 本来应该轮询查看 成功后，在代码内跳转
          /*  setTimeout(() => {
               location.reload()
              }, 2000); */
        })
        .catch((err) => console.log("err"));
      const timer = setInterval(() => {
        aQueryStatus(this.$route.query.id)
          .then((res) => {
            console.log(res);
            if (res == "2") {
              this.$toast.success("支付成功");
              clearInterval(timer);
              /* 支付成功了，跳转原网页无效。改了查询 ？也无效 。 只能手动刷新
                    this.$router.push({
                    path: "/orderDetail",
                    query: { id: this.$route.query.id },
                  }); */
              location.reload();
            }
          })
          .catch((err) => console.log("err"));
        if (!this.isShowPopup) {
          clearInterval(timer);
        }
      }, 2000);
    },
    confirmOrder() {
      this.$dialog
        .confirm({
          message: "是否确认收货？",
        })
        .then(() => {
          // on confirm
          console.log("确认");
          aConfirmGoods(this.$route.query.id)
            .then((res) => {
              console.log('222');
              if (res.status_code == 204) {
                this.$toast.success("确认成功");
                this.init();
              }
              if (res.response.status == 400) return this.$toast.fail("订单状态错误");
            })
            .catch((err) => console.log("err111"));
        })
        .catch(() => {
          // on cancel
          console.log("取消");
        });
    },
  },
  created() {
    this.$toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 500,
    });
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
.orderdetail {
  background-color: #ebedf091;
  position: relative;
  height: 100vh;
}
.orderTitle {
  font-size: 15px;
  background-color: #fff;
  padding: 20px 20px 5px 20px;
  > div {
    margin-bottom: 10px;
    & > :first-child {
      color: #82848a;
    }
    & > :last-child {
      color: #323233;
    }
  }
  > button {
    margin-bottom: 10px;
  }
}

.orderPrice {
  font-size: 15px;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  margin: 20px 0;
  > div {
    & > :first-child {
      color: #82848a;
    }
    & > :last-child {
      color: #323233;
    }
  }
}

.orderGoods {
  .van-card {
    background-color: #ffffffba;
    .van-card__price {
      color: red;
    }
    .van-card__title {
      font-size: 16px;
    }
  }
}

.wrapper {
  position: absolute;
  left: 0;
  right: 0;
  top: 321px;
  bottom: 50px;
  overflow: hidden;
}
</style>
