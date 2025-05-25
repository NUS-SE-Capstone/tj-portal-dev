<!-- 我的考试 - 列表表格  -->
<template>
  <div class="classCards fx-1">
    <el-table class="table" :data="data" style="">
      <el-table-column prop="courseName" center label="Course">
        <template #default="scope">
          <div>{{scope.row.courseName}}</div>
        </template>
      </el-table-column>
      <el-table-column center prop="sectionName" label="Section" align="center" min-width="160" />
      <el-table-column prop="commitTime" align="center" label="Time" width="180" >
        <template #default="scope">
          <span>{{scope.row.commitTime ? scope.row.commitTime : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" align="center" label="Type" width="100" >
        <template #default="scope">
          <span>{{scope.row.type == 0 ? '练习' : '考试'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" align="center" label="Score" width="60" >
        <template #default="scope">
          <span>{{scope.row.score || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action" align="center" width="100">
        <template #default="scope">
          <div class="font-bt1" @click="() => $router.push({path:'myExamdetails', query:scope.row})">view</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>

// 介绍父组件传来的标题
defineProps({
  data:{
    type: Array,
    default: []
  }
})  
</script>
<style lang="scss" scoped>
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
