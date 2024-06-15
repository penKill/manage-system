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
        url: '/api/user/login',
        method: 'post',
        data: data
    });
}

// 搜索用户列表数据
export const handlerUserSearch = (query: string) => {
    return request({
        url: '/api/user/search' + '?' + query,
        method: 'get'
    });
}

// 修改用户数据
export const handlerUserEdit = (data: any) => {
    return request({
        url: '/api/base/user/edit',
        method: 'post',
        data: data
    });
}

// 删除用户数据
export const handlerUserDelete = (id: string) => {
    return request({
        url: '/api/base/user/delete' + '?id' + id,
        method: 'delete'
    });
}

