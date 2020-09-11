<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :load="getPermissionTree"
    />
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" :pid="pid" @refresh="getPermissionTree" @close="closeDialog" />
  </div>
</template>

<script>
import { deletePermission, getPermissionTree } from '@/api/permission'
import dForm from './form'
import { importDic } from '../../../../utils'

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
      pid: '',
      dialogName: '',
      mode: ''
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
          {
            text: '新增',
            click: () => _this.operate('add'),
            icon: 'el-icon-circle-plus'
          }
        ],
        column: [
          {
            label: '名称',
            name: 'name',
            search: true,
            xType: 'input',
            align: 'left'
          },
          {
            label: '类型',
            name: 'type',
            search: true,
            xType: 'select',
            width: 100,
            dic: importDic('permissionType')
          },
          {
            label: '权限值',
            name: 'value',
            search: true,
            xType: 'input'
          },
          {
            label: '备注',
            name: 'remark',
            search: true,
            xType: 'input'
          },
          {
            label: '创建时间',
            name: 'createTime'
          }
        ],
        operate: [
          {
            text: '新增',
            show: true,
            click: data => _this.operate('add', data)
          },
          {
            text: '编辑',
            show: true,
            click: data => _this.operate('edit', data)
          },
          {
            text: '删除',
            show: true,
            click: _this.del
          },
          {
            text: '详情',
            show: true,
            click: data => _this.operate('detail', data)
          }
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
    operate(mode, data = {}) {
      if (mode !== 'add') this.propId = data.id
      this.pid = data.id
      this.mode = mode
      this.dialogName = 'dForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deletePermission(data.id).then(res => {
          this.$message.success(res.msg)
          this.getPermissionTree()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = ''
      this.propId = ''
      this.pid = ''
    }
  }
}
</script>

<style scoped>

</style>
