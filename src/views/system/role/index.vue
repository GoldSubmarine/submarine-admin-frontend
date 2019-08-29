<template>
  <div class="app-container" v-loading="loading">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getRolePage"
    />
    <dForm :mode="mode" :id="propId" @refresh="getRolePage" @close="closeDialog" v-if="dialogName == 'dForm'"></dForm>

    <el-row :gutter="40" style="margin-top: 20px;">
      <el-col :span="12">
        <treeSelect mode="permission" :id="propTreeId"></treeSelect>
      </el-col>

      <el-col :span="12">
        <treeSelect mode="menu" :id="propTreeId"></treeSelect>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getRolePage, deleteRole } from "@/api/role";
import dForm from './form';
import treeSelect from './treeSelect';

export default {
  components: {
    dForm,
    treeSelect
  },
  data() {
    let _this = this;
    return {
      loading: 0,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {},
      propId: '',
      propTreeId: "",
      dialogName: '',
    };
  },
  mounted() {
    this.getRolePage();
  },
  computed: {
    tableConfig() {
      let _this = this;
      return {
        // index: false,
        search: true,
        reset: true,
        stripe: false,
        highlightCurrentRow: true,
        currentChange: _this.currentChange,
        btns: [
          { text: "新增", click: () => _this.operate('add'), icon: "el-icon-circle-plus" }
        ],
        columns: [
          { label: '名称（中文）', name: "name", search: true, type: "text" },
          { label: '编码', name: "code", search: true, type: "text" },
          { label: '备注', name: "remark", search: true, type: "text" },
        ],
        operate: [
          { text: "编辑", show: true, click: data => _this.operate('edit', data) },
          { text: "删除", show: true, click: _this.del },
          { text: "详情", show: true, click: data => _this.operate('detail', data) },
        ]
      };
    }
  },
  methods: {
    getRolePage() {
      this.loading++;
      getRolePage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.list;
        this.page.total = res.total;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    operate(mode, data) {
      if(mode != 'add') this.propId = data.id;
      this.mode = mode;
      this.dialogName = 'dForm';
    },
    currentChange(data) {
      this.propTreeId = data.id;
      console.log(data)
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++;
        deleteRole(data.id).then(res => {
          this.$message.success("删除成功");
          this.getRolePage();
        }).catch(e => console.log(e)).finally(() => this.loading--);
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = '';
    }
  }
};
</script>

<style scoped>

</style>
