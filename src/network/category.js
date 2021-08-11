import {request} from 'network/request.js'

/* 请求分类数据 左边分类栏 */
export function aGetCategoryData(){
    return request({
        method:'get',
        url:'/api/goods',
    })
}

/* 请求商品列表数据 */
export function aGetGoodsData(type,page,id) {
    return request({
        method:'get',
        url:`/api/goods?${type}=1&page=${page}&category_id=${id}`
    })
}