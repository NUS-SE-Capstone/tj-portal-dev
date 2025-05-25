<!-- 我的积分 - 天梯榜 -->
<template>
  <div class="myInterralRankingWrapper">
    <div class="personalCards">
      <BreadCrumb></BreadCrumb>
      <CardsTitle class="marg-bt-20" title="Ranking" />
      <div class="listCont fx-sb">
        <div class="listRt">
          <div class="tit">Current Season</div>
          <IntegralRankTab :data="currentSeasonsData"></IntegralRankTab>
        </div>
        <div class="listRt">
          <div class="tit fx-sb">
            <span>History</span>
            <div>
              <el-select v-model="season" @change="selectHandle" class="m-2" placeholder="Select">
                <el-option
                  v-for="item in seasonOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>
          <IntegralRankTab :data="seasonsData"></IntegralRankTab>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

/** 数据导入 **/
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getSeasons, getSelectOptions } from "@/api/class.js";
import { useRoute } from "vue-router";
import { dataCacheStore } from "@/store"

// 组件导入
import CardsTitle from './components/CardsTitle.vue'
import BreadCrumb from './components/BreadCrumb.vue'
import IntegralRankTab from './components/IntegralRankTab.vue'

const route = useRoute()
const store = dataCacheStore()

const value = ref(new Date())

const access = ref([
  {'title': 'Learn', status: true},
  {'title': 'ClockIn', status: false},
  {'title': 'QA', status: false},
  {'title': 'Note', status: false},
  {'title': 'Comment', status: false},
])

// 课程目录
const classListData = ref([])
const baseClassTeacherData = ref([])

// mounted生命周期
onMounted(async () => {
 // 下拉参数获取 - 赛季列表
  getHistorySeasonsData()
 // 当前赛季 
 await getSeasonsData(0)
});

/** 方法定义 **/
// 积分榜信息查询
// 当前赛季 
const currentSeasonsData = ref([])
// 第一赛季
const seasonsData = ref([])

const getSeasonsData = (season) => {
  getSeasons({season, pageNo: 1, pageSize: 10})
    .then((res) => {
      if (res.code == 200 ){
        if (season == 0 ){
          currentSeasonsData.value = res.data
          seasonsData.value = res.data;
        } else {
          seasonsData.value = res.data
        }
        
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "get season data err",
        type: 'error'
      });
    });
}
// 历史下拉信息查询
const season = ref(0)
const seasonOptions = ref([])
const getHistorySeasonsData = () => {
  getSelectOptions()
    .then((res) => {
      if (res.code == 200 ){
        res.data[res.data.length - 1].id = 0;
        seasonOptions.value = res.data
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "get history season data err",
        type: 'error'
      });
    });
}
// 选择赛季
const selectHandle = (val) => {
  getSeasonsData(val)
}
</script>
<style lang="scss" src="./index.scss"> </style>
