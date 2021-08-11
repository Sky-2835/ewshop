import {request} from 'network/request.js'

/* 请求首页所有数据 */
export function aGetHomeAllData(){
    return request({
        method:'get',
        url:'/api/index',
    })
}


/* 请求商品列表数据 */
export function aGetHomeGoods(type,page) {
    return request({
        method:'get',
        url:`/api/index?${type}=1&page=${page}`,
    })
}