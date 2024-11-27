<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.push("/");
  }, 2000);
});
</script>

<style scoped></style>

<template>
  <div style="display: grid; place-items: center; height: 100vh">
    <div style="text-align: center">
      <h1 style="font-size: 4rem">404 NOT FUNED</h1>
      <p>Redirecting to home page in 2 seconds...</p>
    </div>
  </div>
</template>
