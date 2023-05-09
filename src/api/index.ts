import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};


// 获取当前用户能执行的菜单

export const menuData = () => {
    return request({
        url: '/api/base/menu-defined',
        method: 'get'
    });
}

