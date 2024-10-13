<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card shadow="hover" class="mgb20">
          <template #header>
            <div class="clearfix">
              <span>待结算单金额</span>
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon">
                  <User/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">1234</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon">
                  <ChatDotRound/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>系统消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon">
                  <Goods/>
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">5000</div>
                  <div>商品数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>系统运行日志</span>
            </div>
          </template>

          <!-- <el-table :show-header="false" :data="todoListData.dataList" style="width: 100%">
            <el-table-column width="40">
              <template #default="scope">
                <el-checkbox v-model="scope.row.status"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div
                    class="todo-item"
                    :class="{
										'todo-item-del': scope.row.status
									}"
                >
                  {{ scope.row.title }}
                </div>
              </template>
            </el-table-column>
          </el-table> -->
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>系统运行日志</span>
            </div>
          </template>
          333
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>系统运行日志</span>
            </div>
          </template>
          44444
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import {onMounted} from 'vue';
import {dashBordLastLoginInfo, dashBordTodoListInfo} from '@/store/dashboard';
import {fetchLastLoginInfo, fetchUndoList} from '@/api/dashboard';

const dashBordLastLogin = dashBordLastLoginInfo();

const todoListData = dashBordTodoListInfo();

const name = sessionStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';


onMounted(() => {
  // 加载上次登录时间 和地点
  fetchLastLoginInfo().then(res => {
    if (res?.data?.code == '200') {
      dashBordLastLogin.setLastLoginInfo({
        lastLoginTime: res.data.data.lastTime,
        lastLoginPlace: res.data.data.lastPlace
      })
    }
  });
  fetchUndoList().then((res: any) => {
    if (res.data.code == '200') {
      todoListData.setDataList(res.data.data)
    }
  })

});

const options = {
  type: 'bar',
  title: {
    text: '最近一周各品类销售图'
  },
  xRorate: 25,
  labels: ['周一', '周二', '周三', '周四', '周五'],
  datasets: [
    {
      label: '家电',
      data: [234, 278, 270, 190, 230]
    },
    {
      label: '百货',
      data: [164, 178, 190, 135, 160]
    },
    {
      label: '食品',
      data: [144, 198, 150, 235, 120]
    }
  ]
};
const options2 = {
  type: 'line',
  title: {
    text: '最近几个月各品类销售趋势图'
  },
  labels: ['6月', '7月', '8月', '9月', '10月'],
  datasets: [
    {
      label: '家电',
      data: [234, 278, 270, 190, 230]
    },
    {
      label: '百货',
      data: [164, 178, 150, 135, 160]
    },
    {
      label: '食品',
      data: [74, 118, 200, 235, 90]
    }
  ]
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
