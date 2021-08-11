<template>
  <div class="login">
    <nav-bar>
      <template>用户登录</template>
    </nav-bar>

    <van-image
      class="logo"
      width="128px"
      height="128px"
      fit="scale-down"
      :src="require('@/assets/img/login.png')"
    />

    <van-form
      @submit="onSubmit"
      class="form"
      @failed="onfailed"
      autocomplete="off"
      ref="form"
    >
      <van-field
        v-model="formInfo.email"
        name="电子邮箱"
        label="电子邮箱"
        placeholder="电子邮箱"
        clearable
        :rules="[{ validator: checkEmail, message: '请填写正确邮箱' }]"
      />
      <van-field
        v-model="formInfo.password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        clearable
        :rules="[
          { required: true, message: '请填写密码' },
          { validator: checkPossword, message: '密码最少为6位数' },
        ]"
      />

      <div class="jumpRegister" @click="btnJump">没有账户，立即注册</div>

      <div style="margin: 16px;">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          class="button"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import { aLogin } from "network/login";

export default {
  name: "login",
  props: {},
  components: {},
  data() {
    return {
      formInfo: {
        email: "",
        password: "",
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    /* 邮箱验证 */
    checkEmail(val) {
      return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(val);
    },
    /* 密码验证 */
    checkPossword(val) {
      return val.length >= 6;
    },
    onSubmit() {
      console.log("你通过了");
      aLogin(this.formInfo)
        .then((res) => {
          console.log(res);
          if (res.status !== 200) {
            this.$notify({ type: "warning", message: "登录失败" });
            return;
          }
          this.$toast.success("登录成功");
          window.sessionStorage.setItem("token", res.data.access_token);
          this.formInfo.email = "";
          this.formInfo.password = "";
          setTimeout(() => {
            this.$router.push('/Home')
            /* this.$router.back(); */
          }, 500);
        })
        .catch((err) => {
          console.log("11111");console.log(err);
        });
    },
    onfailed() {
      console.log("你没通过");
      this.$notify({ type: "danger", message: "请填写正确信息" });
    },
    btnJump() {
      this.$router.push("/register");
    },
  },
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>
<style lang="less" scoped>
.login{
   height:100%
}
.logo {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50px);
}

.form {
  margin-top: 200px;
}

/* .button{
  background-color:#40b986;
} */

.jumpRegister {
  margin: 30px 16px;
  font-size: 13px;
  color: #00a1d6;
  width: 30%;
}
</style>
