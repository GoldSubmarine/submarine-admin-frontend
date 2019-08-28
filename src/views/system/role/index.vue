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
  </div>
</template>

<script>
import { getRolePage, deleteRole } from "@/api/role";
import dForm from './form';

export default {
  components: {
    dForm
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
