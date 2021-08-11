<template>
  <div class="shopcart">
    <nav-bar>
      <template
        >购物车<span style="color:red"
          >({{ $store.state.cartCount }})</span
        ></template
      >
    </nav-bar>

    <scroll class="warpper" ref="scroll" :observeImage="{ debounceTime: 100 }">
      <van-checkbox-group
        v-model="checked"
        checked-color="#ee0a24"
        ref="checkBoxGroup"
      >
        <van-swipe-cell
          v-for="(item, index) in list"
          :key="item.id"
          @close="
            removeGoods({ position: 'right', name: [index, item.goods_id] })
          "
        >
          <!-- 单选框 -->
          <van-checkbox :name="item.goods_id">
            <!-- 商品列表 -->
            <van-card
              :title="item.goods.title"
              :thumb="item.goods.cover_url"
              :desc="item.goods.updated_at"
            >
              <template #price>
                <span class="price"
                  >￥<span>{{ item.goods.price }}.00</span></span
                >
              </template>
 
              <template #num>
                <span class="num"
                  >库存:<span>{{ item.goods.stock }}</span></span
                >
              </template>

              <template #footer>
                <!-- 步进器 -->
                <van-stepper
                  v-model="item.num"
                  integer
                  theme="round"
                  button-size="22"
                  :min='1'
                  :max='item.goods.stock'
                  @click.native.stop
                  @plus="addGoodsNum(item)"
                  @minus="letterGoodsNum(item)"
                />
              </template>
            </van-card>
          </van-checkbox>
          <!-- 右滑删除键 -->
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
            />
          </template>
        </van-swipe-cell> </van-checkbox-group
    ></scroll>

    <van-empty description="购物车为空" v-show="isShowEmpty">
      <van-button round type="danger" class="bottom-button" @click="buyGoods"
        >前往选购商品</van-button
      >
    </van-empty>

    <van-submit-bar
      :price="allPrice"
      button-text="提交订单"
      @submit="onSubmit"
      v-show="!isShowEmpty"
    >
      <van-checkbox v-model="allChecked" @click="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import {
  aCartList,
  aChangeCartList,
  aRemoveCartList,
  aChangeGoodsSelect,
} from "network/shopcart.js";

import Scroll from "../../components/common/scroll/Scroll.vue";

export default {
  name: "shopcart",
  data() {
    return {
      list: [],

      checked: [],

      allChecked: false,
    };
  },
  props: {},
  components: { Scroll },
  mounted() {},
  updated() {},
  methods: {
    //跳转购物
    buyGoods() {
      this.$router.push("/Home");
    },
    // 提交订单
    onSubmit() {},
    // 全选 || 全不选
    checkAll() {
      this.$refs.checkBoxGroup.toggleAll(this.allChecked);
    },
    //步进器+
    addGoodsNum(item) {
      item.goods.stock--
      item.num++;
    },
    //步进器-
    letterGoodsNum(item) {
      item.goods.stock ++
      item.num--;
    },
    //删除商品
    removeGoods(a) {
      this.list.splice(a.name[0], 1);
      this.checked.splice(this.checked.indexOf(a.name[1]), 1);
      this.$refs.scroll.scroll.refresh();
    },
  },
  watch: {
    //
    checked(newVal, oldVal) {
      if (this.checked && this.checked.length == this.list.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
  },
  computed: {
    //根据商品列表 算总价
    allPrice() {
      if (!this.checked.length) {
        return 0;
      } else {
        const arr = [];
        this.checked.forEach((item) => {
          let a = this.list.find((item2) => {
            return item2.goods_id == item;
          });
          arr.push(a);
        });
        console.log(arr);
        return (
          arr.reduce((a, b) => {
            return a + b.goods.price * b.num;
          }, 0) * 100
        );
      }
    },

    //是否显示empty
    isShowEmpty() {
      return !this.list.length;
    },
  },
  created() {
    aCartList("goods")
      .then((res) => {
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
        });
        setTimeout(() => {
          if (res.status !== 200) return this.$toast.fail("获取数据失败");
          this.$toast.success("获取数据成功");
          this.list = res.data.data;
          console.log(this.list);
        }, 500);
      })
      .catch((err) => console.log("err"));
  },
};
</script>

<style lang="less" scoped>
.shopcart {
  position: relative;
  height: 100vh;
}
.warpper {
  overflow: hidden;
  position: absolute;
  top: 45px;
  bottom: 100px;
  left: 0;
  right: 0;
}
.van-swipe-cell {
  margin-top: 10px;
}
.van-swipe-cell__right {
  .delete-button {
    height: 100%;
  }
}
.van-checkbox {
  display: flex;
  /deep/.van-checkbox__label {
    flex: 1;
  }
  /deep/.van-checkbox__icon {
    transform: translateX(4px);
  }
}

.van-card {
  margin: 0px;
  .van-card__header {
    .van-card__content {
      justify-content: space-around;
      //商品名
      & > :first-child {
        font-size: 15px;
      }
      //库存
      .num {
        position: absolute;
        top: 6px;
        right: 5px;
        font-size: 15px;
        font-weight: bold;
        color: #323233;
      }
      //价格
      .price {
        color: red;
        font-weight: bold;
        > span {
          font-size: 15px;
        }
      }
      //描述时间
      .van-card__desc {
        font-size: 12px;
        transform: translate(5px, 5px);
      }
    }
  }

  .van-card__footer {
    width: 25%;
    text-align: left;
    //步进器
    > .van-stepper {
      padding-left: 2px;
      position: absolute;
      right: 8px;
      bottom: 20px;
    }
  }
}

.van-submit-bar {
  margin-bottom: 50px;
}
</style>
