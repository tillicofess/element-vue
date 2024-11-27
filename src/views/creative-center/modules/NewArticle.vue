<script setup lang="ts">
import {ref, onBeforeUnmount} from "vue";
import {useRoute} from "vue-router";
import {useRouter} from "vue-router";
import {default_text} from "@/constants/miscellaneous.ts"
import {useEditorSetup} from "@/hooks/useEditorSetup.ts";
import {EditorContent, FloatingMenu} from "@tiptap/vue-3";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  CodeXml,
  ImageUp,
  Image as LucideImage,
} from "lucide-vue-next";
import axios from "axios";
import {openSuccess, openWarning} from "@/utils/notificationUtils";

const route = useRoute(); // 获取路由实例
const router = useRouter(); // 获取路由实例
const title = ref<string>(""); // 文章标题
const fileInput = ref<HTMLInputElement | null>(null); // 引用输入元素
const editor = useEditorSetup(default_text, true)

// 在组件卸载时销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

// 发布文章
const postArticle = async () => {
  const content = getHtmlContent(); // 获取编辑器中的内容
  const articleTitle = title.value; // 获取文章标题
  const authorName = route.query.email as string; // 从路由查询参数中获取用户名
  if (articleTitle && content && content !== "<p></p>") {
    try {
      const response = await axios.post("http://49.235.164.72:3000/articles", {
        email: authorName,
        title: articleTitle,
        content: content,
      });
      console.log("文章发布成功:", response.data);
      openSuccess("操作成功！");
      await router.push("/creative-center/article"); // 跳转到创作中心
    } catch (error) {
      console.error("发布文章时出错:", error);
    }
  } else {
    openWarning("请填写所有必填项！");
  }
};

// 添加图片功能
const addImage = () => {
  const url = window.prompt("Enter the image URL:");
  if (url && editor.value) {
    editor.value.chain().focus().setImage({src: url}).run();
  }
};

// 获取 HTML 内容
const getHtmlContent = () => {
  if (editor.value) {
    const htmlContent = editor.value.getHTML();
    console.log("HTML content:", htmlContent);
    return htmlContent;
  } else {
    console.error("Editor is not initialized.");
  }
};

// 触发文件输入点击事件
const triggerUpload = () => {
  fileInput.value?.click();
};

// 处理图片上传
const uploadImage = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    // 获取文件类型
    const file = files[0];
    const fileType = file.type;

    // 检查文件类型是否为允许的格式
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(fileType)) {
      console.error("不允许的文件类型:", fileType);
      return; // 退出函数，不进行后续处理
    }

    const formData = new FormData();
    formData.append("image", files[0]);

    try {
      const response = await axios.post(
          "http://49.235.164.72:3000/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );

      // 假设返回的response.data中包含imageUrl
      const imageUrl = "https://" + response.data.imageUrl;
      if (imageUrl && editor.value) {
        editor.value.chain().focus().setImage({src: imageUrl}).run();
      }
    } catch (error) {
      console.error("上传图片时出错:", error);
    }
  }
};
</script>

<template>
  <div class="container">
    <!-- 文章标题 -->
    <div class="header">
      <input
          type="text"
          id="title"
          v-model="title"
          placeholder="文章标题："
          maxlength="80"
      />
      <el-button type="primary" @click="postArticle">发布</el-button>
    </div>
    <!-- 菜单栏 -->
    <div class="menu" v-if="editor">
      <el-tooltip class="item" effect="dark" content="标题1" placement="top">
        <Heading1
            :size="24"
            class="menu-item"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="标题2" placement="top">
        <Heading2
            :size="24"
            class="menu-item"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="标题3" placement="top">
        <Heading3
            :size="24"
            class="menu-item"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="加粗" placement="top">
        <Bold
            :size="24"
            class="menu-item"
            @click="editor.chain().focus().toggleBold().run()"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="链接图片" placement="top">
        <LucideImage :size="24" @click="addImage" class="menu-item"/>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="本地图片" placement="top">
        <ImageUp :size="24" @click="triggerUpload" class="menu-item"/>
        <input
            type="file"
            ref="fileInput"
            @change="uploadImage"
            accept="image/*"
            style="display: none"
        />
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="代码块" placement="top">
        <CodeXml
            :size="24"
            class="menu-item"
            @click="editor.chain().focus().setCodeBlock().run()"
            :disabled="editor.isActive('codeBlock')"
        />
      </el-tooltip>
      <button @click="getHtmlContent">Get HTML Content</button>
    </div>
    <!-- 悬浮菜单 -->
    <floating-menu
        :editor="editor"
        :tippy-options="{ duration: 100 }"
        v-if="editor"
    >
      <div class="floating-menu">
        <Heading1
            :size="24"
            class="floating-menu-item"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        />
        <Heading2
            :size="24"
            class="floating-menu-item"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        />
        <Heading3
            :size="24"
            class="floating-menu-item"
            @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        />
        <Bold
            :size="24"
            class="floating-menu-item"
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'is-active': editor.isActive('bold', { level: 1 }) }"
        />
        <LucideImage
            :size="24"
            @click="addImage"
            class="floating-menu-item"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        />
        <ImageUp
            :size="24"
            @click="triggerUpload"
            class="floating-menu-item"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        />
        <input
            type="file"
            ref="fileInput"
            @change="uploadImage"
            accept="image/*"
            style="display: none"
        />
        <CodeXml
            :size="24"
            class="floating-menu-item"
            @click="editor.chain().focus().setCodeBlock().run()"
            :disabled="editor.isActive('codeBlock')"
        />
      </div>
    </floating-menu>
    <!-- 编辑器内容 -->
    <div class="editor">
      <EditorContent :editor="editor"></EditorContent>
    </div>
  </div>
</template>


<style scoped lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

#title {
  border: none; /* 移除边框 */
  outline: none; /* 移除焦点时的外边框 */
  font-size: 1.2rem;
  background-color: inherit;
  width: 100%;
  line-height: 2rem;
}

.menu {
  margin-bottom: 1rem;
  display: flex;
  gap: 10px;
}

.menu-item {
  cursor: pointer;
}

.menu-item:hover {
  color: #9ea6ad;
}

/* Floating menu */
.floating-menu {
  display: flex;
  background-color: #e7e4e2;
  padding: 0.1rem;
  border-radius: 0.5rem;

  .floating-menu-item {
    background-color: unset;
    padding: 0.275rem 0.425rem;
    border-radius: 0.3rem;

    &:hover {
      background-color: #d2cdc9;
    }

    &.is-active {
      background-color: #ffffff;
      color: #67ACF1;

      &:hover {
        color: #67ACF1;
      }
    }
  }
}
</style>
