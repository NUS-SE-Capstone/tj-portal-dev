<!-- 登录页面 - 用户名密码登录 -->
<template>
  <div class="loginPass">
    <el-form
      ref="formRef"
      :model="fromData"
      :rules="rules"
      label-width="0px"
      class="demo-dynamic"
    >
      <el-form-item prop="username" label="">
        <el-input v-model="fromData.username" placeholder="Please input username" />
      </el-form-item>
      <el-form-item prop="password" label="">
        <el-input type="pass" :show-password="true" v-model="fromData.password" placeholder="please input password" />
      </el-form-item>
      <el-form-item class="marg-b-10">
        <div class="fx-sb">
            <div>
                <el-checkbox v-model="fromData.rememberMe" label="7 days login pass" size="large" />
            </div>
            <!-- <div>reset password</div> -->
        </div>
      </el-form-item>
      <el-form-item class="marg-bt-15">
        <div class="bt" @click="submitForm(formRef)">Login</div>
      </el-form-item>
    </el-form>
    <div class="font-bt text-center" @click="goRegister">
        Go Register
    </div>
  </div>
</template>
<script setup>
// 数据导入
import { reactive, ref } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { userLogins, getUserInfo } from "@/api/user"
import { useUserStore } from '@/store'
import { ElMessage } from "element-plus";

const emit = defineEmits(['goHandle'])
const store = useUserStore();
const router = useRouter()
const route = useRoute()

const formRef = ref();
const checked = ref(false)
// 登录参数效验
const fromData = reactive({
  username: "",
  password: "",
  type: 1
});
// 效验规则
const rules = reactive({
  username: [
    { required: true, message: "Please input correct username", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Please input correct password", trigger: "blur"},
  ],
});
// 登录
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      // 提交登录
      await userLogins(fromData)
			.then(async res => {
				if (res.code === 200) {
          // 用户token写入 pinia
					store.setToken(res.data);
					// 获取用户信息
          const data = await getUserInfo()
          if (data.code === 200) {
              // 记录到store 并调转到首页
              store.setUserInfo(data.data)
					    // 跳转到首页
              router.push('/main/index')
          }
				} else {
          ElMessage({
              message: res.msg,
              type: 'error'
          });
					console.log('Login failed')
				}
			})
			.catch(err => {
        ElMessage({
          message: err,
          type: 'error'
        });
      });
    } else {
      ElMessage({
          message: 'Login failed, please retry',
          type: 'error'
      });
      return false;
    }
  });
};

// 去注册
const goRegister = () => {
  emit('goHandle', 'register')
}
</script>
<style lang="scss" scoped>
.loginPass {
    margin-top: 40px;
}
</style>
