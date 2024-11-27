<script lang="ts" setup>
import {openSuccess, openWarning} from "@/utils/notificationUtils";
import {useUserData} from "@/type/types.ts";
import {userSignup} from "@/api/user.ts";

const userData = useUserData();

// 处理注册逻辑
const onSubmit = async () => {
  const success = await userSignup(userData, "http://49.235.164.72:3000/register")
  if (success) {
    openSuccess("Sign up successfully")
  } else {
    openWarning("Sign up failed")
  }
};
</script>

<template>
  <div class="container">
    <h1 style="font-weight: 700">Sign Up</h1>
    <el-form
        :model="userData"
        label-width="auto"
        label-position="top"
        style="max-width: 600px"
    >
      <p style="margin-bottom: 0.5rem; font-weight: 600">Email</p>
      <el-form-item>
        <el-input
            v-model="userData.email"
            clearable
            size="large"
            placeholder="Please input email"
            style="width: 300px"
        />
      </el-form-item>
      <p style="margin-bottom: 0.5rem; font-weight: 600">Password</p>
      <el-form-item>
        <el-input
            v-model="userData.password"
            type="password"
            show-password
            size="large"
            placeholder="Please input password"
            style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
            type="primary"
            @click="onSubmit"
            style="width: 5rem; margin-right: 0.5rem"
        >Sign up
        </el-button
        >
        <router-link to="/userlogin">
          <el-button style="width: 5rem">login</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
