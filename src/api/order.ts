import request from '../utils/request';


// 从后端获取当前套餐类型 包括 日 周 月 年等等
export const fetchMealTypeList = () => {
    return request({
        url: '/api/meal/meal-type-list',
        method: 'get'
    });
}
// 从后端获取某个套餐具体的套餐信息
export const fetchDetailPrice = (data: any) => {
    return request({
        url: '/api/meal/calc-price',
        method: 'post',
        data: data
    });
}

// 从后端获取某个套餐具体的套餐信息
export const fetchMealDetailList = (periodCode: string) => {
    return request({
        url: '/api/meal/list?type=' + periodCode,
        method: 'get'
    });
}

// 从后端获取某个套餐具体的套餐信息
export const placeOrder = (data: any) => {
    return request({
        url: '/api/order/place-order',
        method: 'post',
        data: data
    });
}

