import { request } from "./request";

//添加购物车
export function aAddCart(data) {
    return request({
        method:'post',
        url:'/api/carts',
        data
    })
}

//购物车列表
export function aCartList(include) {
    return request({
        method:'get',
        url:'/api/carts',
        params:{
            include:include,
        }
    })
}

//购物车数量改变(增删)
export function aChangeCartList(cartID,num) {
    return request({
        method:'put',
        url:'/api/carts/'+cartID,
        data:{
            'num':num,
        }
    })
}

//移除购物车
export function aRemoveCartList(cartID) {
    return request({
        method:'DELETE',
        url:'/api/carts/'+cartID,
    })
}

// 购物车改变选中
export function aChangeGoodsSelect(cartID) {
    return request({
        method:'PATCH',
        url:'/api/carts/checked/',
        data:{
            cart_ids:cartID
        }
    })
}