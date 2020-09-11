<template>
  <div v-loading="loading" class="app-container">
    <el-row :gutter="20">
      <el-col :span="17">
        <x-table
          ref="table"
          v-model="searchData"
          :config="tableConfig"
          :data="tableData"
          :page.sync="page"
          :load="getRolePage"
        />
      </el-col>
      <el-col :span="7">
        <treeSelect :id="propTreeId" :is-batch-auth="isBatchAuth" />
      </el-col>
    </el-row>

    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" @refresh="getRolePage" @close="closeDialog" />
  </div>
</template>

<script>
import { getRolePage, deleteRole } from '@/api/role'
import dForm from './form'
import treeSelect from './treeSelect'
import { importDic } from '@/utils/index'

export default {
  components: {
    dForm,
    treeSelect
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      isBatchAuth: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {},
      propId: '',
      propTreeId: '',
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
        highlightCurrentRow: !_this.isBatchAuth,
        selectionChange: _this.selectChange,
        currentChange: _this.selectChange,
        btn: [
          {
            text: '新增',
            show: _this.checkPermission(['role', 'role.add']),
            click: () => _this.operate('add'),
            icon: 'el-icon-circle-plus'
          },
          {
            text: `${_this.isBatchAuth ? '关闭' : '开启'}批量授权`,
            type: 'warning',
            show: _this.checkPermission(['role', 'role.add']),
            click: () => {
              _this.$refs.table.clearSelection()
              _this.isBatchAuth = !_this.isBatchAuth
              _this.propTreeId = ''
            },
            icon: 'el-icon-s-tools'
          }
        ],
        column: [
          {
            type: 'selection',
            show: _this.isBatchAuth
          },
          {
            label: '名称',
            name: 'name',
            search: true,
            xType: 'input'
          },
          {
            label: '编码',
            name: 'code',
            search: true,
            xType: 'input'
          },
          {
            xType: 'select',
            name: 'orgAdminDisplay',
            label: '机构管理员是否可见',
            width: 150,
            dic: importDic('displayType')
          },
          {
            label: '备注',
            name: 'remark',
            width: 180
          }
        ],
        operate: [
          {
            text: '编辑',
            show: _this.checkPermission(['role', 'role.edit']),
            click: data => _this.operate('edit', data)
          },
          {
            text: '删除',
            show: _this.checkPermission(['role', 'role.del']),
            click: _this.del
          },
          {
            text: '详情',
            show: _this.checkPermission(['role', 'role.find']),
            click: data => _this.operate('detail', data)
          }
        ]
      }
    }
  },
  mounted() {
    this.getRolePage()
  },
  methods: {
    getRolePage() {
      this.loading++
      getRolePage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'dForm'
    },
    selectChange(data) {
      if (this.isBatchAuth && data instanceof Array) {
        this.propTreeId = data.map(item => item.id).join(',')
      }
      if (!this.isBatchAuth && data instanceof Object) {
        this.propTreeId = data?.id
      }
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteRole(data.id).then(res => {
          this.$message.success(res.msg)
          this.getRolePage()
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
