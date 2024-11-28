<script setup lang="ts">
import { ref, onBeforeMount, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { Newspaper, School, SquareScissors, Database } from "lucide-vue-next";

import Avatar from "@/components/popover/Avatar.vue";

const isMobile = ref(false); // 标记是否是移动设备

// 检测设备类型
const checkDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  isMobile.value =
    /android|iphone|ipad|ipod|blackberry|windows phone|webos/i.test(userAgent);
};

const userStore = useUserStore();
onBeforeMount(async () => {
  await userStore.fetchUser(); // 确保这个调用是异步处理的
});

onMounted(() => {
  checkDevice();
});
</script>

<template>
  <div class="header">
    <div class="container">
      <div class="content">
        <!-- logo -->
        <router-link to="/">
          <el-button size="default" text>
            <Newspaper />
          </el-button>
        </router-link>

        <!-- navigation -->
        <router-link to="/tutorials">
          <el-button size="default" text>
            <School />
          </el-button>
        </router-link>

        <!-- recommend table -->
        <router-link to="/tools">
          <el-button size="default" text>
            <SquareScissors />
          </el-button>
        </router-link>

        <!-- 后台管理 -->
        <router-link v-if="!isMobile" to="/creative-center">
          <el-button size="default" text>
            <Database />
          </el-button>
        </router-link>

        <!-- personal center -->
        <Avatar />
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background-color: #f2f3f6;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  /* border-bottom: 1px solid #e2e8f0; */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  max-width: 1200px;
  margin: auto;
  height: 2.5rem;
}

.content {
  display: flex;
  gap: 2px;
  align-items: center;
}

.header-text {
  color: #515767;
  font-size: 14px;
  font-weight: 600;
}

.header-text:hover {
  color: #000;
}

.my-shadow {
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3),
    -4px -4px 8px rgba(255, 255, 255, 0.7) !important;
}
</style>
