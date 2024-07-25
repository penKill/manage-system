import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig} from 'axios';
import {ElMessageBox} from 'element-plus'
import type {Action} from 'element-plus'
import {h} from 'vue'

const service: AxiosInstance = axios.create({
    timeout: 5000
});

service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.headers.put['Content-Type'] = 'application/json';
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
            if (response.data.code == '200') {
                return response;
            } else if (response.data.code == '222') {
                ElMessageBox.alert('您登录超时，需要重新登录！', '登录超时', {
                    type: "warning",
                    confirmButtonText: '去登录',
                    callback: (action: Action) => {
                        localStorage.clear();
                        window.location.href = '#/login';
                    },
                })
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
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);


export default service;
