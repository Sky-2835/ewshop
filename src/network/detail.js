import {request} from 'network/request.js'

export function aGetDetail(id) {
    return request({
        method:'get',
        url:`/api/goods/${id}`
    })
}