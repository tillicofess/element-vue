<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const activeIndex = ref<string>("");

const routePath = computed(() => route.path);

onMounted(() => {
  activeIndex.value = route.path;
});

watch(routePath, (newVal) => {
  activeIndex.value = newVal;
});

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

const routerJump = (path: string) => {
  router.push({ path: `/creative-center${path}` });
};
</script>

<template>
  <el-menu
    active-text-color="#1e80ff"
    background-color="#ffffff"
    class="el-menu-vertical-demo"
    :default-active="activeIndex"
    text-color="#000000"
    style="border: none"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <el-menu-item index="/creative-center" @click="routerJump('')">
      <span>首页</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <span>内容管理</span>
      </template>
      <el-menu-item
        index="/creative-center/article"
        @click="routerJump('/article')"
        >文章管理
      </el-menu-item>
      <el-menu-item
        index="/creative-center/apptable"
        @click="routerJump('/apptable')"
        >推荐管理
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped></style>
