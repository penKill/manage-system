<template>
  <div>
    <div class="container">
      <!--      表格上方的搜索部分信息-->
      <div class="handle-box">
        <el-input v-model="query.email" placeholder="账号名称（邮箱)" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="handlerAddAccount">新增账号</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="250"></el-table-column>
        <el-table-column prop="password" label="密码" width="120" autocomplete="off">
          <template #default="scope">
            <div v-if="scope.row.hidden">{{ scope.row.password }}</div>
            <div v-else>*************</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="170"></el-table-column>
        <el-table-column prop="status" label="状态">

        </el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-switch
                v-model="scope.row.hidden"
                size="small"
            />
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text>
              禁用
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
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="form.status"
              class="m-2"
              placeholder="Select"
              size="large"
              style="width: 240px"
          >
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
      </template>
    </el-dialog>

    <!-- 新增弹出框 -->
    <el-dialog title="新增账号" v-model=" addVisible " width="30%">
      <el-form label-width="70px">
        <el-form-item
            prop="email"
            label="Email"
        >
          <el-input v-model="addForm.email"/>
        </el-form-item>

        <el-form-item label="密码" :rules="[
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        }]">
          <el-input
              v-model="addForm.password"
              type="password"
              show-password
          />
        </el-form-item>
        <el-form-item label="状态" :rules="[
        {
          required: true,
          message: '请选择状态',
          trigger: 'blur',
        }]">
          <el-select
              v-model="addForm.status"
              class="m-2"
              placeholder="Select"
              size="large"
              style="width: 240px"
          >
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAddAccount">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {handlerAccountSearch, handlerAccountUpdate, handlerAccountAdd} from '../../api/manage';
import { Search, Plus, Edit } from '@element-plus/icons-vue';

interface TableItem {
  id: number;
  email: string;
  password: number;
  mail: string;
  createTime: string;
  updateTime: string;
  status: string;
  hidden: boolean;
}

const query = reactive({
  email: '',
  page: 1,
  size: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  let queryStr = 'page=' + query.page + '&size=' + query.size;
  if (query.email) {
    queryStr = queryStr + '&email=' + query.email
  }
  handlerAccountSearch(queryStr).then(res => {
    if (res.data.code == '200') {
      tableData.value = res.data.data.records;
      tableData.value.forEach(e => {
        e.hidden = false;
      })
      console.log(tableData.value)
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

// 处理用户新增弹窗
const handlerAddAccount = () => {
  addVisible.value = true
  addForm.status=''
  addForm.email=''
  addForm.password=''
};
//处理新增后台用户数据
const saveAddAccount = () => {
  ElMessageBox.confirm('确定要新增账号吗？', '提示', {
    type: 'warning'
  }).then(() => {
    const data = {
      'email': addForm.email,
      'password': addForm.password,
      'status': addForm.status
    }
    addVisible.value = false

    handlerAccountAdd(JSON.stringify(data)).then(res => {
      if (res.data.code == '200') {
        ElMessage.success(`新增成功`);
        getData();
      }else {
        ElMessageBox.confirm(
            'proxy will permanently delete the file. Continue?',
            'Warning',
            {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning',
              draggable: true,
            }
        )
            .then(() => {
              ElMessage({
                type: 'success',
                message: 'Delete completed',
              })
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: 'Delete canceled',
              })
            })
      }
    })
  }).catch(() => {
    console.log('点击其他')
  });
}

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};


// 表格编辑时弹窗和保存
const editVisible = ref(false);
// 表格新增的弹窗控制
const addVisible = ref(false);

let form = reactive({
  email: '',
  password: '',
  status: '',
  id: ''
});
let addForm = reactive({
  email: '',
  password: '',
  status: '',
});
let idx: number = -1;
//处理编辑的情况
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.id = row.id
  form.email = row.email;
  form.password = row.password;
  form.status = row.status;
  editVisible.value = true;
};
// 保存使用调用的方法
const saveEdit = () => {
  //取消对话框修改
  editVisible.value = false;
  console.log(form.status)

  handlerAccountUpdate(JSON.stringify(form)).then(res => {
    if (res.data.code == '200') {
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      getData();
    }
  })
};

// 状态枚举
const statusOptions = [
  {
    value: 1,
    label: '启用',
  },
  {
    value: 0,
    label: '禁用',
  }
]
const saveAdd = () => {
  //取消对话框修改
  addVisible.value = false;
  const data = {}
  // handlerUserEdit(JSON.stringify(form)).then(res => {
  //   if (res.data.code == '200') {
  //     ElMessage.success(`修改第 ${idx + 1} 行成功`);
  //     getData();
  //   }
  // })
};


</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-input {
  width: 300px;
}

.red {
  color: #F56C6C;
}

.mr10 {
  margin-right: 10px;
}

</style>
