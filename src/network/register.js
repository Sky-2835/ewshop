import {request} from './request'

export function aRegister(data) {
    return request({
        method:'post',
        url:'/api/auth/register',
        data
    })
}