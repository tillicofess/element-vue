<script setup lang="ts">
import Avatar from "../popover/Avatar.vue";
</script>

<template>
  <div class="header">
    <div class="container">
      <div class="content">
        <!-- logo -->
        <router-link to="/">
          <el-button size="default" text>
            <span class="header-text">首页</span>
          </el-button>
        </router-link>

        <!-- navigation -->
        <router-link to="/creative-center/home">
          <el-button size="default" text>
            <span class="header-text">创作中心</span>
          </el-button>
        </router-link>

        <!-- recommend table -->
        <router-link to="/apptable">
          <el-button size="default" text>
            <span class="header-text">推荐表格</span>
          </el-button>
        </router-link>

        <!-- personal center -->
        <router-link to="/settings">
          <el-button size="default" text>
            <span class="header-text">个人中心</span>
          </el-button>
        </router-link>
      </div>

      <!-- avatar -->
      <div class="content">
        <Avatar/>
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
