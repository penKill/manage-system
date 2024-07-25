import request from '../utils/request';


// 获取系统全局的设置方法
export const fetchSystemInfo = () => {
    return request({
        url: '/api/system/info',
        method: 'get'
    });
}

