<!-- 我的优化券 -->
<template>
  <div class="couponWrapper">
    <div class="personalCards">
      <div class="headTop fx-sb">
        <CardsTitle class="marg-bt-20" title="MyCoupon"/>
        <div class="fx">
          <span class="font-bt ft-14" @click="() => dialogVisible = true">Redeem&gt;</span>
          <span @click="() => $router.push({path: '/personal/main/myCouponExplain'})"
                class="font-bt ft-14">Coupon Intructions&gt;</span>
        </div>
      </div>
      <div>
        <TableSwitchBar :data="tableBar" @changeTable="changeTable"></TableSwitchBar>
      </div>
      <div class="myCouponItems">
        <CouponCards v-if="myCoupon.length > 0" :data="myCoupon" :type="actId"></CouponCards>
        <div v-else class="nodata">
          <Empty></Empty>
        </div>
      </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="Redeem"
        width="30%"
    >
      <div class="exchangeCoupon fx"><span>Code</span>
        <el-input type="text" v-model="inputVal" placeholder="please input"/>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="bt bt-grey" @click="dialogVisible = false">Cancel</div>
          <div class="bt" type="primary" @click="exchangeCouponHandle">Redeem</div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>

/** 数据导入 **/
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {getMyCoupon, exchangeCoupon, formatRule} from "@/api/class.js";
import {useRoute} from "vue-router";
import {dataCacheStore} from "@/store"

// 组件导入
import CardsTitle from "./components/CardsTitle.vue";
import TableSwitchBar from "./components/TableSwitch.vue";
import CouponCards from "@/components/CouponCards.vue";
import Empty from "@/components/Empty.vue";

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
const getMyCouponData = async () => {
  const params = {
    status: actId.value,
    pageNo: 1,
    pageSize: 1000
  }
  await getMyCoupon(params)
      .then((res) => {
        if (res.code == 200) {
          res.data.list.forEach(d => d.rule = formatRule(d));
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
          message: "get my coupon err",
          type: 'error'
        });
      });
}

// 兑换优惠券
const dialogVisible = ref(false)
const inputVal = ref('')

const exchangeCouponHandle = async () => {
  if (inputVal.value == "") {
    ElMessage({message: 'please input correct coupon code'});
    return false
  }
  const params = {code: inputVal.value}
  // TODO 接口404
  await exchangeCoupon(params)
      .then((res) => {
        if (res.code == 200) {
          ElMessage({
            message: 'success',
            type: 'success'
          });
          dialogVisible.value = false
          getMyCouponData();
        } else {
          ElMessage({
            message: res.msg,
            type: 'error'
          });
        }
      })
      .catch(() => {
        ElMessage({
          message: "redeem coupon err",
          type: 'error'
        });
      });
}

</script>
<style lang="scss" src="./index.scss"></style>
