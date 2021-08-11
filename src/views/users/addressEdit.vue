<template>
  <div class="addressEdit">
    <nav-bar>
      <template>
        {{ title }}
      </template>
    </nav-bar>

    <van-address-edit
      :show-delete="$route.query.type == 'edit'"
      :area-list="areaList"
      :address-info="addressInfo"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @cancel-delete="onCancelDelete"
      @delete="onDelete"
      @change-detail="onChangeDetail"
    />
  </div>
</template>
<script>
import { areaList } from "@vant/area-data";
import NavBar from "../../components/common/navbar/NavBar.vue";
import {
  aAaddAddress,
  aGetAddress,
  aUpdateAddress,
  aRemoveAddress,
} from "network/address.js";
export default {
  name: "addressEdit",
  props: {},
  components: { NavBar },
  data() {
    return {
      //地区列表  安装地图包 导入直接用
      areaList,
      //详细地址搜索结果
      searchResult: [],
      //收货人信息初始值
      addressInfo: {},
      arr: [],
    };
  },
  computed: {} /* addressDetail: "北大街11号3栋12楼"
                  areaCode: "110102"
                  city: "北京市"
                  country: ""
                  county: "西城区"
                  isDefault: true
                  name: "sky"
                  postalCode: ""
                  province: "北京市"
                  tel: "13811111111" */,
  watch: {},
  computed: {
    title() {
      return this.$route.query.type == "edit" ? "编辑地址" : "新增地址";
    },
  },
  updated() {
    console.log("我重绘了");
  },
  methods: {
    //点击保存按钮时触发    默认传参content：表单内容
    onSave(content) {
      console.log(content);
      console.log("保存");
      let config = {
        name: content.name,
        address: content.addressDetail,
        phone: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        is_default: content.isDefault ? 1 : 0,
        /* areaCode:content.areaCode, */
      };
      let obj = {
        address: `${content.province} ${content.city} ${content.county} ${config.address}`,
        areaCode: content.areaCode,
      };

      if (this.$route.query.type == "add") {
        aAaddAddress(config).then((res) => {
          this.arr.push(obj);
          window.localStorage.setItem("areaCode", JSON.stringify(this.arr));
        });
      }
      if (this.$route.query.type == "edit") {
        let info = this.arr.find((item) => {
          return item.address == config.address;
        });
        aUpdateAddress(config, this.$route.query.addressId)
          .then((res) => {
            if (!info) {
              this.arr.push(obj);
              window.localStorage.setItem("areaCode", JSON.stringify(this.arr));
            }
          })
          .catch((err) => console.log("err"));
      }

      this.$toast.success("保存成功");
      setTimeout(() => {
        this.$router.back()
        /* this.$router.push("/address"); 
        有BUG,设置了exclude但是 ↑页面还是缓存了 。 只能手动刷新↓     换用include了
          this.$nextTick(() => {
          location.reload();
        });  */

        
        //  this.$router.back();
        //  setTimeout(() => {        不得行，上面方法好
        //    location.reload()
        //  }, 500);
      }, 1000);
    },
    //取消删除地址时触发    默认传参content：表单内容
    onCancelDelete() {
      console.log("取消删除");
      this.$toast.fail("已取消删除");
    },
    //确认删除地址时触发    默认传参content：表单内容
    onDelete() {
      console.log("确认删除");
      aRemoveAddress(this.$route.query.addressId)
        .then((res) => {
          console.log(res);
          this.$toast.success("删除成功");
          setTimeout(() => {
            this.$router.push("/address");
            this.$nextTick(() => {
              location.reload();
            });
          }, 1000);
        })
        .catch((err) => console.log(err));
    },
    //修改详细地址时触发    默认传参value: 详细地址内容
    onChangeDetail() {
      console.log("修改地址");
    },
  },
  created() {
    console.log("aa");
    this.arr = JSON.parse(window.localStorage.getItem("areaCode")) || [];
    console.log(this.arr);
    if (this.$route.query.type == "edit") {
      aGetAddress(this.$route.query.addressId)
        .then((res) => {
          console.log(res);
          this.arr = JSON.parse(window.localStorage.getItem("areaCode")) || [];
          let obj;
          console.log(this.arr);
          console.log(
            `${res.data.province} ${res.data.city} ${res.data.county} ${res.data.address}`
          );
          if (this.arr.length) {
            obj = this.arr.find((item) => {
              return (
                item.address ==
                `${res.data.province} ${res.data.city} ${res.data.county} ${res.data.address}`
              );
            });
          }
          console.log(obj);
          this.addressInfo = {
            name: res.data.name,
            addressDetail: res.data.address,
            tel: res.data.phone,
            province: res.data.province,
            city: res.data.city,
            county: res.data.county,
            isDefault: !!res.data.is_default,
          };
          if (obj) {
            this.addressInfo.areaCode = obj.areaCode;
          }
          console.log(this.addressInfo);
        })
        .catch((err) => console.log("err"));
    }
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
/deep/.van-button--danger {
  background-color: #07c160;
  border: none;
}
</style>
