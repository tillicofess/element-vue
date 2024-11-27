import {createRouter, createWebHistory} from "vue-router";

const routes = [
    // header
    {
        path: "/",
        name: "apprecommend",
        component: () => import("@/views/home/SectionHeader.vue"),
        children: [
            {
                path: "",
                name: "articles",
                component: () => import("@/views/home/ArticlesSection.vue"),
            },
            {
                path: "tools",
                name: "tools",
                component: () => import("@/views/home/ToolsSection.vue"),
            },
            {
                path: "tutorials",
                name: "tutorials",
                component: () => import("@/views/home/TutorialsSection.vue"),
            },
        ],
    },
    //  文章详情页
    {
        path: "/articles/:id",
        name: "articlesPage",
        component: () => import("@/views/home/ArticleDetailPage.vue"),
    },
    // 创作中心
    {
        path: "/creative-center",
        name: "creativecenter",
        component: () => import("@/views/creative-center/Main.vue"),
        children: [
            // 创作中心首页
            {
                path: "home",
                name: "creativehome",
                component: () => import("@/views/creative-center/Home.vue"),
            },
            // 创作中心文章管理
            {
                path: "article",
                name: "article",
                component: () => import("@/views/creative-center/modules/Article.vue"),
            },
        ],
    },
    // 新建文章
    {
        path: "/new-article",
        name: "new-article",
        component: () => import("@/views/creative-center/modules/NewArticle.vue"),
    },
    {
        path: "/alter-article/:id",
        name: "alter-article",
        component: () => import("@/views/creative-center/modules/AlterArticle.vue"),
    },
    {
        path: "/hello",
        name: "Hello",
        component: () => import("./components/header/Header.vue"),
    },
    // 推荐表格
    {
        path: "/apptable",
        name: "apptable",
        component: () => import("./views/backend/rec-management.vue"),
    },
    // 用户登录
    {path: "/userlogin", component: () => import("@/views/user/AppLogin.vue")},
    // 用户注册
    {
        path: "/usersignup",
        component: () => import("@/views/user/AppSignUp.vue"),
    },
    // 用户设置
    {path: "/settings", component: () => import("@/views/user/Settings.vue")},
    // 捕获所有未匹配的路由
    {
        path: "/:catchAll(.*)", // 这行是捕获所有未匹配的路由
        name: "NotFound",
        component: () => import("./views/PageNotFound.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
