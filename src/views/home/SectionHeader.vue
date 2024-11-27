<script setup lang="ts">
import {useRouter} from "vue-router";
import {useRoute} from "vue-router";
import Header from "@/components/header/Header.vue";

const router = useRouter();
const route = useRoute();

const handleClick = (name: string) => {
  router.push({path: `/${name}`});
};
</script>

<template>
  <div>
    <Header/>
    <div class="container">
      <div style="display: flex; gap: 1rem">
        <span
            class="tab"
            :class="{ active: route.path === '/' }"
            @click="handleClick('')"
        >文章</span
        >
        <span
            class="tab"
            :class="{ active: route.path === '/tutorials' }"
            @click="handleClick('tutorials')"
        >教程</span
        >
        <span
            class="tab"
            :class="{ active: route.path === '/tools' }"
            @click="handleClick('tools')"
        >工具</span
        >
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped lang="scss" src="@/scss/home.scss">
</style>
