<!-- 404页面 -->
<template>
<div class="noPage container fx-ct bg-wt">
  <result title="404 Not Found" tip="Sorry, the page doesn't exist" type="404">
    <span class="bt" @click="() => $router.push('/')">Back to Main Page</span>
  </result>
</div>
  
</template>

<script>
export default {
  name: 'Result404',
};
</script>

<script setup >
import Result from '@/components/result/index.vue';
</script>
<style>
.noPage{
  margin: 30px auto 40px auto;
  border-radius: 8px;
  line-height: 40px;
  text-align: center;
}
</style>
