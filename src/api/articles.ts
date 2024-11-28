import { Card, Card_detail } from "@/type/types.ts";
import axios from "axios";
import { API_URLS } from "@/constants/api_url.ts";

/**
 * 获取文章分页数据
 * @param page - 当前页码
 * @param limit - 页面大小
 * @returns Promise<Card[]> - 文章数组
 */
export const fetchMoreArticles = async (
  page: number = 1,
  limit: number = 15
): Promise<Card[]> => {
  try {
    const res = await axios.get<Card[]>(API_URLS.ARTICLES, {
      params: {
        page: page,
        limit: limit,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

/**
 * 获取文章详情数据
 * @param id - 文章ID
 * @returns Promise<Card_detail> - 文章详情数据
 */
export const fetchArticleData = async (
  id: string
): Promise<Card_detail | null> => {
  try {
    const res = await axios.get<Card_detail>(
      `http://49.235.164.72:3000/articles/page/${id}`
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`Article with id ${id} not found.`);
      return null; // 返回 null 表示未找到
    }
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

/**
 * 获取文章数量
 * @param email - 用户邮箱
 * @returns Promise<number> - 文章数量
 */
export const fetchArticleNum = async (email: string): Promise<number> => {
  try {
    const { data } = await axios.get(
      `http://49.235.164.72:3000/articles/count/${email}`
    );
    return data.count;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

/**
 * 获取用户所有文章
 * @param email - 用户邮箱
 * @returns Promise<Card[]> - 文章数组
 */
export const fetchUserAllArticles = async (email: string): Promise<Card[]> => {
  try {
    const res = await axios.get<Card[]>(
      `http://49.235.164.72:3000/articles/${email}` // 使用已经被赋值的用户名
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

/**
 * 刪除文章
 * @param id - 文章ID
 * @returns Promise<number> - 1表示成功，0表示失败
 */
export const handleDeleteArticle = async (id: number): Promise<number> => {
  try {
    await axios.delete(`http://49.235.164.72:3000/articles/delete/${id}`, {
      data: { id: id },
    });
    return 1;
  } catch (error) {
    console.error("Error deleting data:", error);
    return 0;
  }
};
