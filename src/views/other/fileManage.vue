<template>
  <div style="margin-bottom: 10px;margin-top: 10px">
    <el-button type="primary" @click="handlerCreateFolderClick">创建文件夹</el-button>
    <el-button type="primary" @click="handlerDeleteFolder">删除</el-button>
    <el-button type="primary" @click="uploadFileVisible=true">上传文件</el-button>
    <el-button type="primary" @click="downloadFileHandler">下载文件</el-button>
  </div>
  <div>

    <el-breadcrumb :separator-icon="ArrowRight" :data="pathRoute">
      <el-breadcrumb-item @click="backRoot()">根目录</el-breadcrumb-item>
      <el-breadcrumb-item v-for="item in pathRoute" @click="goBack(item)">{{ item.name }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div>
    <el-table v-if="tableList" ref="multipleTableRef" :data="tableList" style="width: 100%"
              @row-dblclick="handlerDbClick">
      <el-table-column type="selection" width="55"/>

      <el-table-column label="文件名">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon v-if="scope.row.isFile" style="color: #79bbff">
              <Files/>
            </el-icon>
            <el-icon v-else style="color: #67C23A">
              <FolderOpened/>
            </el-icon>
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="类型/大小" width="120"/>
      <el-table-column prop="createTime" label="创建时间" width="220"/>
    </el-table>
  </div>

  <el-dialog
      v-model="creatFolderVisible"
      title="创建文件夹"
      width="500"
  >
    <el-input v-model="createFolderName" style="width: 240px" placeholder="请输出文件夹名称" @input="verifyFolderName"/>
    <br/>
    <el-text class="mx-1" type="danger">{{ alertMessage }}</el-text>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handlerCreateFolder" :disabled="disableSubmit">确定</el-button>
        <el-button @click="creatFolderVisible = false; disableSubmit=true;createFolderName=''; alertMessage=''">取消
        </el-button>
      </div>
    </template>
  </el-dialog>


  <el-dialog
      v-model="uploadFileVisible"
      title="上传文件"
      width="500"
  >
    <el-upload
        class="upload-class"
        ref="uploadFile"
        drag
        multiple
        :http-request="handlerUploadFile"
        eleme
        auto-upload
    >
      <el-icon class="el-icon--upload">
        <upload-filled/>
      </el-icon>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>

  </el-dialog>
</template>
<script setup lang="ts" name="fileManage">
import {reactive, ref} from 'vue'

import {
  createDirectoryAction,
  deleteFileAction, directorBreadcrumbAction, downloadFileAction,
  fetchFileFolder,
  fetchFileList,
  uploadFileAction
} from '../../api/other'
import {ArrowRight} from '@element-plus/icons-vue'
import {ElMessageBox, ElTable, ElMessage, UploadInstance, UploadRequestOptions} from 'element-plus'


interface TableItem {
  name: string,
  size: string,
  createTime: string,
  isFile: boolean,
  id: string
}

interface PathItem {
  name: string,
  id: string
}

const creatFolderVisible = ref(false);
const uploadFileVisible = ref(false);
//当前多选表单事件
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

//表单数据
const tableList = ref<TableItem[]>([]);
//面包屑数据
const pathRoute = ref<PathItem[]>([]);
const pid = ref('0');
const createFolderName = ref('');
//当前被选中的数据
let checkRowData: TableItem[] = [];
const fetchFileFolderHandler = () => {
  let tempDataArray: TableItem[] = [];
  fetchFileFolder(pid.value).then(res => {
    if (res.data.code == '200') {
      let resData = res.data.data;
      if (resData) {
        for (let i = 0; i < resData.length; i++) {
          let data = resData[i];
          tempDataArray.push({
            'name': data.path,
            'size': '/',
            'createTime': data.createTime,
            'isFile': false,
            'id': data.id
          })
        }
      }
      fetchFileList(pid.value).then(res => {
        if (res.data.code == '200') {
          let resData = res.data.data;
          if (resData) {
            for (let i = 0; i < resData.length; i++) {
              let data = resData[i];
              tempDataArray.push({
                'name': data.fileName,
                'size': data.fileSize + ' kb',
                'createTime': data.createTime,
                'isFile': true,
                'id': data.fileId
              })
            }
          }
          if (tempDataArray && tempDataArray.length > 0) {
            tableList.value = tempDataArray;
          }
        }
      })
    }
  })
  directorBreadcrumbAction(pid.value).then(res => {
    pathRoute.value = res.data.data;
  })
}

fetchFileFolderHandler();
//处理当前数据加载
const handlerDbClick = (row: any, column: any, event: Event) => {
  checkRowData.push(row);
  if (!row.isFile) {
    pid.value = row.id;
    fetchFileFolderHandler();
  }
};

// 逻辑补充有问题哦
const goBack = (row: any) => {
  if (pid.value != row.id) {
    checkRowData = []
    pid.value = row.id;
    let pathRouteTmp: any[] = [];
    for (let item of pathRoute.value) {
      if (row.id >= item.id) {
        pathRouteTmp.push(item);
      }
    }
    //对当前元素重新计算
    pathRoute.value = pathRouteTmp;
    fetchFileFolderHandler();
  }
}
//返回根路径
const backRoot = () => {
  pid.value = '0';
  pathRoute.value = []
  checkRowData = []
  fetchFileFolderHandler();
}

const handlerCreateFolderClick = () => {
  let selectionRows = multipleTableRef.value!.getSelectionRows();
  if (selectionRows.length > 0) {
    if (selectionRows.length == 1 && !selectionRows[0].isFile) {
      pid.value = selectionRows[0].id;
    } else {
      ElMessage('创建文件夹必须选中一个父文件夹哦');
      return;
    }
  }
  creatFolderVisible.value = true;
}
//创建文件夹
const handlerCreateFolder = () => {
  let data = {
    'pid': pid.value,
    'name': createFolderName.value
  }

  createDirectoryAction(data).then(res => {
    creatFolderVisible.value = false;
    createFolderName.value = '';
    fetchFileFolderHandler();
  })
}

//删除文件夹或文件
const handlerDeleteFolder = () => {
  //获取当前表单被选中行
  let selectionRows = multipleTableRef.value!.getSelectionRows();
  let message = '';
  let warn = '';
  let data: any[] = [];
  if (selectionRows.length == 0) {
    message = '请选中数据!';
    warn = '选择文件或文件夹'
  } else {
    let flagFile = true;
    for (let obj of selectionRows) {
      if (!obj.isFile) {
        flagFile = false;
      }
      data.push({'id': obj.id, 'file': obj.isFile})
    }
    if (flagFile) {
      warn = '删除文件夹';
      message = '删除文件夹会先删除其中所有文件！';
    } else {
      warn = '删除文件';
      message = '删除文件不可恢复！';
    }

  }

  ElMessageBox.confirm(
      message,
      warn,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        deleteFileAction(JSON.stringify(data)).then(res => {
          ElMessage({message: '删除成功!', type: 'success'});
          //删除后需要重新查一遍数据
          fetchFileFolderHandler();
        })
      })
      .catch(() => {
      })
}
const alertMessage = ref('');
const disableSubmit = ref(true);
// 验证文件夹命名规则
const verifyFolderName = () => {
  let reg = /^\w+$/;
  if (!reg.test(createFolderName.value)) {
    disableSubmit.value = true;
    alertMessage.value = '请输入正确的文件夹名称';
  } else {
    alertMessage.value = ''
    disableSubmit.value = false;
  }
}
const uploadFile = ref<UploadInstance>()


