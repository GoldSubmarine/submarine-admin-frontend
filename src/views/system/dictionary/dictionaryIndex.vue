<template>
  <div class="app-container" v-loading="loading">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getDictionaryPage"
    />
    <dictionaryForm :mode="mode" :id="propId" @refresh="getDictionaryPage" @close="closeDialog" v-if="dialogName == 'dictionaryForm'"></dictionaryForm>
  </div>
</template>

<script>
import { getDictionaryPage, deleteDictionary } from "@/api/dictionary";
import dictionaryForm from './dictionaryForm';

export default {
  components: {
    dictionaryForm
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
    this.getDictionaryPage();
  },
  computed: {
    tableConfig() {
      let _this = this;
      return {
        // index: false,
        stripe: true,
        search: true,
        reset: true,
        stripe: false,
        highlightCurrentRow: true,
        rowClick: node => _this.$emit("cellClick", node),
        btns: [
          { text: "新增", click: () => _this.operate('add'), icon: "el-icon-circle-plus" }
        ],
        columns: [
          { label: '字典名', name: "name", search: true, type: "text" },
          { label: '备注', name: "remark", search: true, type: "text" },
        ],
        operate: [
          { text: "编辑", show: true, click: data => _this.operate('edit', data) },
          { text: "删除", show: true, click: _this.del },
        ]
      };
    }
  },
  methods: {
    getDictionaryPage() {
      this.loading++;
      getDictionaryPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.list;
        this.page.total = res.total;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    operate(mode, data) {
      if(mode != 'add') this.propId = data.id;
      this.mode = mode;
      this.dialogName = 'dictionaryForm';
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++;
        deleteDictionary(data.id).then(res => {
          this.$message.success("删除成功");
          this.getDictionaryPage();
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
