<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { Card_detail } from "@/type/types.ts";
import { fetchArticleData, fetchArticleNum } from "@/api/articles.ts";
import { useEditorSetup } from "@/hooks/useEditorSetup.ts";
import { EditorContent } from "@tiptap/vue-3";

const editor = useEditorSetup('', false);
const route = useRoute();
const loading = ref(true);
const article = ref<Card_detail | null>(null);
const articleNum = ref<number>(0); // 文章数量

onMounted(async () => {
  await defineData();
  if (editor.value) {
    editor.value.commands.setContent(article.value?.content || "");
  }
  loading.value = false;
});

// 在组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

// 获取文章数据
const defineData = async () => {
  const id = String(route.params.id);
  article.value = await fetchArticleData(id);
  article.value.avatar_url = `https://${article.value.avatar_url}`;
  articleNum.value = await fetchArticleNum(article.value.email);
};
</script>

<template>
  <Header />
  <div class="container">
    <!-- 文章主体 -->
    <el-skeleton v-if="loading" :rows="2" style="padding: 1rem 0" animated />
    <div v-else>
      <h1>{{ article?.title }}</h1>
      <div class="article-author">
        <img :src="article?.avatar_url" class="img-avatar">
        <p>
          {{ article?.name }} | {{ article?.created_at }}
        </p>
      </div>
      <EditorContent :editor="editor"></EditorContent>
    </div>

    <!-- 侧边栏 -->
    <!-- <div class="article article-aside">
      <div style="display: flex; justify-content: space-between">
        <div
            style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <p style="font-size: 1.2rem">
            {{ article?.name }}
          </p>
          <p>文章：{{ articleNum }}</p>
        </div>
        <img
            :src="article?.avatar_url"
            alt="avatar"
            style="width: 3.5rem; height: 3.5rem; border-radius: 50%"
        />
      </div>
    </div> -->
  </div>
</template>

<style scoped lang="scss" src="@/scss/home.scss"></style>

<style scoped>
.article-author {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.article-detail :deep(p) {
  margin-bottom: 1rem;
}

.article-detail :deep(img) {
  max-width: 100%;
}

.article-detail :deep(ol) {
  padding-left: 20px;
}

.img-avatar {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%
}
</style>
