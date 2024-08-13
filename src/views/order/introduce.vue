<template>

  <div class="common-layout">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="6">
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="6">
            <el-button v-if="buttonDataList" v-for="button in buttonDataList" :key="button.id"
                       type="info" round :plain="true" :bg="false"
                       @click="handlerSearchInfo(button.id)">{{
                button.text
              }}
            </el-button>
          </el-col>
          <el-col :span="4">
          </el-col>
          <el-col :span="6">
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col v-for="card in cardListDetailData" :key="card.id" :span="10">
            <el-card style="max-width: 480px">
              <template #header>
                <div class="card-header">
                  <span>
                    <el-text class="mx-1" type="primary" size="large">{{ card.title }}</el-text>
                  </span>
                  <span>
                  <el-text class="mx-1" type="danger" size="large">
                    ({{ card.price }}起元/{{ card.period }}{{ card.unit }})
                  </el-text>
                  </span>
                </div>
              </template>
              <p v-for="desc in card.describe" style="color: green">
                <el-icon>
                  <CircleCheckFilled/>
                </el-icon>
                {{ desc }}
              </p>
              <p v-for="desc in card.tips" style="color: red">
                <el-icon>
                  <CircleCheckFilled/>
                </el-icon>
                {{ desc }}
              </p>
              <div style="margin-left: 10px">
                <el-button type="primary" @click="handlerBuy(card)" style="float: right ;margin: 10px">选我</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
  <!-- 编辑弹出框 -->
  <el-dialog title="详情" v-model="bugVisible" width="30%">
    <el-form label-width="120px">
      <el-form-item label="套餐名称:">
        {{ mealModel.title }}
      </el-form-item>
      <el-form-item label="价格:">
        {{ mealModel.price }}元/{{ mealModel.period }}{{ mealModel.unit }}
      </el-form-item>
      <el-divider/>
      <el-form-item label="终端使用:">
        <el-select
            v-model="selectOption"
            multiple
            placeholder="选择哪几个终端使用"
            style="width: 180px"
            @change="changeUseModel"
        >
          <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>

      </el-form-item>
      <el-form-item label="邮件">
        <el-input v-model="mealModel.email" clearable placeholder="使用教程将发送该邮箱" type="email"></el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input v-model="mealModel.notes" clearable placeholder="备注信息"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="bugVisible = false">取 消</el-button>
					<el-button type="primary" @click="handlerPlaceOrder">确 定</el-button>
				</span>
    </template>
  </el-dialog>


</template>

<script setup lang="ts" name="introduce">
import {reactive, ref} from 'vue';

import {fetchMealTypeList, fetchMealDetailList, placeOrder, fetchDetailPrice} from '../../api/order'
import {ElMessage} from "element-plus";

const bugVisible = ref(false);

//处理切换数据
const handlerSearchInfo = (val: any) => {
  handlerMealDetailList(val);
}

// 按钮数据结构定义
interface ButtonData {
  id: string,
  text: string
}

let mealModel = reactive({
  id: '',
  unit: '',
  title: '',
  period: 0,
  price: 0,
  describe: [''],
  tips: [''],
  email: '',
  notes: ''
});

interface MealInfoDetailData {
  id: string,
  unit: string,
  title: string
  period: number,
  price: number,
  describe: string[],
  tips: string[],
}


const buttonDataList = ref<ButtonData>();
const cardListDetailData = ref<MealInfoDetailData>();
//执行参数
fetchMealTypeList().then(res => {
  buttonDataList.value = res.data.data;
  // 首次进入时候搜索
  handlerMealDetailList(res.data.data[0].id);
})

const handlerMealDetailList = (val: string) => {
  fetchMealDetailList(val).then(res => {
    cardListDetailData.value = res.data.data;
  })
}
// 处理购买逻辑
const handlerBuy = (detail: MealInfoDetailData) => {
  mealModel.title = detail.title;
  mealModel.id = detail.id;
  mealModel.unit = detail.unit;
  mealModel.period = detail.period;
  mealModel.price = detail.price;
  mealModel.describe = detail.describe;
  mealModel.tips = detail.tips;
  bugVisible.value = true
}

const selectOption = ref([])
// 选中的套餐
const typeOptions = [
  {
    value: 'window',
    label: 'Windows电脑',
  },
  {
    value: 'android',
    label: 'Android手机',
  },
  {
    value: 'mac',
    label: 'apple电脑',
  }
]
// 当发生时间选中时候 触发的
const changeUseModel = (val: any) => {
  let data = {
    'mealId': mealModel.id,
    'modelList': val,

  }
  // 从后端获取价格
  fetchDetailPrice(JSON.stringify(data)).then(res => {
    mealModel.price = res.data.data;
  })
  selectOption.value = val;
}
// 处理下单逻辑
const handlerPlaceOrder = () => {
  let data = {
    'mealId': mealModel.id,
    'modelList': selectOption.value,
    'email': mealModel.email,
    'notes': mealModel.notes
  }
  placeOrder(JSON.stringify(data)).then(res => {
    bugVisible.value = false;
    ElMessage.success(`下单成功`);
  })
}

</script>

<style scoped>

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

row-bg {
  margin-top: 40px;
}

.el-card {
  margin-top: 40px;
  margin-bottom: 40px;
  margin-left: 100px;

}
</style>
