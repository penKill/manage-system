import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './table.json',
        method: 'get'
    });
};


// 获取当前用户能执行的菜单

export const menuCheckData = (roleId: string) => {
    return request({
        url: '/api/menu/check?roleId=' + roleId,
        method: 'get'
    });
}
//查询用户当前有哪些菜单权限
export const menuUserData = () => {
    return request({
        url: '/api/menu/user-menu',
        method: 'get'
    });
}

