<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebar.collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in state.menusData">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="(subItem, j) in item.subs">
              <el-sub-menu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                  v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss" :key="`${subItem.index}-${j}`">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, onMounted} from 'vue';
import {useSidebarStore} from '../store/sidebar';
import {useRoute} from 'vue-router';
import { fetchMenuTree } from '@/api/manage';

const state = reactive<any>({
  menusData: [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1',
  },
  {
    icon: 'Grid',
    index: '4',
    title: '订单中心',
    permiss: '4',
    subs: [
      {
        index: '/introduce',
        title: '套餐详情',
        permiss: '5',
      }, {
        index: '/orderList',
        title: '订单列表',
        permiss: '6',
      },
    ],
  },
  {
    icon: 'Postcard',
    index: '5',
    title: '其他管理',
    permiss: '4',
    subs: [
      {
        index: '/fileManage',
        title: '文件管理',
        permiss: '5',
      },
      {
        index: '/paymentCode',
        title: '收款码管理',
        permiss: '6',
      }
    ],
  },
  {
    icon: 'User',
    index: '22',
    title: '管理员中心',
    permiss: '22',
    subs: [
      {

        index: '/userManage',
        title: '用户管理',
        permiss: '23',
      },
      {
        index: '/accountManage',
        title: '机场账号管理',
        permiss: '25',
      },
      {
        index: '/systemConfig',
        title: '系统设置',
        permiss: '25',
      },
      {
        index: '/permission',
        title: '权限管理',
        permiss: '13',
      },
    ],
  },
],
})

onMounted(() => {
  fetchMenuTree().then((res) => {
    console.log(res);
    // state.menusData = res.data?.data || []
  });
});

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
