<template>
  <div class="app-container" v-loading="loading">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getDictionaryItemPage"
      v-if="dictionaryId"
    />
    <div v-if="!dictionaryId">点击字典查看详情</div>

    <dictionaryItemForm :mode="mode" :id="propId" :dictionaryId="dictionaryId" @refresh="getDictionaryItemPage" @close="closeDialog" v-if="dialogName == 'dictionaryItemForm'"></dictionaryItemForm>
  </div>
</template>

<script>
import { getDictionaryItemPage, deleteDictionaryItem } from "@/api/dictionaryItem";
import dictionaryItemForm from './dictionaryItemForm';

export default {
  components: {
    dictionaryItemForm
  },
  props: ["dictionaryId"],
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
      searchData: {
        dictionaryId: '',
        sortable: 'sort asc'
      },
      propId: '',
      dialogName: '',
    };
  },
  mounted() {

  },
  computed: {
    tableConfig() {
      let _this = this;
      return {
        // index: false,
        stripe: true,
        search: true,
        reset: true,
        btns: [
          { text: "新增", click: () => _this.operate('add'), icon: "el-icon-circle-plus" }
        ],
        columns: [
          { label: '字典标签', name: "label", search: true, type: "text" },
          { label: '字典值', name: "value", search: true, type: "text" },
          { label: '排序', name: "sort", type: "text" },
          { label: '备注', name: "remark", type: "text" },
        ],
        operate: [
          { text: "编辑", show: true, click: data => _this.operate('edit', data) },
          { text: "删除", show: true, click: _this.del },
        ]
      };
    }
  },
  methods: {
    getDictionaryItemPage() {
      this.loading++;
      getDictionaryItemPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.list;
        this.page.total = res.total;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    operate(mode, data) {
      if(mode != 'add') this.propId = data.id;
      this.mode = mode;
      this.dialogName = 'dictionaryItemForm';
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++;
        deleteDictionaryItem(data.id).then(res => {
          this.$message.success("删除成功");
          this.getDictionaryItemPage();
        }).catch(e => console.log(e)).finally(() => this.loading--);
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = '';
    }
  },
  watch: {
    dictionaryId: {
      handler: function(dictionaryId) {
        if(dictionaryId) {
          this.searchData.dictionaryId = dictionaryId;
          this.getDictionaryItemPage();
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>

</style>
