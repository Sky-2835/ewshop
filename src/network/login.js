import { request } from "./request";

export function aLogin(data) {
    return request({
        method:'post',
        url:'/api/auth/login',
        data
    })
}