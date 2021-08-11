import { request } from "./request";

//订单预览数据， 从购物车进入预览，在预览中提交订单
export function aOrderPreview() {
    return request({
        method:"get",
        url:"/api/orders/preview"
    })
}

//提交订单
export function aAddOrder(addressId) {
    return request({
        method:"post",
        url:"/api/orders",
        data:{
            address_id:addressId
        },
    })
}

//订单详情  include='goods,user，orderDetails' goods 商品，user 用户 ，orderDetails订单详情
export function aOrderDetails(orderID,config) {
    return request({
        method:"get",
        url:`/api/orders/${orderID}?include=${config}`,

    })
}

//订单列表 query={page:1,title:"",status:1,include:'goods,'}
export function aOrderList(params) {
    return request({
        method:"get",
        url:"/api/orders",
        params
    })
}


//获取支付二维码   type= aliyun支付宝 wechat微信
export function aGetQrCode(orderId,type) {
    return request({
        method:"get",
        url:`/api/orders/${orderId}/pay?type=${type}`,
        /* query:{
            'type':type,
        } */
    })
}

//查询支付状态   查询支付状态， 扫码支付之后， 轮询请求这个Api，当订单状态变为2的时候， 就是支付成功了
export function aQueryStatus(orderId){
    return request({
        method:"get",
        url:`/api/orders/${orderId}/status`,
    })
}


//物流详情
export function aLogisticsInfo(addressId) {
    return request({
        method:"get",
        url:`/api/orders/${addressId}/express`,
    })
}

//确认收货
export function aConfirmGoods(orderId) {
    return request({
        method:"PATCH",
        url:`/api/orders/${orderId}/confirm`,
    })
}

//评价商品
export function aEvaluationGoods(addressId,data) {
    return request({
        method:"PATCH",
        url:`/api/orders/${addressId}/comment`,
        data
    })
}
