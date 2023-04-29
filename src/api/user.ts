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
        url: '/api/base/user/user/login-out',
        method: 'get'
    });
}


