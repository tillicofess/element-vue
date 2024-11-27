<script setup lang="ts">
import {ref, onMounted, computed, watch} from "vue";
import {fetchArticleNum} from "@/api/articles.ts";
import {useUserStore} from "@/stores/userStore";

const userStore = useUserStore();                              // 引入userStore
const loading = ref<boolean>(true);                      // 加载状态
const name = ref<string>("");                            // 用户名
const articlesNum = ref<number>(0);                      // 文章数量
const userInfo = computed(() => userStore.$state.isUserInfoSet);    // 是否完成用户信息获取
const loginState = computed(() => userStore.$state.isLoggedIn);     // 用户登录状态

// 获取用户信息
onMounted(async () => {
  if (userInfo.value) {
    if (loginState.value) {
      await fetchArticlesNum()
    }
  } else {
    const stop = watch(userInfo, async (newVal) => {
      if (newVal && loginState.value) {
        await fetchArticlesNum();
      }
      stop();
    });
  }
  name.value = userStore.$state.name;
  loading.value = false;
});


// 获取文章数据的封装函数
async function fetchArticlesNum() {
  loading.value = true; // 开始加载
  articlesNum.value = await fetchArticleNum(userStore.$state.email);
  loading.value = false; // 加载完成
}
</script>

<template>
  <!-- 头部 -->
  <div class="container header">
    <div style="display: flex; gap: 1rem">
      <el-avatar
          :src="userStore.$state.avatarUrl"
          fit="cover"
          shape="circle"
          :size="80"
      />
      <h3>用户名：{{ userStore.$state.name }}</h3>
    </div>
  </div>

  <!-- 文章数量 -->
  <div class="container content">
    <div class="card">
      <el-skeleton :rows="1" style="height: 5rem" v-if="loading" animated/>
      <div v-else>
        <p style="line-height: 1.5rem; margin-bottom: 1rem">文章数量</p>
        <p style="font-size: 2rem; font-weight: 700; line-height: 2.5rem">
          {{ articlesNum }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  background-color: #ffffff;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
}

.container.header {
  height: 10rem;
}

.container.content {
  min-height: 16rem;
}

.card {
  padding: 1.5rem;
  background-color: #f2f3f6;
  width: 10rem;
}
</style>
