import request from '../utils/request';


// 获取最近登录信息
export const fetchLastLoginInfo = () => {
    return request({
        url: '/api/account/last-login',
        method: 'get'
    });
}

// 获取未做代办事项
export const fetchUndoList = () => {
    return request({
        url: '/api/system/log-list',
        method: 'get'
    });
}
