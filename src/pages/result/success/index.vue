<!-- 发布成功页面 -->
<template>
  <div class="success container bg-wt fx-fd-col fx-ct">
    <IconSuccess></IconSuccess>
    <div class="title">Upload Success!</div>
    <div class="ft-14 marg-bt-20 ft-cl-des">
      Please wait, there must be many classmates willing to answer!
    </div>
    <div @click="() => $router.go(-2)" class="ask bt ft-14">View my courses</div>
  </div>
</template>

<script setup>
import IconSuccess from "@/assets/icon_success.svg";
</script>
<style lang="scss">
.success {
  margin: 30px auto 40px auto;
  border-radius: 8px;
  .title {
    font-weight: 600;
    font-size: 24px;
    margin: 20px 20px 10px 20px;
  }
  .ask {
    width: 122px;
    height: 36px;
    line-height: 36px;
  }
}
</style>
