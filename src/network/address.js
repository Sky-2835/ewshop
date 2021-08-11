import { request } from "./request";

//添加地址
export function aAaddAddress(data) {
    return request({
        method:"post",
        url:'/api/address',
        data
    })
}

//更新地址
export function aUpdateAddress(data,id) {
    return request({
        method:"put",
        url:'/api/address/'+id,
        data
    })
}


//删除地址
export function aRemoveAddress(id) {
    return request({
        method:"DELETE",
        url:'/api/address/'+id,
    })
}

//地址列表
export function aAddressList() {
    return request({
        method:"get",
        url:'/api/address',
    })
}

//地址详情
export function aGetAddress(id) {
    return request({
        method:"get",
        url:'/api/address/'+id,
    })
}

//设置默认地址
export function aDefaultAddress(id) {
    return request({
        method:"get",
        url:'/api/address/'+id+'/default',
    })
} 