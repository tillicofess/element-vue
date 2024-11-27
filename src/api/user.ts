import axios from "axios";
import {useUserStore} from "@/stores/userStore";
import {useUserData} from "@/type/types.ts";

const userData = useUserData();

const userStore = useUserStore(); // 引入userStore

/**
 * 上传用户头像
 * @param file - 要上传的图片文件
 * @param url - 上传的接口地址
 * @returns 成功返回 1，失败返回 0
 */
export const updateUserAvatar = async (file: File, url: string): Promise<number> => {
    if (!userStore.$state.email) {
        alert("请先登录");
        return 0;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", userStore.$state.email);
    try {
        const res = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userStore.token}`,
            },
        });
        const Url: string = "https://" + res.data.cosData;
        userStore.setUser(undefined, undefined, undefined, Url);
        return 1;         // 成功时返回1
    } catch (err) {
        console.error(err);
        return 0;         // 失败时返回0
    }
}

/**
 * 更新用户名
 * @param name - 新的用户名
 * @param url - 更新用户名的接口地址
 * @returns 成功返回 1，失败返回 0
 */
export const updateUserName = async (name: string, url: string): Promise<number> => {
    if (!userStore.$state.email) {
        alert("请先登录");
        return 0;
    }
    try {
        const res = await axios.post(url, {username: name}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userStore.token}`,
            },
        });
        console.log("Profile updated:", res.data.message);
        userStore.setUser(name, undefined, undefined, undefined);
        return 1;         // 成功时返回1
    } catch (err) {
        console.error(err);
        return 0;         // 失败时返回0
    }
}

/**
 * 用户登录
 * @param data - 用户登录所需数据
 * @param url - 登录接口地址
 * @returns 登录成功返回 true，登录失败返回 false
 */
export const userLogin = async (data: typeof userData, url: string): Promise<boolean> => {
    try {
        const res = await axios.post(url, data);
        const token: string = res.data.token;
        // 将 token 存储在本地存储中或设置在应用状态中
        localStorage.setItem("token", token);
        await userStore.fetchUser();
        return true; // 返回成功状态
    } catch (err) {
        console.error(err);
        return false; // 返回失败状态
    }
}


/**
 * 用户注册
 * @param data - 用户注册所需数据
 * @param url - 注册接口地址
 * @returns 注册成功返回 true，注册失败返回 false
 */
export const userSignup = async (data: typeof userData, url: string): Promise<boolean> => {
    try {
        const res = await axios.post(url, data)
        const token = res.data.token;
        localStorage.setItem("token", token);
        window.location.href = "/";
        return true; // 返回成功状态
    } catch (err) {
        console.error(err);
        return false; // 返回失败状态
    }
}