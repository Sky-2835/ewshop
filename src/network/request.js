import axios from "axios";
import Vue from "vue";

import router from '../router/index.js'    /* 为了在下面使用this.$router   可以这样 或者直接导入路由对象后 直接使用路由对象 ↓*/
  /*  Vue.prototype.$$router = router   */
import aaa from '../router/index.js'

export function request(config) {
  const instance = axios.create({
    baseURL: "https://api.shop.eduwork.cn",
    timeout: 5000,
  });

  instance.interceptors.request.use(
    (config) => {
     /*  console.log(a); */
      if (window.sessionStorage.getItem("token")) {
        config.headers.Authorization = "Bearer " + window.sessionStorage.getItem("token");
      }
     /*  console.log(a); */
      return config;
    },
    (err) => err
  );

  instance.interceptors.response.use(
    (res) => {
     /*  console.log(res); */
      return res /* res.data ? res.data : res */;
    },
    (err) => {
      console.log(err);
      // 当错误码为401(需要带token才能访问接口) 跳转登录
      if (
        err.response.status == 401 && err.response.data.message != "Unauthorized"){
        Vue.prototype.$toast.fail('请先登录');
        /* 本来是要 this.$router.push('/login') 跳转的 。但是无法使用 $router对象 所以↓*/
        /* history.pushState({},'','/Home') 还是不行路径变了网页不变   所以厉害 ↓*/
        setTimeout(()=>{
           // new Vue().$$router.push('/login')  或者 Vue.prototype.$$router.push('/login')      
          aaa.push({path:'/login'},onComplete => {},onAbort => {})  /*  1.↑  2← */
        },1000)     
        return
      }

      // 用户名或密码错误
      if (err.response.data.message == "Unauthorized") {
        Vue.prototype.$toast.fail('用户名或密码错误');
      }

      // (注册失败时)弹出显示 第一条错误信息   if(err.response.status == 422)
      if(err.response.data.errors){
        Vue.prototype.$notify({
          // 同理 可以  new Vue().$notify
          type: "warning",
          message:
            err.response.data.errors[Object.keys(err.response.data.errors)[0]][0],
            duration: 1000,
        });
      }
      return err // return err 后 ，走.then会跟.then内的$notify冲突，只会弹出.then内的错误提示。这上面的弹出第一条错误信息就不会有反应，会冲突只会显示一个。 所以.then内不要设置$notify,这里就会正常显示。
    }
  );

  return instance(config);
}
