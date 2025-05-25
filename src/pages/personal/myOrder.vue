<!-- 个人中心-我的订单 -->
<template>
  <div class="myOrderWrapper content">
    <CardsTitle class="marg-bt-20" title="MyOrder" />
    <TableSwitchBar :data="tableBar" @changeTable="changeTable"></TableSwitchBar>
    <div class="table" >
      <div class="tabHead">
        <span class="fx-1 alignLeft">Course</span><span>Price</span><span>Pay</span><span>Status</span><span>Action</span>
      </div>
      <div class="marg-bt-20" v-for="(item, index) in orderListData" :key="index">
        <div class="tabInfo">
          <div><span class="time alignLeft">{{item.createTime}}</span>OrderId: {{item.id}}</div>
        </div>
        <div class="tabCont">
          <div class="orderList">
            <div class="fx-1 alignLeft" >
              <OrderCards :data="it" v-for="it in item.details"></OrderCards>
            </div>
            <span>{{amountConversion(item.totalAmount)}}</span><span>{{amountConversion(item.realAmount)}}</span><span>{{orderStatus(item)}}</span>
            <span class="btCont">
              <span class="bt" v-if="isOrderPay(item)">Comment</span>
              <span @click="() => $router.push({path: 'myOrderDetails',query: {id:item.id}})" class="bt bt-grey1">View</span>
              <span v-if="item.status == 1 " @click="cancelOrderHandle(item)" class="bt bt-grey">Cancel</span>
              <span v-if="item.status == 1 " @click="() => $router.push({path: '/pay/payment',query: {orderId:item.id}})" class="bt">Pay</span>
              <span v-if="item.status == 3 || item.status == 5"  @click="delOrderHandle(item)" class="bt bt-grey1">Delete</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="pageination" v-show="count > 0">
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
</template>
<script setup>

/** 数据导入 **/
import { onMounted, ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getOrderListes, cancelOrder, delOrder } from "@/api/order.js";
import { useRoute } from "vue-router";
import { dataCacheStore } from "@/store"
import {amountConversion} from "@/utils/tool.js"
import { ElMessageBox } from 'element-plus'

// 组件导入
import CardsTitle from './components/CardsTitle.vue'
import TableSwitchBar from "./components/TableSwitch.vue";
import OrderCards from "./components/OrderCards.vue";


const route = useRoute()
const store = dataCacheStore()

const tableBar = [
  {id: 0, name: 'All'},
  {id: 1, name: 'Paying'},
  {id: 2, name: 'Paid'},
  {id: 3, name: 'Closed'},
  {id: 4, name: 'Finished'},
  {id: 5, name: 'SignedUp'},
  {id: 6, name: 'Refunded'},
]

// tab切换
const actId = ref(0)
const changeTable = id => {
  actId.value = id
  params.status = actId.value === 0 ? undefined : actId.value
  getOrderListesData()
}
// 分页
const count = ref(0)
const params = reactive({
  status: actId.value === 0 ? undefined : actId.value, // 订单状态：1：待支付，2：已支付，3：已关闭，4：已完成，5：已报名
  // refundStatus: 1, // 退款状态1：待审批，2：取消退款，3：同意退款，4：拒绝退款，5：退款成功，6：退款失败
  pageNo: 1,
  pageSize: 10,
})

const handleSizeChange = (val) => {
  params.pageSize = val
  getOrderListesData()
}

const handleCurrentChange = (val) => {
  params.pageNo = val
  getOrderListesData()
}

// mounted生命周期
onMounted(async () => {
  getOrderListesData()
});

/** 方法定义 **/
// 获取订单列表
const orderListData = ref()
const getOrderListesData =  async () => {
  await getOrderListes(params)
    .then((res) => {
      if (res.code === 200 ){
        orderListData.value = res.data.list
        count.value = Number(res.data.total)
      } else {
        ElMessage({
        message: res.msg,
        type: 'error'
      });
      }
    })
    .catch(() => {
      ElMessage({
        message: "get order list err",
        type: 'error'
      });
    });
}
function isOrderPay(item){
  let status = item.status;
  return status === 2 || status === 4 || status === 5;
}
// 订单状态1：待支付，2：已支付，3：已关闭，4：已完成，5：已报名
function orderStatus(item) {
  let data = ''
  switch(item.status){
    case 1: {
      data = 'Paying'
      break
    }
    case 2: {
      data = 'Paid'
      break
    }
    case 3: {
      data = 'Closed'
      break
    }
    case 4: {
      data = 'Finished'
      break
    }
    case 5: {
      data = 'SignedUp'
      break
    }
    case 6: {
      let i = item.details.findIndex(d => d.refundStatus === 5);
      data = i !== -1 ? 'Refunded' : "Refunding"
      break
    }
  }
  return data
}
// 取消订单
const cancelOrderHandle = async (item) => {
  ElMessageBox.confirm(
        `Confirm to cancel the order?`,
        'Cancel Order',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'delete',
        }
      )
        .then(() => {
          cancelOrderAction(item)
        })
        .catch(() => {
        })
}
// 取消订单
const cancelOrderAction = async (item) => {
  await cancelOrder(item.id)
    .then((res) => {
      if (res.code === 200 ){
        item.status = 3
      } else {
        ElMessage({
        message: res.msg,
        type: 'error'
      });
      }
    })
    .catch(() => {
      ElMessage({
        message: "cancel order err",
        type: 'error'
      });
    });
}
// 删除确认
const delOrderHandle = async (item) => {
  ElMessageBox.confirm(
        `Confirm to delete the order?`,
        'Confirm Delete',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'delete',
        }
      )
        .then(() => {
          delOrderAction(item)
        })
        .catch(() => {
          ElMessage({
            message: "cancel delete",
            type: 'info'
          });
        })
}

// 删除订单
const delOrderAction = async (item) => {
  await delOrder(item.id)
    .then((res) => {
      if (res.code === 200 ){
        getOrderListesData()
        ElMessage({
          message: 'success',
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
        message: "del order err",
        type: 'error'
      });
    });
}
</script>
<style lang="scss" src="./index.scss"> </style>
