<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { Card } from "@/type/types.ts";
import { fetchMoreArticles } from "@/api/articles.ts";

const router = useRouter();
const loading = ref(true); // 用于控制数据加载动画
const bottomLoading = ref(false); // 用于控制底部加载动画
const tableData = ref<Card[]>([]); // 用于存储文章数据
const page = ref(1); // 当前页码
const limit = ref(20); // 每页显示条目数
const hasMore = ref(true); // 是否有更多数据

// 页面加载后，获取文章数据
onMounted(async () => {
  await loadData();
  setupIntersectionObserver();
});

onUnmounted(() => {
  observer.disconnect();
});

// 加载数据的通用函数
const loadData = async () => {
  setLoading(true);
  const data = await fetchMoreArticles(page.value, limit.value);

  tableData.value = [...tableData.value, ...data];
  hasMore.value = data.length >= limit.value;
  setLoading(false);
  await nextTick(); // 确保 DOM 更新
  setupIntersectionObserver();
};

// 设置加载状态
const setLoading = (isLoading: boolean) => {
  if (page.value === 1) {
    loading.value = isLoading;
  } else {
    bottomLoading.value = isLoading;
  }
};

// 文章详情页跳转
const openCardUrl = (id: number) => {
  router.push({
    path: `/articles/${id}`,
  });
};

//  Intersection Observer API 检测底部是否有更多数据
const observer = new IntersectionObserver((entries) => {
  // 如果底部的元素进入可视区域，并且还有更多数据，则加载更多数据
  if (entries[0].isIntersecting && hasMore.value) {
    page.value++;
    setTimeout(() => {
      loadData();
    }, 500);
  }
});

// 设置 Intersection Observer
const setupIntersectionObserver = () => {
  const target = document.querySelector(".grid-content:last-child");
  if (target) {
    observer.observe(target);
  } else {
    console.warn("No target element found for Intersection Observer");
  }
};
</script>

<template>
  <div class="grid-display">
    <el-card
      v-if="!loading"
      v-for="card in tableData"
      :key="card.id"
      class="grid-content"
      @click="openCardUrl(card.id)"
    >
      <p style="line-height: 1.5rem; font-weight: 600" class="line-clamp-1">
        {{ card.title }}
      </p>
      <div style="display: flex; justify-content: space-between">
        <p
          style="line-height: 1.5rem; font-size: 0.9rem; color: #86909c"
          class="line-clamp-1"
        >
          {{ card.name }}
        </p>
        <p
          style="line-height: 1.5rem; font-size: 0.8rem; color: #86909c"
          class="line-clamp-1"
        >
          {{ card.created_at }}
        </p>
      </div>
    </el-card>
    <el-skeleton v-else :rows="5" style="padding: 1rem 0" animated />
    <el-skeleton
      v-if="bottomLoading"
      :rows="3"
      style="padding: 1rem 0"
      animated
    />
  </div>
</template>

<style scoped lang="scss" src="@/scss/home.scss"></style>
