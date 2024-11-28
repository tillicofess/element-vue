<script setup lang="ts">
import MyHeader from "@/components/header/Header.vue";
import { ref, onMounted, watch, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { openSuccess, openWarning } from "@/utils/notificationUtils";
import { updateUserAvatar, updateUserName } from "@/api/user";
import "cropperjs";
import type CropperSelection from "@cropper/element-selection";

const userStore = useUserStore(); // 引入userStore
const username = ref<string>(""); // 用户名
const loading = ref<boolean>(true); // 加载状态
const isAvatarLoading = ref<boolean>(false); // 按钮加载状态
const isPersonLoading = ref<boolean>(false); // 按钮加载状态
const fileInput = ref<HTMLInputElement | null>(null); // 文件输框
const selectedFile = ref<File | null>(null); // 选择的文件
const img = ref<string | undefined>(undefined); // 图片元素
const Selection = ref<CropperSelection | null>(null); // 裁剪框
const userInfo = computed(() => userStore.$state.isUserInfoSet); // 是否完成用户信息获取
const loginState = computed(() => userStore.$state.isLoggedIn); // 用户登录状态

// 获取用户信息
onMounted(() => {
  if (userInfo.value) {
    if (loginState.value) {
      username.value = userStore.$state.name;
    }
  } else {
    const stop = watch(userInfo, async (newVal) => {
      if (newVal && loginState.value) {
        username.value = userStore.$state.name;
      }
      stop();
    });
  }
  username.value = userStore.$state.name;
  loading.value = false;
});

// 触发文件输入框
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 文件输入框上传图片
const handleFileChange = (event: any) => {
  const input = event.target as HTMLInputElement;
  if (!(input.files && input.files.length > 0)) {
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(input.files[0]);
  reader.onload = (e) => {
    img.value = e.target?.result as string;
  };
};

// 获得裁剪框的预览图片
const getSelectFile = async () => {
  const cvs = await Selection.value?.$toCanvas({ width: 1600, height: 1600 });
  const ctx = cvs?.getContext("2d");
  if (ctx && cvs) {
    return new Promise<void>((resolve, reject) => {
      cvs.toBlob((blob) => {
        if (blob) {
          selectedFile.value = new File([blob], "avatar.png", {
            type: "image/png",
          });
          resolve(); // 解析 Promise
        } else {
          reject(new Error("Failed to create blob"));
        }
      });
    });
  }
};

// 用户头像更新
const handleAvatarUpdate = async () => {
  try {
    isAvatarLoading.value = true;
    await getSelectFile();
    if (!selectedFile.value) {
      openWarning("请先选择头像");
      return;
    }
    const response = await updateUserAvatar(
      selectedFile.value!,
      "http://49.235.164.72:3000/update-avatar"
    );
    isAvatarLoading.value = false;
    if (response === 1) {
      openSuccess("更新头像成功");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      openWarning("更新头像失败，请稍后再试");
    }
  } catch (error) {
    console.error("头像更新出错:", error); // 输出错误信息以便调试
    openWarning("更新头像失败，请稍后再试");
  } finally {
    isAvatarLoading.value = false; // 确保在所有情况下都能恢复loading状态
  }
};

// 用户名更新
const handleProfileUpdate = async () => {
  try {
    isPersonLoading.value = true;
    if (!username.value) {
      alert("用户名不能为空");
      return;
    }
    const response = await updateUserName(
      username.value,
      "http://49.235.164.72:3000/update-profile"
    );
    if (response === 1) {
      openSuccess("更新个人信息成功");
    } else {
      openWarning("更新个人信息失败，请稍后再试");
    }
  } catch (error) {
    console.error("头像更新出错:", error); // 输出错误信息以便调试
    openWarning("更新头像失败，请稍后再试");
  } finally {
    isPersonLoading.value = false; // 确保在所有情况下都能恢复loading状态
  }
};
</script>

<template>
  <div>
    <MyHeader />
    <div class="container">
      <div class="user-content">
        <h3>头像管理</h3>

        <!-- 用户头像展示与上传 -->
        <div class="canvas-container">
          <!-- 模态框 -->
          <el-skeleton style="width: 160px" v-if="loading">
            <template #template>
              <el-skeleton-item
                variant="image"
                style="
                  width: 160px;
                  height: 160px;
                  border: 1px solid rgb(228, 231, 237);
                "
              />
            </template>
          </el-skeleton>

          <!-- 默认头像显示 -->
          <el-avatar
            v-else-if="!img"
            shape="square"
            :src="userStore.$state.avatarUrl"
            :size="160"
            fit="contain"
            style="border: 1px solid #e4e7ed; border-radius: 0.5rem"
          />

          <!-- 已有头像显示 -->
          <cropper-canvas background style="height: 160px; width: 160px" v-else>
            <cropper-image
              :src="img"
              alt="Picture"
              rotatable
              scalable
              skewable
              translatable
            ></cropper-image>
            <cropper-shade hidden></cropper-shade>
            <cropper-handle action="select" plain></cropper-handle>
            <cropper-selection
              ref="Selection"
              initial-coverage="0.5"
              movable
              resizable
              :aspectRatio="1"
              id="cropperSelection1"
            >
              <cropper-grid role="grid" covered></cropper-grid>
              <cropper-crosshair centered></cropper-crosshair>
              <cropper-handle
                action="move"
                theme-color="rgba(255, 255, 255, 0.35)"
              ></cropper-handle>
              <cropper-handle action="n-resize"></cropper-handle>
              <cropper-handle action="e-resize"></cropper-handle>
              <cropper-handle action="s-resize"></cropper-handle>
              <cropper-handle action="w-resize"></cropper-handle>
              <cropper-handle action="ne-resize"></cropper-handle>
              <cropper-handle action="nw-resize"></cropper-handle>
              <cropper-handle action="se-resize"></cropper-handle>
              <cropper-handle action="sw-resize"></cropper-handle>
            </cropper-selection>
          </cropper-canvas>

          <!-- 裁剪框 -->
          <div class="cropper-viewers" v-if="img">
            <cropper-viewer
              selection="#cropperSelection1"
              style="width: 160px; border-radius: 50%"
            ></cropper-viewer>
          </div>
        </div>

        <!-- 上传头像按钮 -->
        <div style="display: flex; gap: 0.5rem; margin: auto">
          <!-- 隐藏的文件输入框用于头像上传 -->
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            style="display: none"
            accept="image/*"
          />
          <el-button
            type="info"
            @click="handleAvatarUpdate"
            v-if="!isAvatarLoading"
            >上传
          </el-button>
          <!-- 数据加载时的加载按钮 -->
          <el-button type="primary" loading v-else>Loading</el-button>

          <!-- 触发文件输入的按钮 -->
          <el-button
            type="primary"
            @click="triggerFileInput"
            style="margin-left: 0"
            >更换头像
          </el-button>
        </div>
      </div>

      <!-- 个人信息 -->
      <div class="user-content">
        <h3>信息管理</h3>

        <!-- 用户名输入框 -->
        <p style="font-weight: 600">用户名:</p>
        <el-input v-model="username" style="width: 240px" />

        <!-- 更新个人信息按钮 -->
        <el-button
          type="primary"
          @click="handleProfileUpdate"
          v-if="!isPersonLoading"
        >
          更新个人信息
        </el-button>

        <!-- 数据加载时的加载按钮 -->
        <el-button type="primary" loading v-else>Loading</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  max-width: 672px;
  margin: auto;
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}

.user-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e4e7ed;
  background-color: #fff;
  margin-bottom: 1rem;
}

.canvas-container {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 1rem;
}
</style>
