<!-- 课程详情 -->
<template>
  <div class="classDetailsWrapper">
    <div class="detailHead">
      <div class="backGround"><img :src="baseDetailsData.coverUrl" width="100%" alt=""/></div>
      <div class="container">
        <Breadcrumb :data="baseDetailsData.cateNames && baseDetailsData.cateNames.split('/').at(-1)"></Breadcrumb>
        <div class="topInfo fx">
          <div class=""><img :src="baseDetailsData.coverUrl" width="380" height="234" alt="" /></div>
          <div class="fx-1">
              <div class="title">{{baseDetailsData.name}}</div>
              <div class="item fx">
                <div class="card">
                  <div class="tit">Course Num</div>
                  <div class="info">{{baseDetailsData.cataTotalNum}} Sections</div>
                </div>
                <div class="card">
                  <div class="tit">Available</div>
                  <div class="info">{{baseDetailsData.validDuration > 99 ? 'Permanent' : `${baseDetailsData.validDuration} Months`}}</div>
                </div>
                <div class="card bd-non">
                  <div class="tit">Score</div>
                  <div class="info">{{baseDetailsData.score/10}}</div>
                </div>
              </div>
              <div class="fx">
                <div @click="collectionHandle" class="bt-wt bt-round marg-rt-15 ft-14" :class="{isCollection:isCollection}"> <i :class="{iconfont:true, 'zhy-btn_shoucang':!isCollection, 'zhy-btn_yishoucang':isCollection}"></i> Collect</div>
                <!-- <div class="bt-wt bt-round ft-14"><weixin class="wx"></weixin> Share</div> -->
              </div>
          </div>
        </div>
        <div v-if="baseDetailsData">
          <div class="buyCont fx-sb" v-if="baseDetailsData.price != '0'" >
          <div class="fx-ct">
            <span class="price">$</span>
            <span class="price">{{(baseDetailsData.price / 100).toFixed(2) }}</span>
            <span class="desc">Refund at any time before class, Guarantee after-sales service</span> 
          </div>
          <div class="buy" v-if="!isSignUp">
            <span class="bt-red1 bt-round marg-rt-20" @click="addCarts()">Add to Cart</span>
            <span class="bt-red bt-round" @click="payHandle()" >Buy Now</span>
          </div>
          <div class="buy" v-else @click="goLearning">
            <span class="bt-red bt-round">Learn Now</span>
          </div>
        </div>
        <div class="buyCont fx-sb" v-else >
          <div class="fx-ct">
            <span class="price">Free</span>
          </div>
          <div class="buy" v-if="!isSignUp" @click="signUpHandle">
            <span class="bt-red bt-round">Sign Up</span>
          </div>
          <div class="buy" v-else @click="goLearning">
            <span class="bt-red bt-round">Learn Now</span>
          </div>
        </div>
        </div>

      </div>
    </div>
    <!-- 主体部分 - start -->
    <div class="DetailsContent container fx">
      <div class="leftCont bg-wt">
        <TableSwitchBar :data="tableBar" @changeTable="changeTable"></TableSwitchBar>
        <!-- 课程介绍 -->
        <ClassAbout v-show="actId == 1" :baseDetailsData="baseDetailsData" :baseClassTeacher="baseClassTeacher"></ClassAbout>
        <!-- 课程目录 -->
        <ClassCatalogue v-show="actId == 2" :data="classListData" :isSignUp="isSignUp"  :id="detailsId"></ClassCatalogue>
        <!-- 问答模块 -->
        <ClassAsk v-if="isLogin() && isSignUp" v-show="actId == 3" :id="detailsId" :title="baseDetailsData.name"></ClassAsk>
        <!-- 笔记模块 -->
        <Note  v-if="isLogin() && isSignUp" v-show=" actId == 4" :id="detailsId"></Note>
        <div class="fx-ct ft-cl-des" style="height: 400px;" v-show="actId == 5" :id="detailsId">
          No Data!
        </div>
      </div>
      <div class="ritCont">
        <!-- 常见问题 -->
        <Ask :data="askData"></Ask>
        <!-- 猜你喜欢 -->
        <LikeCards :data="LikeData"></LikeCards>
      </div>
    </div>
    <!-- 主体部分 - end -->
  </div>
