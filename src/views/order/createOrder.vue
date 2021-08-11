<template>
  <div class="createorder">
    <nav-bar>
      <template>
        订单预览
      </template>
    </nav-bar>
    <scroll class="warpper" ref="scroll" :observeImage="{ debounceTime: 100 }">
      <div class="address" @click="goAddress">
        <div>
          <div v-if="address.length !== 0">
            <span>{{ address.name }}</span
            ><span> {{ address.phone }}</span>
          </div>
          <div v-if="address.length !== 0">
            <span
              >{{ address.province }} {{ address.city }} {{ address.county }}
              {{ address.address }}</span
            >
          </div>
          <div v-else><span>还未添加默认地址,请选择或添加</span></div>
        </div>
        <div>
          <van-icon name="arrow" />
        </div>
      </div>

      <van-card
        v-for="(item, i) in cartList"
        :key="i"
        :num="item.num"
        :price="item.goods.price + '.00'"
        :title="item.goods.title"
        :thumb="item.goods.cover_url"
      />
    </scroll>
    <van-submit-bar :price="allPrice" button-text="生成订单" @submit="onSubmit">
      <template #default>
        商品金额
      </template>
    </van-submit-bar>

    <van-popup
      v-model="isPopupShow"
      position="bottom"
      :style="{ height: '35%' }"
      @close="closePopup"
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
import {
  aOrderPreview,
  aAddOrder,
  aGetQrCode,
  aQueryStatus,
} from "network/order.js";
import Scroll from "../../components/common/scroll/Scroll.vue";

export default {
  name: "createorder",
  props: {},
  components: { NavBar, Scroll },
  data() {
    return {
      cartList: [],
      address: {},
      allPrice: 0,
      isPopupShow: false,
      orderId: "",
      imgSrc1: "",
      imgSrc2: "",
    };
  },
  computed: {},
  watch: {},
  methods: {
    onSubmit() {
      console.log("生成订单");
      //地址id
      aAddOrder(this.address.id)
        .then((res) => {
          console.log(res);
          if (res.status !== 200) return this.$toast.fail("创建失败");
          this.isPopupShow = true;
          this.orderId = res.data.id;
          this.$toast.success("创建订单成功");
          //创建定单成功时，后台会将购物车列表中已选中(已经在订单中的商品)删除。所以重新调用此方法 算数量count
          this.$store.dispatch("upCartLIst");
          //订单id 上面生成订单成功后 返回
          aGetQrCode(this.orderId, "aliyun")
            .then((res) => {
              this.imgSrc1 = res.data.qr_code_url;
              this.imgSrc2 = res.data.qr_code_url;
              //暂时没法模拟付款，只能手动跳转 ↓ 本来应该轮询查看 成功后，在代码内跳转
              setTimeout(() => {
                this.$router.push({
                  path: "/orderdetail",
                  query: { id: this.orderId },
                });
              }, 2000);
            })
            .catch((err) => console.log("err"));
          // 轮询查看 每2s查看支付状态
          const timer = setInterval(() => {
            aQueryStatus(this.orderId)
              .then((res) => {
                //支付成功 清除定时器 跳转订单详情页面
                if (res == "2") {
                  this.$toast.success("支付成功");
                  clearInterval(timer);
                  this.$router.push({
                    path: "/orderDetail",
                    query: { id: this.orderId },
                  });
                }
              })
              .catch((err) => console.log("err"));
            // 关闭弹出层时，清除定时器。(在这里写 或者 下面 closePopup函数内写。×) 只能在这里写， 写在定时器外，则只会判断一次if 为false、不会执行清除定时器代码，清除不了。在closePopup函数内 ，找不到timer
            if (!this.isPopupShow) {
              clearInterval(timer);
            }
          }, 2000);
        })
        .catch((err) => console.log("err"));
    },
    //关闭弹出层
    closePopup() {
      console.log("我关闭了");
      //未扫描二维码付款，直接关闭弹出层，因为已经创建成功订单了 也可直接跳转到订单详情 未付款状态
      this.$router.push({ path: "/orderdetail", query: { id: this.orderId } });
    },

    init() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 500,
      });
      aOrderPreview()
        .then((res) => {
          this.address = res.data.address.filter((item) => {
            return item.is_default == 1;
          });
          if (this.address.length == 0) {
            this.address = [];
          } else {
            this.address = this.address[0];
          }
          this.cartList = res.data.carts;
          this.allPrice =
            this.cartList.reduce((a, b) => {
              return a + b.num * b.goods.price;
            }, 0) * 100;
        })
        .catch((err) => console.log("err"));
    },

    //选择默认地址
    goAddress() {
      this.$router.push("/address");
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
.createorder {
  position: relative;
  height: 100vh;
}
.warpper {
  overflow: hidden;
  position: absolute;
  top: 45px;
  bottom: 100px;
  left: 0;
  right: 0; // 用绝对定位或者↓ 确定warpper的高度
  /*  height: calc(100% - 95px) // 顶部，底部导航栏的高度。 */
}
.address {
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px dashed red;
  font-size: 15px;
  color: #222;
  & > :first-child {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    div {
      margin-top: 5px;
    }
    padding-left: 10px;
    & > :nth-child(2) {
      font-size: 13px;
    }
  }
  & > :last-child {
    line-height: 80px;
    padding-right: 5px;
  }
}
.van-card__price {
  color: red;
}
.van-card__title {
  font-size: 16px;
}

.van-submit-bar {
  bottom: 50px;
}

.pay {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  > div {
    padding: 0 30px;
  }
}
</style>
