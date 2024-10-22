<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div class="custom-tree-container">
          <p>系统菜单录入</p>
          <el-tree
              style="max-width: 600px"
              :data="allMenuData"
              node-key="id"
              :expand-on-click-node="false"
              :render-content="renderContent"
              @node-click="handlerClick"
          />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="custom-tree-container">
          <p>菜单详情</p>
          <el-form label-width="100px" label-height="20px">
            <el-form-item label="父菜单Id：">{{ checkMenuData.parentId }}</el-form-item>
            <el-form-item label="菜单Id：">{{ checkMenuData.id }}</el-form-item>
            <el-form-item label="菜单名：">{{ checkMenuData.name }}</el-form-item>
            <el-form-item label="icon：">{{ checkMenuData.icon }}</el-form-item>
            <el-form-item label="路径：">{{ checkMenuData.path }}</el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <el-dialog
        v-model="creatMenuVisible"
        title="创建路由"
        width="500"
    >
      <el-form-item label="菜单名称">
        <el-input v-model="addMenuForm.name" style="width: 240px" placeholder="请输入菜单名称"/>
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-input v-model="addMenuForm.icon" style="width: 240px" placeholder="请输入图标"/>
      </el-form-item>
      <el-form-item label="路由排序">
        <el-input v-model="addMenuForm.sort" style="width: 240px" placeholder="请输入排序"/>
      </el-form-item>
      <el-form-item label="路由上下文">
        <el-input v-model="addMenuForm.path" style="width: 240px" placeholder="请输入路径"/>
      </el-form-item>
      <br/>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handlerCreateMenu">确定</el-button>
          <el-button @click="creatMenuVisible = false;">取消
          </el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import {fetchAllMenuTree, fetchMenuDetail, addMenuAction, deleteMenuAction} from "@/api/manage";

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

interface MenuItem {
  id: number
  name: string
  parentId: number
  path: string
  icon: string

}

const allMenuData = ref<Tree[]>([]);
//展现菜单树
const showMenuTree = () => {
  fetchAllMenuTree().then(res => {
    allMenuData.value = res.data.data
  })
}
showMenuTree()
const checkMenuData = ref<MenuItem>({})
const renderContent = (
    h,
    {
      node,
      data,
      store,
    }: {
      node: Node
      data: Tree
      store: Node['store']
    }
) => {
  return h(
      'span',
      {
        class: 'custom-tree-node',
      },
      h('span', null, node.label),
      h(
          'span',
          null,
          h(
              'a',
              {
                onClick: () => append(data),
              },
              '新增'
          ),
          h(
              'a',
              {
                style: 'margin-left: 8px',
                onClick: () => handlerRemove(node, data),
              },
              '删除'
          ),
      )
  )
}
// 处理被选中后 显示细节
const handlerClick = (data: Tree) => {
  fetchMenuDetail(data.id).then(res => {
    checkMenuData.value = res.data.data
  })
}
// 新增方法
const append = (data: Tree) => {
  creatMenuVisible.value = true;
  addMenuForm.value.parentId = data.id
}

const creatMenuVisible = ref(false);
const addMenuForm = ref<MenuItem>({
  id: 0,
  name: '',
  parentId: 0,
  path: '',
  icon: ''
})

const handlerCreateMenu = () => {
  addMenuAction(JSON.stringify(addMenuForm.value)).then(res => {
    creatMenuVisible.value = false;
    showMenuTree()

  })
}



const handlerRemove = (node: Node, data: Tree) => {
  let dataJson = {"id": data.id}
  deleteMenuAction(JSON.stringify(dataJson)).then(res => {
    if (res.data.code == '200') {
      showMenuTree()
    }
  })
}


</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
