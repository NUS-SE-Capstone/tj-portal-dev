<!-- 我的考试 - 列表表格  -->
<template>
  <div class="classCards fx-1">
    <el-table class="table" :data="data" style="">
      <el-table-column prop="courseName" center label="Course">
        <template #default="scope">
          <div>{{scope.row.courseName}}</div>
        </template>
      </el-table-column>
      <el-table-column center prop="sectionName" label="Section" align="center" min-width="150" />
      <el-table-column prop="commitTime" align="center" label="Time" width="180" >
        <template #default="scope">
          <span>{{scope.row.commitTime ? scope.row.commitTime : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" align="center" label="Type" width="100" >
        <template #default="scope">
          <span>{{scope.row.type == 1 ? 'Exercise' : 'Test'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" align="center" label="Score" width="80" >
        <template #default="scope">
          <span>{{scope.row.score || 0}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="Action" align="center" width="100">
        <template #default="scope">
          <div class="font-bt1" @click="() => $router.push({path:'myExamdetails', query:scope.row})">view</div>
        </template>
      </el-table-column> -->
    <el-table-column label="Action" align="center" width="100">
  <template #default="scope">
    <div
      class="font-bt1"
      :class="{ disabled: !isActionEnabled(scope.row.commitTime) }"
      @click="() => handleAction(scope.row)"
      style="cursor: pointer;"
    >
      view
    </div>
  </template>
</el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 介绍父组件传来的标题
defineProps({
  data:{
    type: Array,
    default: []
  }
})  

// 判断按钮是否可点击
function isActionEnabled(commitTime) {
  if (!commitTime) return false
  const commitDate = new Date(commitTime.replace(' ', 'T')) // 兼容格式
  const now = new Date()
  const diff = now - commitDate
  return diff >= 15 * 1000
}

// 点击跳转
function handleAction(row) {
  if (!isActionEnabled(row.commitTime)) return
  router.push({ path: 'myExamdetails', query: row })
}
</script>
<style lang="scss" scoped>
.disabled {
  color: #999;
  pointer-events: none;
  cursor: not-allowed;
}
.classCards{
  margin-top: 20px;
  line-height: 30px;
  
  .table{
    border: solid 1px #ebeef5;
    border-bottom: none;
  }
  img{
    width: 236px;
    height: 132px;
    border-radius: 4px;
  }
  .info{
    line-height: 30px;
    font-size: 14px;
    .tit{
      font-size: 20px;
      font-weight: 500;
      line-height: 40px;
    }
  }
}
</style>
