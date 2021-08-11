<template>
  <div class="address">
    <nav-bar><template>地址管理</template></nav-bar>
  
    
     <div v-show="list.length == 0" class="box">
         还没有地址信息，去添加吧
    </div>

    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
      @select='onSelect'
    />
    
   

  </div>
</template>
<script>
import NavBar from "../../components/common/navbar/NavBar.vue";
import { aAddressList } from "network/address.js";

export default {
  name: "Address",
  props: {},
  components: { NavBar},
  data() {
    return {
        chosenAddressId:null,
        list:[ 
         /* {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
          isDefault: true,
        },
         {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
          isDefault: true,
        },
         {
          id: '1',
          name: '张三',
          tel: '13000000000',
          address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
          isDefault: true,
        }, */],
    };
  },
  computed: {
  },
  watch: {
     
  },
  methods: {
      onAdd(){
         this.$router.push({path:'/addressEdit',query:{type:"add",}},onComplete => {},onAbort => {})
      },
      //编辑按钮 默认传参  地址对象,索引
      onEdit(item,index){
          console.log('编辑');
          this.$router.push({path:'/addressEdit',query:{type:'edit',addressId:item.id}},onComplete => {},onAbort => {})
      },
      //切换选中 默认传参  地址对象,索引
      onSelect(item,index){
           console.log('切换');
           console.log(item);
           console.log(index);
      },
  },
  created() {
     aAddressList().then(res=>{
         console.log(res.data.data)
         if(res.status !== 200) return this.$toast.fail('获取地址列表失败')   
         if(res.data.data.length == 0) return this.list = [];
          this.$toast.success("获取地址列表成功")
        /*  res.data.data.forEach(item => {
             item.tel = item.phone;
             if(item.is_default == 1){
                 this.chosenAddressId = item.id
                 item.isDefault = true
             }
            });
         this.list = res.data.data */
         this.list = res.data.data.map(item=>{
           return {
             id:item.id,
             name:item.name,
             tel:item.phone,
             address:`${item.province} ${item.city} ${item.county} ${item.address}`,
             /* isDefault:item.is_default == 1 ? true:false, */
             isDefault:!!item.is_default ,//快速变成布尔值
           }})
          this.list.forEach(item => {
            if(item.isDefault){
              this.chosenAddressId = item.id
            }
          });
         }).catch(err=>console.log('err'))
  },
  mounted() {
      
  },
  upDated(){
      
  },
  beforeDestroy() {},
};
</script>
<style lang="less" scoped>
.van-address-list__bottom{
    bottom: 50px;
    button{
      background-color: #07c160;
      border: none;
   }
}
.box{
    width: 100%;
    height: 400px;
    text-align: center;
    line-height: 400px;
}

</style>
