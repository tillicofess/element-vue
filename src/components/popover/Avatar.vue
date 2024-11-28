<script lang="ts" setup>
import { useUserStore } from "@/stores/userStore";
import { CircleUser } from "lucide-vue-next";

const userStore = useUserStore();
</script>

<template>
  <el-popover
    :width="120"
    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 1rem;border: 1px solid #e4e7ed;"
  >
    <template #reference>
      <el-button size="default" text>
        <CircleUser />
      </el-button>
    </template>
    <template #default>
      <div
        class="demo-rich-conent"
        style="display: flex; gap: 1rem; flex-direction: column"
      >
        <div style="display: flex; align-items: end; gap: 0.5rem">
          <div>{{ userStore.$state.name }}</div>
        </div>
        <div>
          <router-link to="/settings">
            <el-button type="success" style="width: 100%">个人中心</el-button>
          </router-link>
        </div>
        <div v-show="!userStore.$state.token">
          <router-link to="/userlogin">
            <el-button type="success" style="width: 100%">登录/注册</el-button>
          </router-link>
        </div>
        <div v-show="userStore.$state.token">
          <el-button
            @click="userStore.clearToken"
            type="success"
            style="width: 100%"
            >退出登录</el-button
          >
        </div>
      </div>
    </template>
  </el-popover>
</template>

<style scoped>
.header-text {
  color: #515767;
  font-size: 14px;
  font-weight: 600;
}
</style>
