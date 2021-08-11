import Vue from "vue";
import VueRouter from "vue-router";
import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "defaultName",
    redirect: "/Home",
  },
  {
    path: "/Home",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "home" */ "views/Home/Home.vue"),
    meta: {
      path: "首页",
    },
    children: [],
  },
  {
    path: "/category",
    name: "category",
    component: () =>
      import(/* webpackChunkName: "category" */ "views/category/category.vue"),
    meta: {
      path: "商品分类",
    },
  },
  {
    path: "/detail",
    name: "detail",
    component: () =>
      import(/* webpackChunkName: "detail" */ "views/detail/detail.vue"),
    meta: {
      path: "商品详情",
    },
  },
  {
    path: "/shopcart",
    name: "shopcart",
    component: () =>
      import(/* webpackChunkName: "shopcart" */ "views/shopcart/shopcart.vue"),
    meta: {
      path: "购物车",
      isAuth:true,
    },
  },
  {
    path: "/users",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "users" */ "views/users/users.vue"),
    meta: {
      path: "个人中心",
      isAuth:true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "views/users/register.vue"),
    meta: {
      path: "新用户注册",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "views/users/login.vue"),
    meta: {
      path: "用户登录",
    },
  },
  {
    path: "/address",
      name: "address",
      component: () => import(/* webpackChunkName: "address" */ "views/users/address.vue"),
      meta: {
        path: "地址管理",
        isAuth:true,
      },
  },
  {
    path: "/addressEdit",
      name: "addressEdit",
      component: () => import(/* webpackChunkName: "addressEdit" */ "views/users/addressEdit.vue"),
      meta: {
        path: "地址编辑",
        isAuth:true,
      },
  },
  {
    path: "/createOrder",
      name: "createOrder",
      component: () => import(/* webpackChunkName: "createOrder" */ "views/order/createOrder.vue"),
      meta: {
        path: "地址编辑",
        isAuth:true,
      },
  },     
  {
    path: "/orderDetail",
      name: "orderDetail",
      component: () => import(/* webpackChunkName: "orderDetail" */ "views/order/orderDetail.vue"),
      meta: {
        path: "订单详情",
        isAuth:true,
      },
  },
  {
    path: "/order",
      name: "Order",
      component: () => import(/* webpackChunkName: "Order" */ "views/order/Order.vue"),
      meta: {
        path: "订单列表",
        isAuth:true,
      },
  },      
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.path;
  //授权 没登录 没token令牌 不能进
  /* if(to.path == '/users' || to.path == '/shopcart' || to.path == '/address' || to.path == '/addressEdit'){
    if(!window.sessionStorage.getItem('token')){
       new Vue().$toast.fail("您还没有登录  请先登录")
       next('/login')
    }
  } */
  if(to.meta.isAuth){
    if(!window.sessionStorage.getItem('token')){
      new Vue().$toast.fail('您还没有登录  请先登录')
      next('/login')
    }
  }
  //获取购物车数量
  if(window.sessionStorage.getItem('token')){store.dispatch('upCartLIst')}
  next();
});

export default router;
