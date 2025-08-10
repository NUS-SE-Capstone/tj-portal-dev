<!-- 我的考试 -->
<template>
  <div class="myExamWrapper">
    <div class="personalCards" v-if="myExamData != null">
      <CardsTitle class="marg-bt-20" title="My Exam">
        <el-tooltip content="This is your remaining token balance used for AI-based scoring of subjective questions." placement="top">
          <span>
          Token Balance: {{ userInfo.token }} / 5000
          </span>
        </el-tooltip>
      </CardsTitle>
      <div v-if="count == 0" class="nodata">
        <Empty ></Empty>
      </div>
      <ExamTable v-if="count > 0" :data="myExamData"></ExamTable>
      <div class="pageination" v-if="count > 0">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="count"
          class="mt-4"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script setup>

/** 数据导入 **/
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getExamList } from "@/api/class.js";
import { getUserInfo} from "@/api/user.js"

// 组件导入
import CardsTitle from './components/CardsTitle.vue'
import ExamTable from './components/ExamTable.vue'
import Empty from "@/components/Empty.vue";

const userInfo = ref()

// mounted生命周期
onMounted(async () => {
  // 查询我的考试记录
  getExamListData()
  getUserToken()
});

/** 方法定义 **/
//查询我的个人信息
const getUserToken = async() => {
  await getUserInfo()
  .then((res)=>{
      if (res.code == 200 && res.data != null){
        userInfo.value = res.data
      }
  })
  .catch(() => {
      ElMessage({
        message: "get exam details err",
        type: 'error'
      });
    });
}
// 查询我的考试记录
const myExamData = ref(null)
const count = ref(0)
const params = reactive({
  pageNo: 1,
  pageSize: 10,
})
// 查询我的考试记录
const getExamListData = async () => {
  await getExamList(params)
    .then((res) => {
      if (res.code == 200 && res.data != null){
        myExamData.value = res.data.list
        count.value = Number(res.data.total)
      }
    })
    .catch(() => {
      ElMessage({
        message: "req exam list err!",
        type: 'error'
      });
    });
}

const handleSizeChange = (val) => {
  params.pageSize = val
  getExamListData()
}
const handleCurrentChange = (val) => {
  params.pageNo = val
  getExamListData()
}
</script>
<style lang="scss" src="./index.scss"> </style>
