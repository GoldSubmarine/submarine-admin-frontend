<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :load="getPermissionTree"
    />
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" :is-module="isModule" @refresh="getPermissionTree" @close="closeDialog" />
  </div>
</template>

<script>
import { deletePermission, getPermissionTree } from '@/api/permission'
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
      dialogName: '',
      mode: '',
      isModule: false
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
          { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' },
          { text: '新增模块', click: () => _this.operate('add', '', true), icon: 'el-icon-circle-plus' }
        ],
        column: [
          { label: '名称', name: 'name', search: true, xType: 'input', align: 'left' },
          { label: '权限值', name: 'value', search: true, xType: 'input' },
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
    this.getPermissionTree()
  },
  methods: {
    getPermissionTree() {
      this.loading++
      getPermissionTree(this.searchData).then(res => {
        this.tableData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data, isModule) {
      if (mode !== 'add') this.propId = data.id
      this.isModule = Boolean(isModule)
      this.mode = mode
      this.dialogName = 'dForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deletePermission(data.id).then(res => {
          this.$message.success('删除成功')
          this.getPermissionTree()
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
