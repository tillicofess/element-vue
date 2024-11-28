// useUserData.ts
import { reactive } from "vue";

/**
 * 用户登录/注册数据
 */
export const useUserData = (): { email: string; password: string } => {
  return reactive({
    email: "",
    password: "",
  });
};

/**
 * 首页文章卡片数据
 * @interface Card
 * @property {number} id - 文章 ID
 * @property {string} title - 文章标题
 * @property {string} name - 作者名
 * @property {string} created_at - 创建时间
 * @property {string} [updated_at] - 最后更新时间
 */
export interface Card {
  id: number;
  title: string;
  name: string;
  created_at: string;
  updated_at?: string;
  imageUrl?: string;
}

/**
 * 文章卡片详情页数据
 * @interface Card_detail
 * @extends Card
 * @property {string} email - 作者的电子邮件地址
 * @property {string} content - 文章的具体内容
 * @property {string} avatar_url - 作者头像的 URL 地址
 */
export interface Card_detail extends Card {
  email: string;
  content: string;
  avatar_url: string;
}
