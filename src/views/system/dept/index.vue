<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :load="getDeptTree"
    />
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" @refresh="getDeptTree" @close="closeDialog" />
  </div>
</template>

<script>
import { getDeptTree, deleteDept } from '@/api/dept'
import dForm from './form'

export default {
  components: {
    dForm
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      searchData: {},
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
        rowKey: 'id',
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        btn: [
          { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' }
        ],
        column: [
          { label: '名称', name: 'name', align: 'left', search: true, xType: 'input' },
          { label: '编码', name: 'code', search: true, xType: 'input' },
          { label: '备注', name: 'remark', search: true, xType: 'input' },
          { label: '创建时间', name: 'createTime' }
        ],
        operate: [
          { text: '编辑', show: true, click: data => _this.operate('edit', data) },
          { text: '删除', show: true, click: _this.del },
          { text: '详情', show: true, click: data => _this.operate('detail', data) }
        ]
      }
    }
  },
  mounted() {
    this.getDeptTree()
  },
  methods: {
    getDeptTree() {
      this.loading++
      getDeptTree(this.searchData).then(res => {
        this.tableData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'dForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteDept(data.id).then(res => {
          this.$message.success('删除成功')
          this.getDeptTree()
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
