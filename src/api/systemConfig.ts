import request from '../utils/request';

// 搜索配置信息
export const handlerConfigSearchPage=(query:string)=>{
    return request({
        url:'/api/config/page',
        method:'get'
    });
}
