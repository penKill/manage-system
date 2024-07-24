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
        url: '/api/user/edit',
        method: 'put',
        data: data
    });
}

// 删除用户数据
export const handlerUserDelete = (id: number) => {
    return request({
        url: '/api/base/user/delete' + '?id' + id,
        method: 'delete'
    });
}

// 处理搜索机场账户信息
export const handlerAccountSearch = (query: string) => {
    return request({
        url: '/api/account/list' + '?' + query,
        method: 'get'
    });
}

// 处理搜索机场账户信息
export const handlerAccountUpdate = (data: any) => {
    return request({
        url: '/api/account/update',
        method: 'put',
        data: data
    });
}

// 处理搜索机场账户信息
export const handlerAccountAdd = (data: any) => {
    return request({
        url: '/api/account/add',
        method: 'post',
        data: data
    });
}


// 搜索配置信息
export const handlerConfigSearchPage = (query: string) => {
    return request({
        url: '/api/config/page?' + query,
        method: 'get'
    });
}

// 搜索配置信息
export const handlerConfigEdit = (data: any) => {
    return request({
        url: '/api/config/edit',
        method: 'put',
        data: data
    });
}

// 删除配置信息
export const handlerConfigDelete = (id: number) => {
    return request({
        url: '/api/config/delete?id=' + id,
        method: 'delete',
    });
}
