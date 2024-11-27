<script lang="ts" setup>
import Header from "@/components/header/Header.vue";
import {ref, onMounted, reactive} from "vue";
import {ElTable} from "element-plus";
import axios from "axios";
import {openSuccess, openWarning} from "@/utils/notificationUtils.ts";

// 定义表单数据类型
interface Card {
  id?: number;
  category: "tutorial" | "tools";
  img_url: string;
  title: string;
  description: string;
  url: string;
}

// 表格数据
const tableData = ref<Card[]>([]);
// 空表单数据
const emptyCard = ref<Card>({
  id: 0,
  category: "tutorial",
  img_url: "",
  title: "",
  description: "",
  url: "",
});
// 提交表单数据
let form = reactive<Card>({
  id: 0,
  category: "tutorial",
  img_url: "",
  title: "",
  description: "",
  url: "",
});
//  表格分页状态
const state = reactive({
  page: 1,
  limit: 14,
  total: 0,
});

//  模态框状态
const dialogDeleteVisible = ref(false);
const dialogAddVisible = ref(false);
const dialogEditVisible = ref(false);
//  确认删除的行id
const deleteRow = ref<number | undefined>(undefined);
// 确认删除的输入框
const confirmDelete = ref<string>("");
//  打开模态框映射
const dialogMapping = {
  add: dialogAddVisible,
  delete: dialogDeleteVisible,
  edit: dialogEditVisible,
};

// 页面加载时加载数据
onMounted(async () => {
  await loadData();
});

// 定义table数据
const loadData = async () => {
  const data = await getData(state.page, state.limit);
  tableData.value = data.results;
  state.total = data.total;
};

// 过滤table数据
// const table = () => {
//   return tableData.value.filter(
//     (_item, index) =>
//       index < state.page * state.limit &&
//       index >= state.limit * (state.page - 1)
//   );
// };

//改变页码
const handleCurrentChange = (e: number) => {
  state.page = e;
  loadData();
};