</template>
<script setup>

/** 数据导入 **/
import defaultCover from '@/assets/default-cover.png'
import { computed, onMounted, ref } from "vue";
import { ElMessage,ElMessageBox } from "element-plus";
import { getClassDetails, getClassTeachers, getClassList } from "@/api/classDetails.js";
import { enrolledFreeCourse, putCarts } from "@/api/order.js";

import { getCourseLearning } from "@/api/class.js";
import { useRoute, useRouter } from "vue-router";
import { dataCacheStore } from "@/store"

// 组件导入
import Breadcrumb from "@/components/Breadcrumb.vue";
import TableSwitchBar from "@/components/TableSwitchBar.vue";
import Empty from "@/components/Empty.vue";
import ClassAbout from "./components/ClassAbout.vue";
import LikeCards from "./components/LikeCards.vue";
import Ask from "./components/Ask.vue";
import ClassAsk from "./components/ClassAsk.vue";
import Note from "./components/Note.vue";
import ClassCatalogue from "./components/ClassCatalogue.vue";
import { isLogin } from "@/store";
import weixin from '@/assets/icon_weixin.svg'

const route = useRoute()
const router= useRouter()
const store = dataCacheStore()

// 结果 - 详情Id
const detailsId = ref()

// 课程信息及讲师信息
const baseDetailsData = ref({})
const baseClassTeacher = ref([])

// table切换数据 - 静态数据
const logData = [{id: 1, name: 'Info'}, {id: 2, name: 'catalogue'},{id: 3, name: 'QA'},{id: 4, name: 'Note'}, {id: 5, name: 'Comment'}]
const noLogData = [{id: 1, name: 'Info'}, {id: 2, name: 'catalogue'}, {id: 5, name: 'Comment'}]
const tableBar = computed(() => {
  return isLogin() && isSignUp.value ? logData : noLogData
})

// 猜你喜欢 - 静态数据
const LikeData = [
  {
    coverUrl: "http://img-qn-3.51miz.com/preview/muban/00/00/50/44/M-504460-F3103C10.jpg!/quality/90/unsharp/true/compress/true/fw/640/clip/640x500a0a0",
    duration: 444,
    icon: "sit enim sunt",
    id: 46000019721003770,
    name: "SQL - Final Tutorial!",
    price: 64540,
    sections: 45,
    sold: 234,
    teacher: "Mr. Li"
  },
]

const isCollection = ref(false);

// 当前table选项
const actId = ref(1)

// 常见问题 - 静态数据
const askData = [
  {ask:'View bought courses?', answer: 'Login in, click "learning center"'},
  {ask:'Change bought courses?', answer: 'Contact customer service'},
  {ask:'Can not login?', answer: 'Change your browser'},
  {ask:'Course exipre?', answer: 'Can\'t learn expired course. Please learn in available time.'},
]
// 课程目录
const classListData = ref([])
const baseClassTeacherData = ref([])

// mounted生命周期
onMounted(async () => {
  detailsId.value = route.query.id
  //TODO 详情、老师信息、学习进度相关信息
  //TODO 相关联的接口： 小节列表、目录、问答（我的、全部）、笔记（我的全部）
  // 获取课程信息 - 详情
  await getClassDetailsData()
  // 获取课程老师信息
  await getClassTeachersData()
  // 获取本节课的学习计划
  // await getClassPlan()
  // 获取课程目录
  await getClassListData()
  // 获取本课程的学习情况 
  if(await isLogin()){
    await getCourseLearningData()
  }

  store.setLearingDataes({
    classDetailsData:baseDetailsData.value, // 课程的信息
    teacherData:baseClassTeacherData.value, // 讲师信息
    planData: planData.value // 学习计划信息
  })
});

