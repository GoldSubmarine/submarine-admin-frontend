<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getDictionaryPage"
    />
    <dictionaryForm v-if="dialogName == 'dictionaryForm'" :id="propId" :mode="mode" @refresh="getDictionaryPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getDictionaryPage, deleteDictionary } from '@/api/dictionary'
import dictionaryForm from './dictionaryForm'

export default {
  components: {
    dictionaryForm
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
      searchData: {},
      propId: '',
      dialogName: ''
    }
  },
  computed: {
    tableConfig() {
      const _this = this
      return {
        // index: false,
        search: true,
        reset: true,
        stripe: false,
        highlightCurrentRow: true,
        rowClick: node => _this.$emit('cellClick', node),
        btn: [
          { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' }
        ],
        column: [
          { label: '字典名', name: 'name', search: true, xType: 'input' },
          { label: '备注', name: 'remark', search: true, xType: 'input' }
        ],
        operate: [
          { text: '编辑', show: true, click: data => _this.operate('edit', data) },
          { text: '删除', show: true, click: _this.del }
        ]
      }
    }
  },
  mounted() {
    this.getDictionaryPage()
  },
  methods: {
    getDictionaryPage() {
      this.loading++
      getDictionaryPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.list
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'dictionaryForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteDictionary(data.id).then(res => {
          this.$message.success('删除成功')
          this.getDictionaryPage()
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
