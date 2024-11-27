<template></template>

<!-- <script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { openSuccess, openWarning } from "@/utils/notificationUtils";

// 定义变量
const title = ref<string>("");
const quillEditor = ref(null);
let quillInstance: Quill | null = null;
const route = useRoute(); // 获取路由实例
const router = useRouter(); // 获取路由实例
const article_id = route.params.id as string; // 假设文章 ID 通过路由参数传递

// 页面加载完成后初始化 Quill 并获取文章数据
onMounted(async () => {
  quillInstance = new Quill(quillEditor.value!, {
    theme: "snow",
  });

  if (article_id) {
    const articleData = await getData(article_id);
    title.value = articleData.title;
    quillInstance.root.innerHTML = articleData.content;
  }
});

// 获取文章数据
async function getData(id: string): Promise<any> {
  try {
    const response = await axios.get(
      `http://49.235.164.72:3000/articles/page/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
}

// 获取编辑器中的内容
function getQuillContent() {
  if (quillInstance) {
    const htmlContent = quillInstance.root.innerHTML; // 获取 HTML 内容
    return htmlContent;
  }
  return "";
}

// 发布或更新文章
async function postArticle() {
  const content = getQuillContent(); // 获取编辑器中的内容
  const articleTitle = title.value;
  console.log("文章标题:", articleTitle, content);
  if (articleTitle && content && content !== "<p><br></p>") {
    try {
      const response = await axios.put(
        `http://49.235.164.72:3000/alterArticles/${article_id}`,
        {
          title: articleTitle,
          content: content,
        }
      );
      console.log("文章修改成功:", response.data);
      openSuccess("修改成功！");
      // 跳转到创作中心
      router.push("/creativecenter/article");
    } catch (error) {
      openWarning(`错误信息：${error}`);
    }
  } else {
    openWarning("请填写所有必填项！");
  }
}
</script>

<template>
  <div
    style="
      padding: 1rem;
      display: flex;
      height: 3rem;
      align-items: center;
      gap: 2rem;
    "
  >
    <input
      type="text"
      id="title"
      v-model="title"
      placeholder="文章标题："
      maxlength="80"
    />
    <el-button type="primary" @click="postArticle">发布</el-button>
  </div>
  <div ref="quillEditor" style="height: calc(100vh - 122px)"></div>
</template>

<style scoped>
#title {
  border: none; /* 移除边框 */
  outline: none; /* 移除焦点时的外边框 */
  font-size: 1.5rem;
  line-height: 2rem;
  background-color: inherit;
  width: 100%;
}
</style> -->

<!--<template>-->
<!--  <div class="cropper-container">-->
<!--    <form>-->
<!--      <fieldset>-->
<!--        <legend>Within:</legend>-->
<!--        <input-->
<!--          id="inputWithinCanvas"-->
<!--          v-model="within"-->
<!--          type="radio"-->
<!--          name="within"-->
<!--          value="canvas"-->
<!--        />-->
<!--        <label for="inputWithinCanvas">canvas</label>-->
<!--        <input-->
<!--          id="inputWithinImage"-->
<!--          v-model="within"-->
<!--          type="radio"-->
<!--          name="within"-->
<!--          value="image"-->
<!--        />-->
<!--        <label for="inputWithinImage">image</label>-->
<!--        <input-->
<!--          id="inputWithinNone"-->
<!--          v-model="within"-->
<!--          type="radio"-->
<!--          name="within"-->
<!--          value="none"-->
<!--        />-->
<!--        <label for="inputWithinNone">none</label>-->
<!--      </fieldset>-->
<!--    </form>-->
<!--    <cropper-canvas ref="cropperCanvas" :key="within" background>-->
<!--      <cropper-image-->
<!--        ref="cropperImage"-->
<!--        src="https://cofess-1326804753.cos.ap-shanghai.myqcloud.com/9404f7bc-843e-4381-a642-1342f7de7306.jpg"-->
<!--        alt="Picture"-->
<!--        rotatable-->
<!--        scalable-->
<!--        skewable-->
<!--        translatable-->
<!--        @transform="onCropperImageTransform"-->
<!--      />-->
<!--      <cropper-handle action="move" plain />-->
<!--      <cropper-selection-->
<!--        ref="cropperSelection"-->
<!--        initial-coverage="0.5"-->
<!--        movable-->
<!--        resizable-->
<!--        outlined-->
<!--        @change="onCropperSelectionChange"-->
<!--      >-->
<!--        <cropper-grid role="grid" covered />-->
<!--        <cropper-crosshair centered />-->
<!--        <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)" />-->
<!--        <cropper-handle action="n-resize" />-->
<!--        <cropper-handle action="e-resize" />-->
<!--        <cropper-handle action="s-resize" />-->
<!--        <cropper-handle action="w-resize" />-->
<!--        <cropper-handle action="ne-resize" />-->
<!--        <cropper-handle action="nw-resize" />-->
<!--        <cropper-handle action="se-resize" />-->
<!--        <cropper-handle action="sw-resize" />-->
<!--      </cropper-selection>-->
<!--    </cropper-canvas>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import 'cropperjs';-->
<!--import  CropperCanvas from "@cropper/element-canvas";-->
<!--import  CropperImage from "@cropper/element-image";-->
<!--import  CropperSelection from "@cropper/element-selection";-->
<!--import  { Selection } from "@cropper/element-selection";-->

