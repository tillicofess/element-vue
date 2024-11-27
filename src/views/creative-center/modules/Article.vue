<script setup lang="ts">
import {ref, onMounted, computed, watch} from "vue";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/userStore";
import {Card} from "@/type/types.ts";
import {fetchUserAllArticles, handleDeleteArticle} from "@/api/articles.ts";
import {Search} from "@element-plus/icons-vue";
import {openSuccess, openWarning} from "@/utils/notificationUtils";

const userStore = useUserStore();
const router = useRouter();
const loading = ref(true);                                           // 用于控制数据加载动画
const deleteTerm = ref<number | undefined>(undefined);               // 用于存储删除的文章标题
const dialogDeleteVisible = ref(false);
const confirmDelete = ref<string>("");
const tableData = ref<Card[]>([]);                                   // 用于存储文章数据
const filteredTableData = ref<Card[]>([]);                           // 过滤后的文章数据
const search = ref<string>("");                                      // 用于搜索文章
const userInfo = computed(() => userStore.$state.isUserInfoSet);    // 是否完成用户信息获取
const loginState = computed(() => userStore.$state.isLoggedIn);     // 用户登录状态

// 页面加载后，获取文章数据
onMounted(async () => {
  if (userInfo.value) {
    if (loginState.value) {
      await fetchArticles();
    }
  } else {
    const stop = watch(userInfo, async (newVal) => {
      if (newVal && loginState.value) {
        await fetchArticles();
      }
      stop();
    });
  }
  loading.value = false;
});

// 获取文章数据的封装函数
async function fetchArticles() {
  loading.value = true; // 开始加载
  tableData.value = await fetchUserAllArticles(userStore.$state.email);
  loading.value = false; // 加载完成
}

// 过滤 tableData 根据搜索关键词
const handleSearch = (event: any) => {
  event.preventDefault();
  filteredTableData.value = tableData.value.filter((card) =>
      card.title.toLowerCase().includes(search.value.toLowerCase())
  );
};

// 新建文章跳转
const handleButtonClick = () => {
  if (userStore.$state.email) {
    // 跳转到新建文章页面，并传递查询参数
    router.push({
      path: "/new-article",
      query: {email: userStore.$state.email},
    });
  } else {
    openWarning("请先登录");
  }
};

// 文章详情页跳转
const openCardUrl = (id: number) => {
  router.push({
    path: `/articles/${id}`,
  });
};

//  编辑文章跳转
const handleEdit = (id: number) => {
  // 跳转到编辑文章页面
  router.push({
    path: `/alter-article/${id}`,
  });
};

// 删除文章确认弹窗
const handleDelete = (id: number | undefined) => {
  deleteTerm.value = id;
  dialogDeleteVisible.value = true;
};

// 删除文章确认函数
const handleDeleteConfirm = async (id: number | undefined) => {
  if (id) {
    const res = await handleDeleteArticle(id);
    if (res) {
      dialogDeleteVisible.value = false;
      openSuccess("删除成功！");
      await fetchArticles(); // 直接获取数据
    } else {
      openWarning("发生意外，删除失败！");
    }
  }
}
</script>

<template>
  <div class="container">
    <!-- 文章头部处理项 -->
    <div class="header">
      <el-button type="primary" @click="handleButtonClick">
        新建文章
      </el-button>
      <form @submit="handleSearch">
        <el-input
            v-model="search"
            style="max-width: 16rem"
            placeholder="搜索文章"
            maxlength="20"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch"/>
          </template>
        </el-input>
      </form>
    </div>

    <!-- 数据加载动画 -->
    <el-skeleton :rows="5" style="padding: 1rem 2rem" v-if="loading" animated/>

    <!-- 文章列表 -->
    <div
        v-for="card in filteredTableData.length ? filteredTableData : tableData"
        :key="card.id"
        class="card"
        v-else-if="!loading && tableData.length"
    >
      <!-- 文章标题 -->
      <div class="card-main">
        <p class="line-clamp-1">{{ card.title }}</p>
        <el-dropdown placement="bottom">
          <el-button type="success">选项</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="openCardUrl(card.id)"
              >详情页
              </el-dropdown-item
              >
              <el-dropdown-item @click="handleEdit(card.id)"
              >修改
              </el-dropdown-item
              >
              <el-dropdown-item @click="handleDelete(card.id)"
              >删除
              </el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 文章time -->
      <div class="card-footer">
        <p class="line-clamp-1">创建时间：{{ card.created_at }}</p>
        <p class="line-clamp-1">最后更新：{{ card.updated_at }}</p>
      </div>
    </div>

    <!-- 未登录用户的提示信息 -->
    <el-empty v-else>
      <router-link to="/userlogin"
      >
        <el-button type="primary" v-if="userStore.$state.email === ''"
        >请先登录
        </el-button
        >
      </router-link
      >
    </el-empty>

    <!-- 删除确认弹窗 -->
    <el-dialog
        v-model="dialogDeleteVisible"
        title="Tips"
        width="500"
        :show-close="false"
    >
      <span id="confirm-delete-text">
        请输入"<span class="highlight-text">确认删除</span>"来确定删除此条数据！
      </span>
      <el-input v-model="confirmDelete" placeholder="请输入确认删除"/>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogDeleteVisible = false">取消</el-button>
          <el-button
              type="primary"
              :disabled="confirmDelete !== '确认删除'"
              @click="handleDeleteConfirm(deleteTerm)"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  min-height: 16rem;
  background-color: #ffffff;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
}

.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e6eb;
  padding: 1rem 1.5rem;
}

.card {
  border-bottom: 1px solid #e5e6eb;
  padding: 1rem 2rem;
}

.card:hover {
  background-color: #f5f5f5;
}

.card-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;

  p {
    font-size: 0.8rem;
    color: #86909c;
  }
}

.highlight-text {
  color: red;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
}
</style>
