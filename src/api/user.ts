import request from '../utils/request';


// 获取当前用户的个人信息
export const fetchUserInfo = () => {
    return request({
        url: '/api/base/user/user/info',
        method: 'get'
    });
}

// 处理登录退出情况
export const handlerLoginOut = () => {
    return request({
        url: '/api/base/user/login-out',
        method: 'get'
    });
}


// 登录请求
export const handlerLogin = (data: any) => {
    return request({
        url: '/api/base/user/login',
        method: 'post',
        data: data
    });
}

// 搜索用户列表数据
export const handlerUserSearch = (query: string) => {
    return request({
        url: '/api/base/user/login' + '?' + query,
        method: 'get'
    });
}
