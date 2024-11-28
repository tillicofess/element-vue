<script setup lang="ts">
import MyHeader from "@/components/header/Header.vue";
import CreativeMenu from "@/components/menu/CreativeMenu.vue";
</script>

<template>
  <div>
    <MyHeader />
    <div
      style="
        width: 1600px;
        margin-left: auto;
        margin-right: auto;
      "
    >
      <div
        style="
          background-color: #ffffff;
          width: 12rem;
          position: fixed;
          top: 4.5rem;
          bottom: 2rem;
          overflow-y: hidden;
          border: 1px solid #e2e8f0;
        "
      >
        <CreativeMenu />
      </div>
      <div style="margin-left: 13rem; margin-top: 1rem">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
