import request from '../utils/request';


// 从后端获取文件夹
export const fetchFileFolder = (pid: string) => {
    return request({
        url: '/api/file/directory-list?pid=' + pid,
        method: 'get'
    });
}

// 从后端获取文件列表信息
export const fetchFileList = (pid: string) => {
    return request({
        url: '/api/file/file-list?pid=' + pid,
        method: 'get'
    });
}

// 从后端获取文件列表信息
export const createDirectoryAction = (data: any) => {
    return request({
        url: '/api/file/directory-create',
        method: 'post',
        data
    });
}
// 删除掉文件或文件夹
export const deleteFileAction = (data: any) => {
    return request({
        url: '/api/file/remove',
        method: 'delete',
        data
    });
}

// 上传文件
export const uploadFileAction = (formData: any) => {
    return request.post('/api/file/file-upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
// 获取
export const directorBreadcrumbAction = (id: string) => {
    return request({
        url: '/api/file/parent-director?id=' + id,
        method: 'get',
    });
}


// 下载文件
export const downloadFileAction = (data: any) => {
    return request({
        url: '/api/file/download',
        method: 'post',
        data: data,
        responseType: 'blob'
    })
}

// 上传收款码
export const uploadPaymentAction = (formData: any) => {
    return request.post('/api/payment/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}


// 新增收款码信息
export const addPaymentAction = (data: any) => {
    return request({
        url: '/api/payment/add',
        method: 'post',
        data
    });
}

// 查询收款码信息
export const paymentListAction = (query: string) => {
    return request({
        url: '/api/payment/page-list?' + query,
        method: 'get',
    });
}

// 禁用收款码状态
export const paymentDisableAction = (data: any) => {
    return request({
        url: '/api/payment/disable',
        method: 'post',
        data,
    });
}
