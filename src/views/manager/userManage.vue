<template>
  <div>
    <div class="container">
      <!--      表格上方的搜索部分信息-->
      <div class="handle-box">
        <el-select v-model="query.gander" placeholder="性别" class="handle-select mr10">
          <el-option key="1" label="男" value="1"></el-option>
          <el-option key="0" label="女" value="0"></el-option>
        </el-select>
        <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" :icon="Plus" @click="handlerAddUser">新增用户</el-button>
      </div>

      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column label="性别" width="75" align="center">
          <template #default="scope">
            <el-tag
                :type="scope.row.gander === 0 ? 'success' : 'danger'"
            >
              {{ scope.row.gander === 0 ? '女' : '男' }}
            </el-tag>
          </template>
        </el-table-column>


        <el-table-column prop="age" label="年龄" width="55"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="mail" label="邮箱"></el-table-column>
        <el-table-column prop="userDesc" label="用户描述"></el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
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
    <el-dialog title="编辑" v-model="editVisible" width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮件">
          <el-input v-model="form.mail"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.gander" class="handle-select mr10">
            <el-option key="1" label="男" value="1"></el-option>
            <el-option key="0" label="女" value="0"></el-option>
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
    <el-dialog title="新增用户" v-model=" addVisible " width="30%">
      <el-form label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮件">
          <el-input v-model="addForm.mail"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="addForm.gander" class="handle-select mr10">
            <el-option key="1" label="男" value="1"></el-option>
            <el-option key="0" label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="addVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveAddUser">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive} from 'vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {Delete, Edit, Search, Plus} from '@element-plus/icons-vue';
import {fetchData} from '../../api';
import {handlerUserSearch, handlerUserEdit} from '../../api/user'

interface TableItem {
  id: number;
  username: string;
  age: number;
  mail: string;
  nickname: string;
  userDesc: string;
}

const query = reactive({
  gander: '1',
  username: '',
  page: 1,
  size: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
  let queryStr = 'page=' + query.page + '&size=' + query.size;
  if (query.username) {
    queryStr = queryStr + '&username=' + query.username
  }
  if (query.gander) {
    queryStr = queryStr + '&gander=' + query.gander
  }
  handlerUserSearch(queryStr).then(res => {
    if (res.data.code == '200') {
      tableData.value = res.data.data.items;
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
const handlerAddUser = () => {
  addVisible.value = true
};
//处理新增后台用户数据
const saveAddUser = () => {
  ElMessageBox.confirm('确定要新增用户吗？', '提示', {
    type: 'warning'
  }).then(() => {
    console.log('点击确认')

  }).catch(() => {
    console.log('点击其他')

  });

}

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val;
  getData();
};

// 删除操作
const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        ElMessage.success('删除成功');
        tableData.value.splice(index, 1);
      })
      .catch(() => {
      });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
// 表格新增的弹窗控制
const addVisible = ref(false);
let form = reactive({
  username: '',
  nickname: '',
  mail: '',
  gander: '',
  id: ''
});
let addForm = reactive({
  username: '',
  nickname: '',
  mail: '',
  gander: '',
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
  idx = index;
  form.id = row.id
  form.username = row.username;
  form.nickname = row.nickname;
  form.mail = row.mail;
  form.gander = row.gander;
  editVisible.value = true;
};
// 保存使用调用的方法
const saveEdit = () => {
  //取消对话框修改
  editVisible.value = false;
  const data = {}
  handlerUserEdit(JSON.stringify(form)).then(res => {
    if (res.data.code == '200') {
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      getData();
    }
  })
};

const saveAdd = () => {
  //取消对话框修改
  addVisible.value = false;
  const data = {}
  handlerUserEdit(JSON.stringify(form)).then(res => {
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
