import { request } from "./request";

export function aGetUserInfo() {
    return request({
        method:'get',
        url:"/api/user",
    })
}