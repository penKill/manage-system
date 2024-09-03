import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import {ElMessage, ElMessageBox} from 'element-plus'
import type {Action} from 'element-plus'
import {h} from 'vue'

const service: AxiosInstance = axios.create({
    timeout: 5000
});

service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.headers.put['Content-Type'] = 'application/json';
service.defaults.headers.delete['Content-Type'] = 'application/json';
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            //返回格式是json类型的数据做拦截 其他类型的流数据直接放行
            if (response.headers['content-type'] && response.headers['content-type'] == 'application/json' && response.data.code) {
                if (response.data.code == '200') {
                    return response;
                } else if (response.data.code == '222') {
                    window.location.href = '#/login';
                    localStorage.clear();
                } else {
                    ElMessageBox({
                        title: 'ERROR',
                        message: h('p', null, [
                            h('span', null, '错误消息：'),
                            h('i', {style: 'color: red'}, response.data.msg),
                        ]),
                    })
                }
            } else {
                return response;
            }
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);


export default service;
