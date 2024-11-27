<script setup lang="ts">
import {onMounted} from "vue";
import {useUserStore} from "@/stores/userStore";

const userStore = useUserStore();
onMounted(async () => {
  await userStore.fetchUser();  // 确保这个调用是异步处理的
});
</script>

<template>
  <router-view></router-view>
</template>