//上传文件
const handlerUploadFile = (params: UploadRequestOptions) => {
  const file = params.file;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pid', pid.value);
  uploadFileAction(formData).then(res => {
    if (res.data.code == '200') {
      //上传的东西清空
      uploadFile.value!.clearFiles();
      uploadFileVisible.value = false;
      ElMessage({message: '上传文件成功!', type: 'success'});
      fetchFileFolderHandler();
    } else {
      uploadFileVisible.value = false;
    }
  })


}
// 下载文件
const downloadFileHandler = () => {
  //获取当前表单被选中行
  let selectionRows = multipleTableRef.value!.getSelectionRows();
  let message = '';
  let warn = '';
  let data: any[] = [];
  if (selectionRows.length == 0) {
    message = '请选中数据!';
    warn = '选择文件或文件夹'
  } else {
    let flagFile = true;
    for (let obj of selectionRows) {
      if (!obj.isFile) {
        flagFile = false;
      }
      data.push({'id': obj.id, 'file': obj.isFile})
    }
    if (flagFile) {
      warn = '下载文件';
      message = '确定下载该文件？';
    } else {
      warn = '下载文件';
      message = '文件夹内部文件会打包！';
    }

  }

  ElMessageBox.confirm(
      message,
      warn,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
  // .then(() => {
  //       console.log('即将进行下载');
  //       downloadFileAction(JSON.stringify(data)).then(res => {
  //         if (res && res.status == '200' && res.data) {
  //           const {data, headers} = res
  //           let fileName;
  //           if (res.headers['content-disposition']) {
  //             fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1');
  //           } else {
  //             fileName = data.fileName;
  //           }
  //           const blog = new Blob([data], {type: headers['content-type']});
  //           const dom = document.createElement('a');
  //           const downUrl = window.URL.createObjectURL(blog);
  //           dom.href = downUrl;
  //           dom.download = decodeURIComponent(fileName);
  //           dom.style.display = 'none';
  //           document.body.appendChild(dom);
  //           window.URL.revokeObjectURL('/api/file/download')
  //         }
  //       });
  //     }
  // )
  // .catch(() => {
  // })

}


</script>

<style scoped>
.upload-class {
  width: 360px;
}
</style>
