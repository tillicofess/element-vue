import {defineStore} from "pinia";
import axios from "axios";

// 定义状态的类型
interface UserState {
    name: string;
    email: string;
    token: string;
    avatarUrl: string;
    isLoggedIn: boolean;
    isUserInfoSet: boolean;
}

export const useUserStore = defineStore("user", {
    state: (): UserState => ({
        name: "",
        email: "",
        token: "",
        avatarUrl: "",
        isLoggedIn: false, // 标记数据是否已加载
        isUserInfoSet: false, // 标记是否处于编辑状态
    }),
    actions: {
        // 以下为示例代码，请根据实际情况进行修改
        setUser(name?: string, email?: string, token?: string, avatarUrl?: string) {
            if (name) {
                this.name = name;
            }
            if (email) {
                this.email = email;
            }
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
            }
            if (avatarUrl) {
                this.avatarUrl = avatarUrl;
            }
            this.isUserInfoSet = true;
        },

        // 以下为示例代码，请根据实际情况进行修改
        clearToken() {
            this.isLoggedIn = false;
            this.isUserInfoSet = false;
            localStorage.removeItem("token");

            // 可以在这里进行其他退出逻辑，例如跳转到登录页面
            window.location.reload();

        },

        // 以下为示例代码，请根据实际情况进行修改
        async fetchUser() {
            // 如果数据已经加载，直接返回，避免重复调用
            if (this.isLoggedIn) {
                console.log("数据已加载，无需重复调用");
                return;
            }

            const storedToken = localStorage.getItem("token");
            // 如果 token 存在，则发送请求获取用户信息
            if (storedToken) {
                try {
                    const response = await axios.get(
                        "http://49.235.164.72:3000/user",
                        {
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        }
                    );

                    // 设置用户信息
                    const {name, email, avatar_url} = response.data;
                    const Url = `https://${avatar_url}`;
                    this.setUser(name, email, storedToken, Url);
                    console.log("isLoggedIn:" + this.isLoggedIn);
                } catch (error) {
                    console.error("获取用户信息失败:", error);
                    this.setUser(
                        "游客",
                        undefined,
                        undefined,
                        "https://cofess-1326804753.cos.ap-shanghai.myqcloud.com/e801f687-ea23-41f2-a909-25a9cde11ac4.jpg"
                    );
                }

            } else {

                // 如果 token 不存在，设置为默认游客状态
                this.setUser(
                    "游客",
                    undefined,
                    undefined,
                    "https://cofess-1326804753.cos.ap-shanghai.myqcloud.com/e801f687-ea23-41f2-a909-25a9cde11ac4.jpg"
                );
                console.log("storedToken 还未获取");
                console.log("isLoggedIn:" + this.isLoggedIn);
            }
        }

    },
});
