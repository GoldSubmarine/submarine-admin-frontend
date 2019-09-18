<template>
  <div class="app-container" v-loading="loading">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :load="getMenuTree"
    />
    <dForm :mode="mode" :id="propId" @refresh="getMenuTree" @close="closeDialog" v-if="dialogName == 'dForm'"></dForm>
  </div>
</template>

<script>
import { getMenuTree, deleteMenu } from "@/api/menu";
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
      searchData: {},
      propId: '',
      dialogName: '',
    };
  },
  mounted() {
    this.getMenuTree();
  },
  computed: {
    tableConfig() {
      let _this = this;
      return {
        index: false,
        stripe: true,
        search: true,
        reset: true,
        rowKey: "id",
        treeProps: {children: 'children', hasChildren: 'hasChildren'},
        btns: [
          { text: "新增", click: () => _this.operate('add'), icon: "el-icon-circle-plus" }
        ],
        columns: [
          { label: '名称', name: "name", align: 'left', search: true, type: "text" },
          { label: '权限值', name: "value", search: true, type: "text" },
          { label: '备注', name: "remark", search: true, type: "text" },
          { label: '创建时间', name: "createTime", },
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
    getMenuTree() {
      this.loading++;
      getMenuTree(this.searchData).then(res => {
        this.tableData = res;
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
        deleteMenu(data.id).then(res => {
          this.$message.success("删除成功");
          this.getMenuTree();
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
