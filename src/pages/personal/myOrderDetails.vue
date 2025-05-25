<!-- 个人中心-我的订单-详情 -->
<template>
  <div class="myOrderDetailsWrapper ">
    <div class="content marg-bt-20">
      <BreadCrumb></BreadCrumb>
      <div class="label"><span>Order Detail </span>OrderId: {{ orderDetails && orderDetails.id }}</div>
      <div class="orderTit">{{ orderDetails && orderDetails.message }}</div>
      <div class="linePint">
        <div class="nodePoint" v-for="item in orderDetails && orderDetails.progressNodes" :key="item.id">
          <div class="pintTit">{{ item.name }}</div>
          <div class="circular"></div>
          <div class="time">
            <p v-for="it in item.time.split(' ')" :key="it.name">{{ it }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <CardsTitle class="marg-bt-20" title="Course"/>
      <div>
        <el-table class="table" :data="orderDetails && orderDetails.details">
          <el-table-column prop="courseName" center label="Name">
            <template #default="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Price" width="180">
            <template #default="scope">
              <div>{{ amountConversion(scope.row.price) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Pay" width="180">
            <template #default="scope">
              <div>{{ amountConversion(scope.row.realPayAmount) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="Action" align="center" width="160">
            <template #default="scope">
              <div v-if="scope.row.canRefund" class="font-bt1" @click="openRefundDialog('refund', scope.row)">Refund</div>
              <span v-else-if="!scope.row.refundStatus || scope.row.refundStatus === 3"> -- </span>
              <div v-else class="font-bt1" @click="openRefundDialog('details', scope.row)">Detail</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info">
        <div><span>TotalAmount: </span>
          <span class="pirc">$ {{ orderDetails && amountConversion(orderDetails.totalAmount) || 0 }}</span></div>
        <div class="fx">
          <span>Coupon: </span>
          <span v-if="orderDetails && orderDetails.couponRule.length" class="ruleBox">
            <span v-for="(r,i) in orderDetails.couponRule" :key="i">
            {{ r }}
            </span>
          </span>
          <span v-else class="pirc">None</span>
        </div>
        <div><span>Discount: </span><span
            class="pirc">$ {{ orderDetails && amountConversion(orderDetails.discountAmount) || 0 }}</span></div>
        <div><span>Pay: </span><span
            class="pirc red">$ {{ orderDetails && amountConversion(orderDetails.realAmount) || 0 }}</span></div>
      </div>
    </div>
    <!-- 申请退款 - start -->
    <el-dialog
        v-model="refundDialog"
        title="Apply Refund"
        width="40%"
    >
      <div class="refundCont">
        <div class="fx"><span class="lab">Reason: </span>
          <el-select v-model="refundReason" class="m-2" style="width:100%;" placeholder="please select">
            <el-option
                v-for="item in refundsOptions"
                :key="item"
                :label="item"
                :value="item"
            />
          </el-select>
        </div>
        <div class="fx">
          <span class="lab">Question:</span>
          <el-input
              v-model="questionDesc"
              rows="4"
              maxlength="200"
              placeholder="please input"
              show-word-limit
              type="textarea"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <div class="bt bt-grey" @click="refundDialog = false">Cancel</div>
          <div class="bt" type="primary" @click="refundApplyReq">Submit</div>
        </span>
      </template>
    </el-dialog>
    <!-- 申请退款 - end -->
    <!-- 退款详情 - start -->
    <el-dialog
        v-model="refundDetailsDialog"
        title="Refund Details"
        width="60%"
    >
      <div class="refundDetailsCont">
        <div class="tab">
          <div class="ut"><p class="ft-wt-600">RefundID</p>
            <p class="ft-cl-des">{{ refundDetailsData.id }}</p></div>
          <div class="ut"><p class="ft-wt-600">PayChannel</p>
            <p class="ft-cl-des">{{ refundDetailsData.payChannel || "--" }}</p></div>
          <div class="ut"><p class="ft-wt-600">RefundOrder</p>
            <p class="ft-cl-des">{{ refundDetailsData.refundOrderNo }}</p></div>
          <div class="ut"><p class="ft-wt-600">RefundChannel</p>
            <p class="ft-cl-des">{{ refundDetailsData.refundChannel }}</p></div>
          <div class="ut"><p class="ft-wt-600">OrderID</p>
            <p class="ft-cl-des">{{ refundDetailsData.orderId }}</p></div>
          <div class="ut"><p class="ft-wt-600">Reason</p>
            <p class="ft-cl-des">{{ refundDetailsData.refundReason }}</p></div>
          <div class="row">
            <div class="ft-wt-600">Time</div>
            <div class="ft-cl-des fx-wp">
              <span>Order: {{ refundDetailsData.orderTime }}</span><span>Pay: {{ refundDetailsData.paySuccessTime }}</span>
              <span>Refund: {{ refundDetailsData.createTime }}</span><span>Approve: {{ refundDetailsData.approveTime }}</span>
            </div>
          </div>
          <div class="row">
            <p class="ft-wt-600">Result: </p>
            <p class="ft-cl-des" v-if="refundDetailsData.remark != null">
              Examine: {{ refundDetailsData.remark ? 'Approve' : 'Reject' }}</p>
            <p class="ft-cl-des">Opinion: {{ refundDetailsData.approvalOpinion || 'None' }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 退款详情 - end -->
  </div>
</template>
<script setup>

/** 数据导入 **/
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {getOrderDetails, refundsApply, refundsDetails} from "@/api/order.js";
import {useRoute} from "vue-router";
import {dataCacheStore} from "@/store"
import {amountConversion} from "@/utils/tool.js"
import {ElMessageBox} from 'element-plus'

// 组件导入
import BreadCrumb from "./components/BreadCrumb.vue";
import CardsTitle from './components/CardsTitle.vue'
import router from "../../router";

const route = useRoute()
const store = dataCacheStore()
const refundOrderDetail = ref({});
// 打开退款详情弹窗
const refundDialog = ref(false)
const openRefundDialog = (val, detail) => {
  refundOrderDetail.value = detail || '';
  val === 'details' ? refundDetailsReq() : refundDialog.value = true
}

// mounted生命周期
onMounted(async () => {
  getOrderDetailsData()
});

// 申请退款
const refundsOptions = ['Technical issue', 'Coupon not used', 'Personal Reasons', 'Course not interesting', 'Other']
const questionDesc = ref('')
const refundReason = ref('')

const refundDetailsDialog = ref(false)
const refundApplyReq = () => {
  if (refundReason.value === '') {
    ElMessage({
      message: 'please select refund reason',
      type: "error",
    });
    return false
  }
  if (questionDesc.value === "") {
    ElMessage({
      message: 'please input refund question description',
      type: "error",
    });
    return false
  }
  const params = {
    orderDetailId: refundOrderDetail.value.id,
    questionDesc: questionDesc.value,
    refundReason: refundReason.value
  }
  // 上面验证通过后申请退款
  refundsApply(params)
      .then((res) => {
        if (res.code === 200) {
          refundDialog.value = false;
          ElMessage({
            message: "success",
            type: 'success'
          });
          router.push('/personal/main/myOrder')
        } else {
          ElMessage({
            message: res.msg,
            type: 'error'
          });
        }
      })
      .catch(() => {
        ElMessage({
          message: "apply refund err",
          type: 'error'
        });
      });
}
// 退款详情
const refundDetailsData = ref()
const refundDetailsReq = () => {
  refundsDetails(refundOrderDetail.value.id)
      .then((res) => {
        if (res.code === 200) {
          refundDetailsData.value = res.data
          refundDetailsDialog.value = true
        } else {
          ElMessage({
            message: res.msg,
            type: 'error'
          });
        }
      })
      .catch(() => {
        ElMessage({
          message: "req refund details err",
          type: 'error'
        });
      });
}

// 获取订单详情信息
const orderDetails = ref()
const getOrderDetailsData = async () => {
  await getOrderDetails(route.query.id)
      .then((res) => {
        if (res.code === 200) {
          res.data.couponRule = res.data.couponDesc ? res.data.couponDesc.split("/") : [];
          orderDetails.value = res.data
        } else {
          ElMessage({
            message: res.msg,
            type: 'error'
          });
        }
      })
      .catch(() => {
        ElMessage({
          message: "get order details err",
          type: 'error'
        });
      });
}

// 
</script>
<style lang="scss" src="./index.scss"></style>
<style>
.ruleBox {
  display: flex;
  flex-direction: column;
  width: 200px;
}

.ruleBox span {
  width: 200px;
  overflow: hidden;
  line-height: 20px;
  height: 20px;
  text-align: right;
}
.myOrderDetailsWrapper .info .pirc {
  width: 200px;
}
</style>
