import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};

// 登录请求
export const loginData = (data) => {
    return request({
        url: '/api/base/user/login',
        method: 'post',
        data: data
    });
}

// 获取当前用户能执行的菜单

export const menuData = () => {
    return request({
        url: '/api/base/user/menu',
        method: 'get'
    });
}

