<template>
  <div style="margin-bottom: 20px">
    <div>
      <label>订单状态：</label>
      <el-select
          v-model="value"
          placeholder="选择订单状态"
          style="width: 240px"
      >
        <el-option key="1" label="未发送" value="1"/>
        <el-option key="2" label="待结算" value="2"/>
        <el-option key="3" label="已结算" value="3"/>
      </el-select>
      <el-button @click="getData">查询</el-button>
    </div>
    <div style="margin-top: 20px; ">
      <el-button private @click="handlerSendEmail">发送邮件</el-button>
      <el-button @click="handlerSettlementOrder">结算</el-button>
    </div>
  </div>
  <div>
    <el-table
        ref="multipleTableRef"
        :data="tableData"
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column type="index" label="序号" width="60"/>
      <el-table-column property="mealIdValue" label="套餐名称" width="120"/>
      <el-table-column property="price" label="价格" width="120"/>
      <el-table-column property="status" label="状态" width="80" :formatter="formatterStatus"/>
      <el-table-column property="startTime" label="套餐开始时间"/>
      <el-table-column property="endTime" label="套餐结束时间"/>
      <el-table-column property="email" label="邮箱"/>
      <el-table-column property="notes" label="备注信息"/>
    </el-table>
  </div>
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
</template>

<script setup lang="ts" name="orderList">
import {reactive, ref} from 'vue'
import {ElTable, TableColumnCtx, ElMessage} from 'element-plus'
import {fetchOrderList, sendEmailAction, handlerSettlementAction} from '../../api/order'

interface OrderList {
  id: string,
  price: number,
  startTime: string,
  endTime: string,
  createTime: string,
  updateTime: string,
  notes: string,
  email: string,
  status: string,
  mealIdValue: string,

}

//定义数据
const tableData = ref<OrderList[]>([]);


const query = reactive({
  status: '',
  page: 1,
  size: 10
});
const pageTotal = ref(0);

//获取后端数据
const getData = () => {
  let queryStr = 'page=' + query.page + '&size=' + query.size;
  if (query.status) {
    queryStr = queryStr + '$status' + query.status;
  }
  console.log(queryStr)
  fetchOrderList(queryStr).then(res => {
    if (res.data.code == '200') {
      tableData.value = res.data.data.records;
      pageTotal.value = res.data.data.total || 50;
    }
  })
}
// console.log('获取数据')
getData();

// 分页导航
const handlePageChange = (val: number) => {
  query.page = val | 0;
  getData();
};
//格式化状态
const formatterStatus = (row: OrderList, column: TableColumnCtx<OrderList>) => {
  if (row.status === 'TO_SEND') {
    return '发送中';
  } else if (row.status === 'SUCCESS_SETTLEMENT') {
    return '结算完成';
  } else if (row.status === 'FAIL_SEND') {
    return '邮件发送失败';
  } else if (row.status === 'TO_SETTLEMENT') {
    return '待结算';
  }
  return row.status;
}
//多选
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

const value = ref([])
// 处理重新发送邮件信息
const handlerSendEmail = () => {
  //返回当前表单中选中的行
  let selectionRows = multipleTableRef.value!.getSelectionRows();
  let data: string[] = [];
  Object.keys(selectionRows).forEach(key => {
    data.push(selectionRows[key].id)
  });
  if (data.length > 0) {
    sendEmailAction(JSON.stringify(data)).then(res => {
      ElMessage.success('正在重新发送邮件中！');

    });
  } else {
    ElMessage.warning('请选择数据');
  }
}
//处理生成结算单
const handlerSettlementOrder = () => {
  //返回当前表单中选中的行
  let selectionRows = multipleTableRef.value!.getSelectionRows();
  let data: string[] = [];
  Object.keys(selectionRows).forEach(key => {
    data.push(selectionRows[key].id)
  });
  if (data.length > 0) {
    handlerSettlementAction(JSON.stringify(data)).then(res => {
      if (res.data.code == '200') {
        ElMessage.success('生成待结算单成功！');
      }
    });
  } else {
    ElMessage.warning('请选择数据');
  }
}
</script>

<style scoped>

</style>
