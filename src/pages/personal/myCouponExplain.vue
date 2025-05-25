<!-- 我的优化券 - 使用说明 -->
<template>
  <div class="couponWrapperExplain">
    <div class="personalCards">
        <BreadCrumb></BreadCrumb>
        <div class="title">Coupon Intructions</div>
        <div class="cont">
          <p class="tit">1.How to get</p>
          <p>Talent Jet will periodically launch course promotions.</p>
          <p class="tit">2.How to use</p>
          <p>On course page, click "Buy Now" and select the coupon on payment page, then "price" will change.</p>
          <p class="tit">3.If a coupon's value is greater than the course price?</p>
          <p>Can't use this coupon.</p>
          <p class="tit">4.How many coupons can a user get?</p>
          <p>Each person can get multiple coupons, but for one course, each user can only receive one coupon.</p>
        </div>
    </div>
  </div>
</template>
<script setup>

/** 数据导入 **/
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { getMyCoupon } from "@/api/class.js";
import { useRoute } from "vue-router";
import { dataCacheStore } from "@/store"

// 组件导入
import BreadCrumb from './components/BreadCrumb.vue'

const route = useRoute()
const store = dataCacheStore()

const tableBar = [
  {id: 1, name: 'unused'}, 
  {id: 2, name: 'used'}, 
  {id: 3, name: 'expired'},
]

// tab切换
const actId = ref(1)
const changeTable = id => {
  actId.value = id
  getMyCouponData()
}

// mounted生命周期
onMounted(async () => {
 getMyCouponData()
});

/** 方法定义 **/
// 我的优惠券数据获取
const myCoupon = ref([])
const getMyCouponData =  async () => {
  const params = {
    status: actId.value,
    pageNo: 1,
    pageSize:1000
  }
  await getMyCoupon(params)
    .then((res) => {
      if (res.code == 200 ){
        myCoupon.value = res.data.list
      } else {
        ElMessage({
        message: res.msg,
        type: 'error'
      });
      }
    })
    .catch(() => {
      ElMessage({
        message: "get my couponData error",
        type: 'error'
      });
    });
}

</script>
<style lang="scss" src="./index.scss"> </style>