//获取table数据
async function getData(
    page: number = 1,
    limit: number = 14
): Promise<{ results: Card[]; total: number }> {
  try {
    const response = await axios.get<{ results: Card[]; total: number }>(
        "http://49.235.164.72:3000/payments",
        {
          params: {
            page: page,
            limit: limit,
          },
        }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {results: [], total: 0}; // 返回一个空数组和总条目数为0
  }
}

// 处理编辑dialog
const handleEdit = (index: number, row: Card) => {
  console.log(index, row.id);
  // 深拷贝避免修改原始数据
  Object.assign(form, JSON.parse(JSON.stringify(tableData.value[index])));
  console.log(form);
  dialogEditVisible.value = true;
};

// 处理删除dialog
const handleDelete = (index: number, row: Card) => {
  deleteRow.value = row.id;
  console.log("deleteRow = " + deleteRow.value);
  dialogDeleteVisible.value = true;
  console.log(index, row.id);
};

// 过滤器
const filterTag = (value: string, row: Card) => {
  return row.category === value;
};

// 处理新增
const handleAddConfirm = async () => {
  if (form.title && form.description && form.url) {
    try {
      // 如果图片img_url为空，则使用默认图片
      if (form.img_url === "") {
        form.img_url =
            "https://cofess-1326804753.cos.ap-shanghai.myqcloud.com/cat.jpg";
      }
      console.log(form.img_url);
      console.log(form);
      // 发送axios请求
      const response = await axios.post("http://49.235.164.72:3000/insert", form);
      console.log(response);
      dialogAddVisible.value = false;
      loadData();
      openSuccess("添加成功！");
    } catch (err) {
      console.error("Error adding data:", err);
    }
  } else {
    openWarning("请填写完整信息！");
  }
};

// 处理编辑
const handleEditConfirm = async () => {
  if (form.title && form.description && form.url && form.img_url) {
    try {
      const response = await axios.put("http://49.235.164.72:3000/update", form);
      console.log(response.data);
      dialogEditVisible.value = false;
      loadData();
      openSuccess("编辑成功！");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  } else {
    openWarning("请确保没有空数据！");
  }
};

// 处理删除
const handleDeleteConfirm = async (id: number | undefined) => {
  if (id) {
    try {
      await axios.delete("http://49.235.164.72:3000/deleteRows", {
        data: {id: id},
      });
      dialogDeleteVisible.value = false;
      console.log("删除成功");
      openSuccess("删除成功！");
      confirmDelete.value = "";
      await loadData();
    } catch (error) {
      openWarning("发生意外，删除失败！");
      console.error("Error deleting data:", error);
      throw new Error("Error deleting data");
    }
  }
};

// 处理取消
const handleCancel = (param: keyof typeof dialogMapping) => {
  dialogMapping[param].value = false;

  if (param === "delete") {
    // 清空确认删除输入框
    confirmDelete.value = "";
  }

  // Reset form data
  Object.assign(form, emptyCard.value);
};
// const handleCancel = (param: string) => {
//   if (param === "add") {
//     dialogAddVisible.value = false;
//   } else if (param === "delete") {
//     // 清空确认删除输入框
//     confirmDelete.value = "";
//     dialogDeleteVisible.value = false;
//   } else if (param === "edit") {
//     dialogEditVisible.value = false;
//   }

//   // Reset form data
//   Object.assign(form, emptyCard.value);
// };
</script>

<template>
  <div class="container">
    <Header/>
    <div style="padding: 1rem; flex: 1">
      <div
          style="
          padding: 1rem;
          background: white;
          max-width: 1440px;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid #e2e8f0;
          box-sizing: border-box;
        "
      >
        <!-- 新增按钮 -->
        <el-button
            type="primary"
            @click="dialogAddVisible = true"
            style="margin-bottom: 1rem"
        >新增
        </el-button
        >

        <!-- Table -->
        <el-table
            :data="tableData"
            stripe
            border
            style="border: 1px solid #e2e8f0; margin-bottom: 1rem"
        >
          <el-table-column prop="id" label="Id" width="100"/>
          <el-table-column
              prop="category"
              label="Category"
              width="100"
              :filters="[
              { text: 'tutorial', value: 'tutorial' },
              { text: '	tools', value: 'tools' },
            ]"
              :filter-method="filterTag"
          >
            <template #default="scope">
              <el-tag
                  :type="
                  scope.row.category === 'tutorial' ? 'primary' : 'success'
                "
                  disable-transitions
              >{{ scope.row.category }}
              </el-tag
              >
            </template>
          </el-table-column
          >
          <el-table-column
              prop="img_url"
              label="Img_url"
              show-overflow-tooltip
          />
          <el-table-column prop="title" label="Title" width="200"/>
          <el-table-column prop="description" label="Description"/>
          <el-table-column prop="url" label="Url" show-overflow-tooltip/>
          <el-table-column label="Operations" width="160">
            <template #default="scope">
              <div>
                <el-button
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                >
                  Edit
                </el-button>
                <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                >
                  Delete
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            background
            :page-size="state.limit"
            layout="total,prev, pager, next"
            :total="state.total"
            style="justify-content: end"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>

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
          <el-button @click="handleCancel('delete')">取消</el-button>
          <el-button
              type="primary"
              :disabled="confirmDelete !== '确认删除'"
              @click="handleDeleteConfirm(deleteRow)"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 新增弹窗 -->
    <el-dialog
        v-model="dialogAddVisible"
        title="New"
        width="500"
        :show-close="false"
    >
      <el-form :model="form" label-width="auto">
        <!-- Category -->
        <el-form-item label="类型">
          <el-select
              v-model="form.category"
              placeholder="please select your zone"
          >
            <el-option label="tutorial" value="tutorial"/>
            <el-option label="tools" value="tools"/>
          </el-select>
        </el-form-item>
        <!-- img_url -->
        <el-form-item label="图片url">
          <el-input v-model="form.img_url"/>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="描述词">
          <el-input v-model="form.description"/>
        </el-form-item>
        <el-form-item label="网站地址">
          <el-input v-model="form.url"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel('add')">取消</el-button>
          <el-button type="primary" @click="handleAddConfirm()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog
        v-model="dialogEditVisible"
        title="New"
        width="500"
        :show-close="false"
    >
      <el-form :model="form" label-width="auto">
        <!-- Category -->
        <el-form-item label="类型">
          <el-select
              v-model="form.category"
              placeholder="please select your zone"
          >
            <el-option label="tutorial" value="tutorial"/>
            <el-option label="tools" value="tools"/>
          </el-select>
        </el-form-item>
        <!-- img_url -->
        <el-form-item label="图片url">
          <el-input v-model="form.img_url"/>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="描述词">
          <el-input v-model="form.description"/>
        </el-form-item>
        <el-form-item label="网站地址">
          <el-input v-model="form.url"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel('edit')">取消</el-button>
          <el-button type="primary" @click="handleEditConfirm()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
}

.highlight-text {
  color: red;
}
</style>