/** 方法定义 **/
// 获取详情数据
const getClassDetailsData = async () => {
  await getClassDetails(detailsId.value)
    .then((res) => {
      if (res.code === 200) {
        baseDetailsData.value = res.data
        if(baseDetailsData.value.coverUrl == '/img-tx/default-cover-url.jpg') {
          baseDetailsData.value.coverUrl = defaultCover
        }
      } else {
        ElMessage({
          message:res.data.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "err req!",
        type: 'error'
      });
    });
};

// 获取课程讲师详情数据
const getClassTeachersData = async () => {
  await getClassTeachers(detailsId.value)
    .then((res) => {
      if (res.code == 200) {
        // 过滤可展示项
        const data = res.data.filter(n => n.isShow);
        baseClassTeacherData.value = data
        let catchArr = []
        // 数据重组 展示幻灯片用
        data.forEach((n, i) => {
          if(catchArr.length == 0){
            catchArr.push([n])
          } else {
            const lastTag = catchArr.at(-1);
            if(lastTag.length == 2){
              catchArr.push([n])
            } else {
              lastTag.push(n)
              catchArr.push([n])
            }
          }
        })
        baseClassTeacher.value = catchArr
      } else {
        ElMessage({
          message:res.data.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "err req!",
        type: 'error'
      });
    });
};

// 获取课程目录
const getClassListData = async () => {
  await getClassList(detailsId.value)
    .then((res) => {
      if (res.code == 200) {
        classListData.value = res.data
      } else {
        ElMessage({
          message:res.data.msg,
          type: 'error'
        });
      }
    })
    .catch(() => {
      ElMessage({
        message: "req course catalogue err!",
        type: 'error'
      });
    });
};
// table切换 当前展示信息 课程介绍、课程目录
const changeTable = id => {
  actId.value = id
  switch (id) {
    case 2 : {
      break;
    } 
    case 3 : {
      break;
    } 
    case 4 : {
      break;
    } 
  }
}

//收藏
const collectionHandle = () => {
  isCollection.value = !isCollection.value
}
const isSignUp = ref(false)
// 立即报名
const signUpHandle = async () => {
  // 校验是否登录
  if(!validation()){
    return;
  }
  // 尝试报名
  await enrolledFreeCourse(detailsId.value)
  .then((res) => {
    if (res.code === 200) {
      ElMessage({
        message:'sign up success',
        type: 'success'
      });
      isSignUp.value = true
    } else {
      ElMessage({
        message:res.data.msg,
        type: 'error'
      });
    }
  })
  .catch(() => {
    ElMessage({
      message: "sign up fail. contact admin.",
      type: 'error'
    });
  });
}
// 马上学习
const goLearning = () => {
  router.push({path: '/learning', query: {id: detailsId.value}})
}

// 查询当前用户学习的指定课程信息，返回null则代表没有购买
const planData = ref()
const getCourseLearningData = async () => {
  await getCourseLearning(detailsId.value)
  .then((res) => {
    const { data } = res
    if (res.code === 200 && data) {
      isSignUp.value = true
      planData.value = data
    } else {
      isSignUp.value = false
      console.log(res.msg);
    }
  })
  .catch(() => {
    ElMessage({
      message: "query user learning info err!",
      type: 'error'
    });
  });
}
// 立即购买
const payHandle = () => {
  if(!validation()){
    return;
  }
  store.setOrderClassInfo([baseDetailsData.value])
  router.push({path: '/pay/settlement'})
}
// TODO 没有效验 松松那边没弄好 
// 未登录处理购买、加入购物车点击问题
const validation = () => {
  if ( !isLogin()) {
    ElMessageBox.confirm(
        `please login`,
        'confirm to login',
        {
          confirmButtonText: 'login to buy',
          cancelButtonText: 'keep browsing',
          type: 'warning',
        }
      )
      .then(() => {
        router.push({path:'/login'})
      })
    return false;
  }
  return true;
}

// 加入购物车
const addCarts = () => {
  if(!validation()){
    return;
  }
  putCarts({courseId: detailsId.value})
  .then((res) => {
    if (res.code === 200) {
     ElMessage({
        message:'already add to cart',
        type: 'success'
      });
    } else {
      ElMessage({
        message:res.msg,
        type: 'error'
      });
    }
  })
  .catch(() => {
    ElMessage({
      message: "req add cart err!",
      type: 'error'
    });
  });
}
</script>
<style lang="scss" src="./index.scss"> </style>
