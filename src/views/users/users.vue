<template>
  <div class="users">
    <nav-bar>
      <template>个人中心</template>
    </nav-bar>

    <div class="usersBox">
      <img src="@/assets/img/users.png" alt="err" />
      <div class="usersBox-right">
        <div>
          <span>昵称: </span><span>{{ userInfo.name }}</span>
        </div>
        <div>
          <span>登陆名: </span><span>{{ userInfo.email }}</span>
        </div>
        <div><span>个性签名: </span><span>加油 !!!</span></div>
      </div>
    </div>
    <ul class="userList">
      <li v-for="(item, i) in ulInfo" :key="i" @click="jump(item.path)">
        <span>{{ item.title }}</span>
        <div><van-icon name="arrow" /></div>
      </li>
      <!--  <li>
               <span>我的订单</span>
               <div><van-icon name="arrow" /></div>
            </li> -->
    </ul>

    <div style="margin: 16px;">
      <van-button
        @click="logout"
        round
        block
        type="primary"
        native-type="submit"
        class="button"
        >退出登录</van-button
      >
    </div>
  </div>
</template>

<script>
import { aLogout } from "network/logout.js";
import { aGetUserInfo } from "network/users.js";

export default {
  name: "users",
  data() {
    return {
      ulInfo: [
        { title: "我的收藏", path: "/collet" },
        { title: "我的订单", path: "/order" },
        { title: "账号管理", path: "/setting" },
        { title: "地址管理", path: "/address" },
        { title: "关于我们", path: "/about" },
      ],
      userInfo: {},
    };
  },
  props: {},
  components: {},
  mounted() {},
  methods: {
    //退出登录
    logout() {
      aLogout()
        .then((res) => {
          console.log("退出成功");
          if (res.status == 204) {
            this.$toast.success("退出成功");
            window.sessionStorage.removeItem("token");
            setTimeout(() => {
              this.$router.push("/login");
            }, 500);
            return;
          }
          this.$toast.fail("退出失败");
        })
        .catch((err) => {
          console.log(err);
          console.log("aaaa");
        });
    },
    jump(path) {
      this.$router.push({path},onComplete => {},onAbort => {})
    },
  },

  created() {
    //获取用户所有的信息
    aGetUserInfo()
      .then((res) => {
        console.log(res);
        if (res.status !== 200) return this.$toast.fail("获取数据失败");
        this.userInfo = res.data;
      })
      .catch((err) => console.log("err"));
  },
};
</script>

<style lang="less" scoped>
.users {
  background-color: #f7f8fa;
  height: 100vh;
}
.usersBox {
  margin: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: #87c9c2;
  display: flex;
  img {
    height: 100px;
    width: 100px;
  }
  .usersBox-right {
    margin-left: 15px;
    flex: 1;
    padding-top: 13px;
    > div {
      margin-bottom: 10px;
      & > :first-child {
        font-size: 16px;
        color: #f2f3f5;
      }
      & > :last-child {
        font-size: 15px;
        color: #f2f3f5;
      }
    }
  }
}

.userList {
  margin-top: 30px;
  li {
    background-color: #ffffff;
    height: 40px;
    width: 100%;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    > div {
      height: 100%;
      i {
        transform: translateY(8px);
      }
    }
  }
}
</style>
