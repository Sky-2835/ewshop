<template>
  <div class="order">
    <nav-bar>
      <template>
        订单列表
      </template>
    </nav-bar>

    <van-tabs v-model="tabActive" @click="changeTab">
      <van-tab title="全部"></van-tab>
      <van-tab title="待付款"></van-tab>
      <van-tab title="已支付"></van-tab>
      <van-tab title="发货"></van-tab>
      <van-tab title="交易完成"></van-tab>
      <van-tab title="过期"></van-tab>
    </van-tabs>

    <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh" :class="{isShow:isShowEmpty}">
      <van-list
        v-model="isListLoading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :offset='10'
        loading-text='加载中'
      >
        <div v-for="(item,i) in list" :key="i" @click="goOrderDetail(item.id)">

          <div class="orderTitle">
            <div><span>订单号: </span><span>{{item.order_no}}</span></div>
            <div><span>创建时间: </span><span>{{item.created_at}}</span></div>
          </div>
 
          <van-card v-for="(itemSon,index) in item.orderDetails.data" :key="index"
            :num="itemSon.num"
            :price="itemSon.price+'.00'"
            :desc="itemSon.goods.description"
            :title="itemSon.goods.title"
            :thumb="itemSon.goods.cover_url"
          />

          <hr>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <van-empty description="没有订单" v-show="isShowEmpty" />

    <div class="backTop" v-show="isBackTopShow" @click="backTop">
      <van-icon name="back-top" size="30"  color='#fff' />
    </div>
  </div>
</template>
<script>
import NavBar from "../../components/common/navbar/NavBar.vue";
import { aOrderList } from "network/order.js";

export default {
  name: "Order",
  props: {},
  components: { NavBar },
  data() {
    return {
      isBackTopShow:false,
      //当前选中tab索引
      tabActive: 0,
      //PullRefresh 下拉刷新
      isRefreshLoading: false,
      //List列表组件
      isListLoading: false,
      finished: false,
     
      list: [],
      // 当前页
      page: 0,
      // 总页数
      totalPage:0,
      status:0,
      isShowEmpty:false,
    };
  },
  computed: {
  },
  watch: {},
  methods: {  
    backTop(){
      /* window.scrollTo(0,0) */
      const timer = setInterval(() => {
        window.scrollBy(0,-pageYOffset/5)
        if(pageYOffset == 0){
          clearInterval(timer)
        }
      }, 10);
    }, 
    loadData() {
      if(this.page <= this.totalPage && !this.isRefreshLoading){
         this.page++
      };
      // 下拉刷新时，它的值会自动变为true, 所以↓  不是下拉时不用先清空数组再加载数据
          if(this.isRefreshLoading){
            this.list = [];
            this.page = 1;
            this.isRefreshLoading = false;
          }
      aOrderList({ page:this.page,status:this.status,include:'orderDetails.goods'})
        .then((res) => {
          if(res.data.data.length == 0){
            this.isShowEmpty = true;
            return
          }
          this.isShowEmpty = false;

          console.log(this.isShowEmpty);
          console.log(res);

          this.totalPage = res.data.meta.pagination.total_pages 
          // 页数大于等于总页数时，已全部加载完，不会再触发load事件 
          if(this.page >= this.totalPage){
             this.finished = true;
          }

          this.list.push(...res.data.data);
          console.log(this.list[0].orderDetails.data);
          /* this.list = [...this.list,...res.data.data] */
          
          this.isListLoading = false
        })
        .catch((err) => {console.log("err");this.isListLoading = false});
        
    },
    // 下拉刷新时触发
    onRefresh() {
      //是否已加载完成，全部加载完true之后不会再触发load事件。(清除了自定义的load事件)
      this.finished = false;
      //列表是否处于加载状态，处于加载中时为true(logo动画)不会触发load事件
      this.isListLoading = true; 
      this.loadData()
    },
    // List组件.列表底部与滚动条(可视区域)距离小于offset(默认300px)时触发 load事件。List组件初始化后，会触发一次
    onLoad() {
      this.loadData();
      console.log(this.page + '###########################');
    },
    // 切换tab
    changeTab(i){
      this.list = [];
      this.page = 0;
      this.status = i;
      this.onRefresh();
    },
    //点击订单 跳转到订单详情页
    goOrderDetail(orderId){
      this.$router.push({path:'/orderDetail',query:{id:orderId}},onComplete => {},onAbort => {})
    },
  },
  created() {},
  mounted() {
    window.onscroll = ()=>{
      if(pageYOffset > 300){
        this.isBackTopShow = true
      }else{
        this.isBackTopShow = false
      }
    }
  },
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
.order {
  height: 100%;
}
.van-list {
   margin-bottom: 50px;
  .orderTitle {
    background-color: #fafafa;
    height: 65px;
    margin: 10px 10px 5px 10px ;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 10px;
    > div {
      & > :last-child {
        font-size: 15px;
        color: black;
      }
    }
  }
  .van-card {
    margin: 0 20px 5px 20px;
  }
  hr{
    border: 1px dashed red;
  }
}

/deep/.van-tabs__wrap {
  border-bottom: 1px solid #ebedf0;
}


.backTop{
  position: fixed;
  height: 35px;
  width: 35px;
  background-color: #1889fa;
  bottom: 60px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.isShow{
  display: none;
}
</style>
