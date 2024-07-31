<template>
  <el-config-provider :locale="zhCn">
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">
import {ElConfigProvider} from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import {fetchSystemInfo} from "./api/globalSetting";

import {onMounted} from 'vue';

const initSystemInfo = () => {
  fetchSystemInfo().then(res => {
        localStorage.setItem('systemInfo', JSON.stringify(res.data.data));
      }
  )
}

onMounted(() => {
  initSystemInfo();
})
</script>
<style>
@import './assets/css/main.css';
@import './assets/css/color-dark.css';
</style>
