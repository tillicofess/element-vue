<script setup lang="ts">
import {onMounted} from "vue";
import {useCardsStore} from "@/stores/cardsStore";

const cardsStore = useCardsStore();

onMounted(() => {
  cardsStore.fetchCards("tools");
});

// 动态路由跳转
const openCardUrl = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <div class="grid-display">
    <el-card
        v-for="card in cardsStore.cards"
        :key="card.id"
        class="grid-content"
        @click="openCardUrl(card.url)"
    >
      <div style="display: flex; align-items: center">
        <img :src="card.img_url" class="content-img"/>
        <div style="padding-left: 1.5rem">
          <h3>{{ card.title }}</h3>
          <p class="line-clamp-1">{{ card.description }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss" src="@/scss/home.scss">
// @import "@/scss/home.scss";
</style>
