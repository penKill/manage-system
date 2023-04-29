import request from '../utils/request';


// 获取最近登录信息
export const fetchLastLoginInfo = () => {
    return request({
        url: '/api/base/user/last-info',
        method: 'get'
    });
}

// 获取未做代办事项
export const fetchUndoList = () => {
    return request({
        url: '/api/base/user/undo-list',
        method: 'get'
    });
}
