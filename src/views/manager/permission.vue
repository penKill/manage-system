<template>
  <div class="container">
    <div class="plugins-tips">角色信息仅展示最新或创建的5个角色名称</div>
    <div class="mgb20">
      <span class="label">角色：</span>
      <el-select v-if="roleListData[0]" v-model="roleListData[0].roleName" @change="handleChange">
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
import {ElTree} from 'element-plus';
import {usePermissStore} from '../../store/permiss';
import {fetchMenuTree, fetchRoleList, fetchCheckMenuList} from "../../api/manage";

const role = ref<string>('admin');

interface RoleList {
  roleId: bigint;
  roleName: string;
}

const roleListData = ref<RoleList[]>([]);


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
  });
})
const permiss = usePermissStore();

// 获取当前权限
const checkedKeys = ref<string[]>([]);
const getPremission = () => {
  // 请求接口返回权限
  fetchCheckMenuList().then(res => {
    checkedKeys.value = res.data.data;
  })
};
getPremission();

// 保存权限
const tree = ref<InstanceType<typeof ElTree>>();
const onSubmit = () => {
  // 获取选中的权限
  console.log(tree.value!.getCheckedKeys(false));
};

const handleChange = (val: string[]) => {
  // tree.value!.setCheckedKeys(permiss.defaultList[role.value]);
  console.log('待补充相关事件处理信息')
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
