<template>
  <div class="container">
    <div class="plugins-tips">角色信息仅展示最新或创建的5个角色名称</div>
    <div class="mgb20">
      <span class="label">角色：</span>
      <el-select v-if="roleNameData" v-model="roleNameData" @change="handleChange">
        <el-option
            v-for="item in roleListData"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
        />
      </el-select>
    </div>
    <div class="mgb20 tree-wrapper">
      <el-tree
          ref="tree"
          :data="allMenuData"
          node-key="id"
          default-expand-all
          show-checkbox
          :default-checked-keys="checkedKeys"
      />
    </div>
    <el-button type="primary" @click="onSubmit">保存权限</el-button>
  </div>
</template>

<script setup lang="ts" name="permission">
import {ref, onBeforeMount} from 'vue';
import {ElTree, ElMessage} from 'element-plus';
import {usePermissStore} from '../../store/permiss';
import {fetchMenuTree, fetchRoleList, fetchCheckMenu, updateRoleMenu} from "../../api/manage";

const role = ref<string>('admin');

interface RoleList {
  roleId: bigint;
  roleName: string;
}

const roleListData = ref<RoleList[]>([]);
const roleNameData = ref<Stirng>('');
const roleIdData = ref<Stirng>('');


interface Tree {
  id: string;
  label: string;
  children?: Tree[];
}

const allMenuData = ref<Tree[]>([]);
//展现菜单树
const showMenuTree = () => {
  fetchMenuTree().then(res => {
    allMenuData.value = res.data.data;
  });
};
showMenuTree();

// 组件加载之前调用
onBeforeMount(() => {
  fetchRoleList().then(res => {
    roleListData.value = res.data.data;
    roleNameData.value = res.data.data[0].roleName;
    roleIdData.value = res.data.data[0].roleId;
    //查询后端当前角色的哪些被选中了
    fetchCheckMenu(res.data.data[0].roleId).then(res => {
      checkedKeys.value = res.data.data;
    })
  });
})
const permiss = usePermissStore();


// 获取当前权限
const checkedKeys = ref<string[]>([]);
// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
  let dataJson = {
    "roleId": roleIdData.value,
    "menuIdList": tree.value!.getCheckedKeys(false)
  }
  updateRoleMenu(JSON.stringify(dataJson)).then(res => {
    if (res.data.code == '200') {
      ElMessage.success(`保存成功`);
      getData();
    }
  });
};
// 下拉选中切换的时候
const handleChange = (val: string[]) => {
  fetchCheckMenu(val).then(res => {
    tree.value!.setCheckedKeys(res.data.data);
    roleIdData.value = val
  })
};
</script>

<style scoped>
.tree-wrapper {
  max-width: 500px;
}

.label {
  font-size: 14px;
}
</style>
