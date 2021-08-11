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
        @change="groupChange"
      >
        <van-swipe-cell v-for="item in list" :key="item.id">
          <!-- 单选框 -->
          <van-checkbox :name="item.id">
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
                  :min="1"
                  :max="item.goods.stock"
                  @click.native.stop
                  :name="item.id"
                  async-change
                  @change="stepperValueChange"
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
              @click="removeGoods(item.id)"
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
      button-text="结算"
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
      //所有数据
      list: [],

      //选中的 id数组
      checked: [],

      //是否全选
      allChecked: "",
    };
  },
  props: {},
  components: { Scroll },
  mounted() {},
  updated() {},
  methods: {
    //初始化
    init() {
      aCartList("goods")
        .then((res) => {
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration:500,
          });
          setTimeout(() => {
            if (res.status !== 200) return this.$toast.fail("获取数据失败");
            /* this.$toast.success("获取数据成功"); */
            this.list = res.data.data;
            console.log(this.list);
            //is_checked == 1，默认选中状态
            this.checked = this.list
              .filter((item) => {
                return item.is_checked == 1;
              })
              .map((item) => {
                return item.id;
              });
            if (this.checked.length == this.list.length) this.allChecked = true;
            console.log(this.checked);
          }, 500);
        })
        .catch((err) => console.log("err"));
    },

    //跳转购物
    buyGoods() {
      this.$router.push("/Home");
    },
    // 提交订单
    onSubmit() {
      if(this.checked.length == 0){
        this.$toast.fail('未选中任何商品')
        return
      }else{
        this.$router.push('/createOrder')
      }
    },

    // 全选 || 全不选
    checkAll() {
      /* this.$refs.checkBoxGroup.toggleAll(this.allChecked); */
      if (this.allChecked) {
        this.checked = this.list.map((item) => item.id);
        console.log(this.allChecked);
      } else {
        this.checked = [];
        console.log(this.allChecked);
      }
    },

    //步进器绑定的值，异步改变，默认传参  当前显示值，name属性
    stepperValueChange(value, detail) {
      //防止快速点击，这边服务器返回数据还没处理完，又来新的。    ===> 过渡动画没完  点了不起作用
      this.$toast.loading({
        message: "修改中...",
        forbidClick: true,
      });
      aChangeCartList(detail.name, value)
        .then((res) => {
          if (res.status !== 204) {
            this.$toast.fail("错误");
            //错误了 服务器没有添加数量，这边步进器的数量跟list的全改了。 刷新下恢复
            location.reload();
          } else {
            //更改成功
            this.$toast.clear();
            /* list中的num数据就不用更改了吧？服务器改了 本地的list数据没变？ 但是其实v-model已经改变了它的数据所以不用再改了。倒是库存要改改,暂时也不需要，还没完成订单，不用改 */
          }
        })
        .catch((err) => console.log(err));
    },

    //改变选中时 。 默认传参数组 改变后选中的id
    groupChange(arr) {
      aChangeGoodsSelect(arr)
        .then((res) => {
          console.log("aaa");
          console.log(this.checked);
          if (this.checked.length != this.list.length) {
            this.allChecked = false;
          } else {
            this.allChecked = true;
          }
        })
        .catch((err) => console.log("err"));
    },

    //删除商品
    removeGoods(id) {
      aRemoveCartList(id)
        .then((res) => {
          if (res.status !== 204) return this.$toast.fail("删除失败");
          this.$toast.success("删除成功");
          this.init();
          //路由导航时写了更新cartCount数据 。 但这里是本页面刷新所以要单独写
          this.$store.dispatch("upCartLIst");
        })
        .catch((err) => console.log("err"));
    },
  },
  watch: {},
  computed: {
    //根据商品列表 算总价
    allPrice() {
      if (!this.checked.length) {
        return 0;
      } else {
        /* const arr = [];
        this.checked.forEach((item) => {
          let a = this.list.find((item2) => {
            return item2.id == item;
          });
          arr.push(a);
        });
        console.log(arr);
        return (
          arr.reduce((a, b) => {
            return a + b.goods.price * b.num;
          }, 0) * 100
        ); */
        return (
          this.list
            .filter((item) => this.checked.includes(item.id))
            .reduce((a, b) => {
              return a + parseFloat(b.goods.price) * parseInt(b.num);
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
    this.init();
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
