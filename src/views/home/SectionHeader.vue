<script setup lang="ts">
import MyHeader from "@/components/header/Header.vue";
</script>

<template>
  <div>
    <MyHeader />
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss" src="@/scss/home.scss"></style>
