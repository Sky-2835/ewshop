import { request } from "./request";

export function aLogout() {
    return request({
        method:'post',
        url:"/api/auth/logout",
    })
}