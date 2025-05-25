<!-- 我的积分 -->
<template>
  <div class="myInterralWrapper">
    <div class="personalCards">
      <CardsTitle class="marg-bt-20" title="My Points" />
      <div class="title"></div>
      <!-- 打卡日历 -->
      <Calendar @pointsSign="pointsSignHandle"></Calendar>
      <!-- 积分获取 -->
      <div class="listCont fx-sb">
        <div class="list">
          <div class="tit">Get Points</div>
          <div class="tab">
            <div class="item fx-sb" v-for="item in access" :key="item.type">
              <span>{{item.type}}</span>
              <span>{{item.points}}/{{item.maxPoints}}</span>
            </div>
          </div>
        </div>
        <div class="listRt">
            <div class="tit fx-sb">
              <span>Ranking</span>
              <span class="more font-bt" @click="() => $router.push({path: 'myIntegralRanking', query:{rank: seasonsData.rank, points:seasonsData.points}})">More &gt;</span>
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
import { getSeasons, getTodayPoints, pointsSign } from "@/api/class.js";
import { useRoute } from "vue-router";
import { dataCacheStore } from "@/store"

// 组件导入
import CardsTitle from './components/CardsTitle.vue'
import Calendar from './components/Calendar.vue'
import IntegralRankTab from './components/IntegralRankTab.vue'

const route = useRoute()
const store = dataCacheStore()

const value = ref(new Date())

const access = ref([
  {value: 1, 'type': 'Learn', points:0, maxPoints: 50},
  {value: 2, 'type': 'ClockIn', points:0, maxPoints: 2},
  {value: 3, 'type': 'QA', points:0, maxPoints: 20},
  {value: 4, 'type': 'Note', points:0, maxPoints: 20},
  {value: 5, 'type': 'Comment', points:0, maxPoints: 999},
])

// 课程目录
const classListData = ref([])
const baseClassTeacherData = ref([])

// mounted生命周期
onMounted(async () => {
 // 积分榜信息查询
 getSeasonsData()
 // 积分获得记录
 getSignRecordsHandle()
});

/** 方法定义 **/

// 积分榜信息查询
const seasonsData = ref([])
const getSeasonsData = () => {
  getSeasons({season:0, pageNo: 1, pageSize: 10})
    .then((res) => {
      if (res.code == 200 ){
        console.log(3333, res.data)
        seasonsData.value = res.data
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
// 用户本日积分情况查询失败
const toadyPointsData = ref()
const getSignRecordsHandle = async () => {
  await getTodayPoints()
    .then((res) => {
      if (res.code == 200 ){
        access.value.map(n => {
          res.data.forEach( val => {
            if (val.type == n.type){
              n.points = val.points
            }
          })
        })
        toadyPointsData.value = res.data
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "req user clock in err",
        type: 'error'
      });
    });
}
// 打卡 - 返回积分
const pointsSignHandle = async () => {
  await pointsSign()
    .then((res) => {
      if (res.code == 200 ){
        ElMessage({
          message: 'Clock In Success!!!',
          type: 'success'
        });
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "Clock in err",
        type: 'error'
      });
    });
}

</script>
<style lang="scss" src="./index.scss"> </style>
