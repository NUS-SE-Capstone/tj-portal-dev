<!-- 个人设置 -->
<template>
  <div class="mySetWrapper content">
    <CardsTitle class="marg-bt-40" title="Personal Settings" />
    <TableSwitchBar :data="tabData" @changeTable="checkHandle"></TableSwitchBar>  
    <div v-if="act == 0" class="fx-sb pd-tp-30">
      <div>
        <div class="fx">
          <!-- 一期先不加  放到二期 -->
          <!-- <div class="item fx">
            <span class="lab">账号：</span><el-input v-model="input" placeholder="please input"></el-input>
          </div> -->
          <div class="item fx">
            <span class="lab">Name</span> <el-input v-model="user.name" placeholder="please input"></el-input>
          </div>
        </div>
        <div class="item fx">
          <span class="lab">Gender</span>
          <el-radio-group class="radioGroup" v-model="user.gender">
            <el-radio :label="0">Male</el-radio>
            <el-radio :label="1">Female</el-radio>
          </el-radio-group>
        </div>
        <div class="item fx">
          <div class="bt" @click="updateUserInfoHandle">Update Info</div>
        </div>
      </div>
      <div>
        <el-upload
          class="avatar-uploader"
          :action="actions"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :headers="uploadHeaders"
          >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="uploadBut"><span>Upload Avatar</span></div>
        </el-upload>
      </div>
    </div>
    <div v-else class="set pd-tp-30">
      <div class="line fx-sb"><div><span>Password</span> </div><span class="font-bt" @click="changeHandle">update</span></div>
      <div class="line fx-sb"><div><span>CellPhone</span> {{ user.cellPhone }}</div><span class="font-bt" @click="changeHandle">update</span></div>
      <div class="line fx-sb"><div><span>Email</span> {{ user.email ?? 'null' }}</div><span class="font-bt" @click="changeHandle">update</span></div>
    </div>
  </div>
</template>
<script setup>

/** 数据导入 **/
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { updateUserInfo, getUserInfo } from "@/api/user.js";
import { useUserStore } from "@/store"
import proxy from '@/config/proxy';


// 组件导入
import CardsTitle from "./components/CardsTitle.vue";
import TableSwitchBar from "@/components/TableSwitchBar.vue";
import router from "../../router";

const store = useUserStore()
const userInfo = ref(store.getUserInfo)



const env = import.meta.env.MODE || "development"
const actions = proxy[env].host+'/ms/files'
const uploadHeaders = {authorization: store.getToken}
const tabData = [
  {id: 0, name: 'Basic'},
  {id: 1, name: 'Security'}
]
// 切换基本信息和安全设置
const act = ref(0)
const checkHandle = val => {
  act.value = val
}
// 更新信息的参数
const user = reactive({
  name: userInfo.value.name,
  icon: userInfo.value.icon,
  gender: userInfo.value.gender || 0,
  cellPhone: userInfo.value.cellPhone,
})
// 图片上传
const imageUrl = ref(user.icon)
function handleAvatarSuccess(res, file) {
  if (res.code == 200) {
    imageUrl.value = URL.createObjectURL(file.raw);
    user.icon = res.data.path
  } else {
    ElMessage({
      message: '图片上传出错，请联系管理员',
      type: 'error'
    })
  }
}

// 更改密码 手机号
const changeHandle = () => {
  ElMessage({
    message: '功能暂未实现, 请耐心等待！',
  })
}

// 提交更新信息
const updateUserInfoHandle = async () => {
  await updateUserInfo(user)
    .then(async (res) => {
      if (res.code == 200) {
        // 从新获取当前登录用户的信息
        const data = await getUserInfo()
        if (data.code == 200) {
            // 记录到store
            store.setUserInfo(data.data)
            userInfo.value = data.data
            router.go(0)
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
        message: "请求出错！",
        type: 'error'
      });
    });
};
</script>
<style lang="scss" src="./index.scss"> </style>


