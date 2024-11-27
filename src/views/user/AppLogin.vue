<script lang="ts" setup>
import {openSuccess, openWarning} from "@/utils/notificationUtils";
import {useRouter} from "vue-router";
import {useUserData} from "@/type/types.ts";
import {userLogin} from "@/api/user.ts";

const userData = useUserData();
const router = useRouter();

const onSubmit = async () => {
  const success = await userLogin(userData, "http://49.235.164.72:3000/login");
  if (success) {
    openSuccess("Login success"); // 登录成功时打开成功提示
    await router.push("/"); // 然后跳转
  } else {
    openWarning("Login failed"); // 登录失败时打开警告提示
  }
};
</script>

<template>
  <div class="container">
    <h1 style="font-weight: 700">Login</h1>
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
        >Login
        </el-button
        >
        <router-link to="/usersignup">
          <el-button style="width: 5rem">sign</el-button>
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
