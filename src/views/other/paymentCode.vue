<template>
  <div>
    <div style="margin-bottom: 10px;margin-top: 10px">
      <el-button type="primary" @click="creatVisible=true">新增</el-button>
      <el-button type="primary" @click="disablePayment">禁用/启用</el-button>
    </div>
    <div>
      <el-table v-if="tableDataList" ref="multipleTableRef" :data="tableDataList" style="width: 100%">
        <el-table-column type="selection" width="55"/>
        <el-table-column label="收款类型" prop="type" :formatter="formatterType"/>
        <el-table-column label="收款状态" prop="status" :formatter="formatterStatus"/>
        <el-table-column label="创建时间" prop="createTime"/>
        <el-table-column label="修改时间" prop="updateTime"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleDetail(scope.$index, scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="query.page"
            :page-size="query.size"
            :total="pageTotal"
            @current-change="handlePageChange"
        ></el-pagination>
      </div>
    </div>
    <div>
      <el-dialog
          v-model="creatVisible"
          title="创建收款码"
          width="500"
      >
        <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :http-request="handlerUploadFile"
            limit=1
            auto-upload="true"
            :on-exceed="handleExceed"

        >
          <el-button type="primary">点击上传收款码图片</el-button>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png 图片不能超过 500kb
            </div>
          </template>

        </el-upload>
        <el-form-item label="类型" style="margin-top: 50px">
          <el-select
              v-model="addObj.type"
              placeholder="请选择"
              style="width: 240px"
          >
            <el-option key="ALI" label="支付宝" value="ALI"></el-option>
            <el-option key="WECHAT" label="微信" value="WECHAT"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="addObj.status"
              placeholder="选择状态"
              style="width: 240px"
          >
            <el-option key="ENABLE" label="启用" value="ENABLE"></el-option>
            <el-option key="DISABLE" label="禁用" value="DISABLE"></el-option>
          </el-select>
        </el-form-item>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handlerAddPaymentCode">确定</el-button>
            <el-button @click="creatVisible = false">取消
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <div>
      <el-dialog
          v-model="detailImageVisible"
          width="500"
      >
        <el-image :src="previewImagePath">
          <template #placeholder>
            <div class="image-slot">Loading<span class="dot">...</span></div>
          </template>
        </el-image>

      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts" name="paymentCode">
import {reactive, ref} from "vue";
import type {UploadProps, UploadUserFile} from 'element-plus'
import {ElMessage, ElTable, UploadRequestOptions} from "element-plus";
import {addPaymentAction, paymentDisableAction, paymentListAction, uploadPaymentAction} from "../../api/other";
import { Edit } from '@element-plus/icons-vue';

const tableDataList = ref<TableItem[]>([]);

const fileList = ref<UploadUserFile[]>([])
const pageTotal = ref(0);
const multipleTableRef = ref<InstanceType<typeof ElTable>>()


const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log('点击我了')
  console.log(file)
}
const previewImagePath = ref('');

interface AddForm {
  type?: string;
  fileId?: string;
  status?: string;
  imageUrl?: string;
}

interface TableItem {
  type: string,
  status: string,
  createTime: string,
  updateTime: string,
  imageUrl: string
}


const addObj = ref<AddForm>({
  type: '',
  fileId: '',
  status: '',
  imageUrl: ''
});
// 查询的参数
const query = reactive({
  status: '',
  type: '',
  page: 1,
  size: 10
});
const creatVisible = ref(false);
const detailImageVisible = ref(false);

const createFolderName = ref('');
const handlerUploadFile = (params: UploadRequestOptions) => {
  const file = params.file;
  const formData = new FormData();
  formData.append('file', file);
  uploadPaymentAction(formData).then(res => {
    if (res.data.code == '200') {
      for (let fileItem of fileList.value) {
        if (fileItem.name == res.data.data.fileName) {
          fileItem.status = 'success';
          addObj.value.fileId = res.data.data.id;
          addObj.value.imageUrl = res.data.data.fullPath;
        }
      }
    } else {
      for (let fileItem of fileList.value) {
        if (fileItem.name == res.data.data.fileName) {
          fileItem.status = 'fail';
          addObj.value.fileId = res.data.data.id;
        }
      }
    }
  })
}

const fetchTableData = () => {
  let queryStr = 'page=' + query.page + '&size=' + query.size;
  if (query.status) {
    queryStr = queryStr + '&status=' + query.status;
  }
  if (query.type) {
    queryStr = queryStr + '&type=' + query.type;
  }
  paymentListAction(queryStr).then(res => {
    if (res.data.code == '200') {
      tableDataList.value = res.data.data.records;
      pageTotal.value = res.data.data.total || 50;
    }
  })
}

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  fetchTableData();
};
fetchTableData();
// 超出文件数量限制的时候 调用该方法
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
      `只能上传一个收款码，需要更新请删除掉上传列表中图片后重新上传！`
  )
}
// 提交新生产的收款码信息
const handlerAddPaymentCode = () => {
  addPaymentAction(JSON.stringify(addObj.value)).then(res => {
    if (res.data.code == '200') {
      fetchTableData();
      creatVisible.value = false;
      addObj.value = {};
      ElMessage.success(
          `新增成功！`
      )
    }
  })
}
// 格式化类型
const formatterType = (row: TableItem) => {
  if (row.type == 'ALI') {
    return '阿里支付';
  }
  if (row.type == 'WECHAT') {
    return '微信支付';
  }
  return row.type
}
// 格式化状态
const formatterStatus = (row: TableItem) => {
  if (row.status == 'ENABLE') {
    return '启用';
  }
  return '禁用';
}

// 查看支付详情
const handleDetail = (index: number, row: TableItem) => {
  previewImagePath.value = row.imageUrl;
  detailImageVisible.value = true;
}

//禁用当前选中的收款码信息
const disablePayment = () => {
  let selectionRows = multipleTableRef.value!.getSelectionRows();
  let dataJson: any[] = [];
  if (selectionRows.length > 0) {
    for (let obj of selectionRows) {
      dataJson.push(obj.id);
    }
    paymentDisableAction(JSON.stringify(dataJson)).then(res => {
      if (res.data.code == '200') {
        fetchTableData();
        ElMessage.success(
            `状态操作完成！`
        )
      }
    })
  }
}
</script>

<style scoped>

</style>
