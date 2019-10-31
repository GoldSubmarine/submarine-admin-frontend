<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-if="dictionaryId"
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getDictionaryItemPage"
    />
    <div v-if="!dictionaryId">点击字典查看详情</div>

    <dictionaryItemForm v-if="dialogName == 'dictionaryItemForm'" :id="propId" :mode="mode" :dictionary-id="dictionaryId" @refresh="getDictionaryItemPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getDictionaryItemPage, deleteDictionaryItem } from '@/api/dictionaryItem'
import dictionaryItemForm from './dictionaryItemForm'

export default {
  components: {
    dictionaryItemForm
  },
  props: {
    dictionaryId: {
      type: String,
      default: null
    }
  },
  data() {
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
      dialogName: ''
    }
  },
  computed: {
    tableConfig() {
      const _this = this
      return {
        search: true,
        reset: true,
        btn: [
          { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' }
        ],
        column: [
          { label: '字典标签', name: 'label', search: true, xType: 'input' },
          { label: '字典值', name: 'value', search: true, xType: 'input' },
          { label: '排序', name: 'sort', xType: 'input' },
          { label: '备注', name: 'remark', xType: 'input' }
        ],
        operate: [
          { text: '编辑', show: true, click: data => _this.operate('edit', data) },
          { text: '删除', show: true, click: _this.del }
        ]
      }
    }
  },
  watch: {
    dictionaryId: {
      handler: function(dictionaryId) {
        if (dictionaryId) {
          this.searchData.dictionaryId = dictionaryId
          this.getDictionaryItemPage()
        }
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    getDictionaryItemPage() {
      this.loading++
      getDictionaryItemPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.list
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'dictionaryItemForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteDictionaryItem(data.id).then(res => {
          this.$message.success('删除成功')
          this.getDictionaryItemPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = ''
    }
  }
}
</script>

<style scoped>

</style>
