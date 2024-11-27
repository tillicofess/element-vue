<script lang="ts" setup>
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
</script>

<template>
  <el-popover
    :width="120"
    popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 1rem;border: 1px solid #e4e7ed;"
  >
    <template #reference>
      <el-avatar :src="userStore.$state.avatarUrl" fit="fill" />
    </template>
    <template #default>
      <div
        class="demo-rich-conent"
        style="display: flex; gap: 1rem; flex-direction: column"
      >
        <div style="display: flex; align-items: end; gap: 0.5rem">
          <div>{{ userStore.$state.name }}</div>
        </div>
        <div v-show="!userStore.$state.token">
          <router-link to="/userlogin">
            <el-button type="success" style="width: 100%">Login</el-button>
          </router-link>
        </div>
        <div v-show="userStore.$state.token">
          <el-button
            @click="userStore.clearToken"
            type="success"
            style="width: 100%"
            >Exit</el-button
          >
        </div>
      </div>
    </template>
  </el-popover>
</template>

<style scoped></style>
