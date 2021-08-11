<template>
  <div class="register">
    <nav-bar>
      <template>新用户注册</template>
    </nav-bar>

    <van-image
      class="logo"
      width="128px"
      height="128px"
      fit="scale-down"
      :src="require('@/assets/img/register.png')"
    />

    <van-form
      @submit="onSubmit"
      class="form"
      @failed="onfailed"
      autocomplete="off"
      ref="form"
    >
      <van-field
        v-model="formInfo.name"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        clearable
        :rules="[{ required: true, message: '请填写用户名' }]"
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
      <van-field
        v-model="formInfo.password_confirmation"
        type="password"
        name="确认密码"
        label="确认密码"
        placeholder="确认密码"
        clearable
        :rules="[
          { required: true, message: '请一致密码' },
          { validator: checkSamePossword, message: '请输入一致密码' },
        ]"
      />
      <van-field
        v-model="formInfo.email"
        name="电子邮箱"
        label="电子邮箱"
        placeholder="电子邮箱"
        clearable
        :rules="[{ validator: checkEmail, message: '请填写正确邮箱' }]"
      />

      <div class="jumpLogin" @click="btnJump">已有账户，立即登录</div>

      <div style="margin: 16px;">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          class="button"
          >注册</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import { aRegister } from "network/register";

export default {
  name: "register",
  props: {},
  components: {},
  data() {
    return {
      formInfo: {
        name: "",
        password: "",
        password_confirmation: "",
        email: "",
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
    /* 验证一致密码 */
    checkSamePossword(val) {
      return val == this.formInfo.password;
    },
    onSubmit() {
      console.log("你通过了");
      aRegister(this.formInfo)
        .then((res) => {
          if (res.status !== 201){
            this.$notify({ type: "warning", message: "注册失败" });
            return;
          }
          this.$toast.success('注册成功')
          this.$router.push('/login')
        })
        .catch((err) => console.log('11111'));
    },
    onfailed() {
      console.log("你没通过");
      this.$notify({ type: "danger", message: "请填写正确信息" });
    },
    btnJump() {
      this.$router.push("/login");
    },
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
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

.jumpLogin {
  margin: 30px 16px;
  font-size: 13px;
  color: #00a1d6;
  width: 30%;
}
</style>