<!--export default {-->
<!--  name: "CropperSelectionExample",-->
<!--  data() {-->
<!--    return {-->
<!--      within: "canvas",-->
<!--    };-->
<!--  },-->
<!--  methods: {-->
<!--    inSelection(selection: Selection, maxSelection: Selection) {-->
<!--      return (-->
<!--        selection.x >= maxSelection.x &&-->
<!--        selection.y >= maxSelection.y &&-->
<!--        selection.x + selection.width <= maxSelection.x + maxSelection.width &&-->
<!--        selection.y + selection.height <= maxSelection.y + maxSelection.height-->
<!--      );-->
<!--    },-->
<!--    onCropperImageTransform(event: CustomEvent) {-->
<!--      const cropperCanvas = this.$refs.cropperCanvas as CropperCanvas;-->

<!--      if (!cropperCanvas || this.within !== "image") {-->
<!--        return;-->
<!--      }-->

<!--      const cropperImage = this.$refs.cropperImage as CropperImage;-->
<!--      const cropperSelection = this.$refs.cropperSelection as CropperSelection;-->
<!--      const cropperCanvasRect = cropperCanvas.getBoundingClientRect();-->

<!--      // 1. Clone the cropper image.-->
<!--      const cropperImageClone = cropperImage.cloneNode() as CropperImage;-->

<!--      // 2. Apply the new matrix to the cropper image clone.-->
<!--      cropperImageClone.style.transform = `matrix(${event.detail.matrix.join(-->
<!--        ", "-->
<!--      )})`;-->

<!--      // 3. Make the cropper image clone invisible.-->
<!--      cropperImageClone.style.opacity = "0";-->

<!--      // 4. Append the cropper image clone to the cropper canvas.-->
<!--      cropperCanvas.appendChild(cropperImageClone);-->

<!--      // 5. Compute the boundaries of the cropper image clone.-->
<!--      const cropperImageRect = cropperImageClone.getBoundingClientRect();-->

<!--      // 6. Remove the cropper image clone.-->
<!--      cropperCanvas.removeChild(cropperImageClone);-->

<!--      const selection = cropperSelection as Selection;-->
<!--      const maxSelection: Selection = {-->
<!--        x: cropperImageRect.left - cropperCanvasRect.left,-->
<!--        y: cropperImageRect.top - cropperCanvasRect.top,-->
<!--        width: cropperImageRect.width,-->
<!--        height: cropperImageRect.height,-->
<!--      };-->

<!--      if (!this.inSelection(selection, maxSelection)) {-->
<!--        event.preventDefault();-->
<!--      }-->
<!--    },-->
<!--    onCropperSelectionChange(event: CustomEvent) {-->
<!--      const cropperCanvas = this.$refs.cropperCanvas as CropperCanvas;-->

<!--      if (!cropperCanvas || this.within === "none") {-->
<!--        return;-->
<!--      }-->

<!--      const cropperCanvasRect = cropperCanvas.getBoundingClientRect();-->
<!--      const selection = event.detail as Selection;-->

<!--      switch (this.within) {-->
<!--        case "canvas": {-->
<!--          const maxSelection: Selection = {-->
<!--            x: 0,-->
<!--            y: 0,-->
<!--            width: cropperCanvasRect.width,-->
<!--            height: cropperCanvasRect.height,-->
<!--          };-->

<!--          if (!this.inSelection(selection, maxSelection)) {-->
<!--            event.preventDefault();-->
<!--          }-->
<!--          break;-->
<!--        }-->

<!--        case "image": {-->
<!--          const cropperImage = this.$refs.cropperImage as CropperImage;-->
<!--          const cropperImageRect = cropperImage.getBoundingClientRect();-->
<!--          const maxSelection: Selection = {-->
<!--            x: cropperImageRect.left - cropperCanvasRect.left,-->
<!--            y: cropperImageRect.top - cropperCanvasRect.top,-->
<!--            width: cropperImageRect.width,-->
<!--            height: cropperImageRect.height,-->
<!--          };-->

<!--          if (!this.inSelection(selection, maxSelection)) {-->
<!--            event.preventDefault();-->
<!--          }-->
<!--          break;-->
<!--        }-->

<!--        default:-->
<!--      }-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--.cropper-container {-->
<!--  border: 1px solid var(&#45;&#45;vp-c-divider);-->
<!--  border-radius: 0.375rem;-->
<!--  margin-bottom: 1rem;-->
<!--  margin-top: 1rem;-->
<!--  padding: 1.25rem 1.5rem;-->

<!--  fieldset {-->
<!--    border: 1px solid var(&#45;&#45;vp-c-divider);-->
<!--    border-radius: 0.375rem;-->
<!--    margin-bottom: 1rem;-->
<!--    padding: 0.25rem 0.75rem 0.75rem 0.75rem;-->

<!--    > input {-->
<!--      margin: 0 0.25rem 0 0;-->
<!--      transform: translateY(-0.5px);-->
<!--      vertical-align: middle;-->
<!--    }-->

<!--    > label {-->
<!--      margin-right: 0.5rem;-->
<!--    }-->
<!--  }-->

<!--  cropper-canvas {-->
<!--    height: 100vh;-->
<!--  }-->
<!--}-->
<!--</style>-->
