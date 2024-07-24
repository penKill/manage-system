<template>
  <div>
    <div class="container">
      <!--      表格上方的搜索部分信息-->
      <div class="handle-box">
        <el-input v-model="query.configKey" placeholder="请输入系统配置Key" class="handle-input mr10"/>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>

      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" highlight-current-row
                header-cell-class-name="table-header">
        <el-table-column type="index" label="序号" width="60"/>
        <el-table-column prop="configKey" label="配置key" width="350">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="600">
              <template #default>
                <div><p style="color:blue">配置值:</p> {{ scope.row.configValue }}</div>
                <div><p style="color:blue">注释信息:</p> {{ scope.row.notes }}</div>
              </template>
              <template #reference>
                <el-tag :style="scope.row.enable=='ENABLE'?'color:green':'color:red'"> {{
                    scope.row.configKey
                  }}
                </el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index, scope.row)" v-permiss="16">
              删除
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑" v-model="editVisible" width="50%">
      <el-form label-width="120px">
        <el-form-item label="配置key">
          <el-input v-model="editForm.configKey" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="配置value">
          <el-input
              v-model="editForm.configValue"
              :autosize="{ minRows: 4, maxRows: 8 }"
              type="textarea"
              placeholder="请输入配置值"
          />
        </el-form-item>
        <el-form-item label="注释信息">
          <el-input
              v-model="editForm.notes"
              :autosize="{ minRows: 4, maxRows: 8 }"
              type="textarea"
              placeholder="请输入注释信息"
          />
        </el-form-item>
        <el-form-item label="禁用/启用 ">
          <el-switch
              v-model="editForm.enable"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-value="ENABLE"
              inactive-value="DISABLE"
          />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {handlerConfigEdit, handlerConfigSearchPage, handlerConfigDelete} from '../../api/manage'


interface TableItem {
  id: number;
  configValue: string;
  configKey: number;
  createTime: string;
  updateTime: string;
}

// 查询的参数
const query = reactive({
  configKey: '',
  page: 1,
  size: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  let queryStr = 'page=' + query.page + '&size=' + query.size;
  if (query.configKey) {
    queryStr = queryStr + '&configKey=' + query.configKey
  }
  handlerConfigSearchPage(queryStr).then(res => {
    if (res.data.code == '200') {
      tableData.value = res.data.data.records;
      pageTotal.value = res.data.data.total || 50;
    }
  });
};
getData();
// 查询操作
const handleSearch = () => {
  query.page = 1;
  query.size = 10;
  getData();
  ElMessage.success(`查询成功`);
};


// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};

// 删除操作
const handleDelete = (index: number, data: any) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    handlerConfigDelete(data.id)
    getData();
  }).catch(() => {
      });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
// 表格新增的弹窗控制
const addVisible = ref(false);
let editForm = reactive({
  configKey: '',
  configValue: '',
  notes: '',
  enable: 'DISABLE',
  id: ''
});

let idx: number = -1;
//处理编辑的情况
const handleEdit = (index: number, row: any) => {
  idx = index;
  editForm.id = row.id
  editForm.configKey = row.configKey;
  editForm.configValue = row.configValue;
  editForm.notes = row.notes;
  editForm.enable = row.enable;
  editVisible.value = true;
};
// 保存使用调用的方法
const saveEdit = () => {
  //取消对话框修改
  editVisible.value = false;
  const data = {}
  handlerConfigEdit(JSON.stringify(editForm)).then(res => {
    if (res.data.code == '200') {
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      getData();
    }
  })
};


</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}

.table {
  width: 100%;
  font-size: 14px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
