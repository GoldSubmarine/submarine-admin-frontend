<template>
  <div v-loading="loading" class="app-container delegate-container">
    <el-dialog title="选择委派人" :visible.sync="dialogVisible" width="920px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-table
        ref="xTable"
        v-model="searchData"
        :config="tableConfig"
        :data="tableData"
        :page.sync="page"
        :load="getUserPage"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delegateTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delegateTask } from '@/api/actTask'
import { getUserPage } from '@/api/user'
import { importDic } from '@/utils/index'

export default {
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      searchData: {},
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      selectUser: '',
      dialogVisible: true
    }
  },
  computed: {
    tableConfig() {
      const _this = this
      return {
        search: true,
        reset: true,
        rowClick: (row) => {
          _this.selectUser = row
          _this.$refs.xTable.clearSelection()
          _this.$refs.xTable.toggleRowSelection(row)
        },
        select: (selection, row) => {
          _this.selectUser = row
          _this.$refs.xTable.clearSelection()
          _this.$refs.xTable.toggleRowSelection(row)
          _this.$refs.xTable.setCurrentRow(row)
        },
        column: [
          {
            type: 'selection',
            disabled: true,
            selectable: (row) => {
              return true
            }
          },
          { label: '登录名', name: 'username', search: true, xType: 'input' },
          { label: '姓名', name: 'name', search: true, xType: 'input' },
          { label: '部门', name: 'deptName', search: true, xType: 'input' },
          { label: '手机号', name: 'phone', search: true, xType: 'input' },
          { label: '邮箱', name: 'email', search: true, xType: 'input' },
          { label: '性别', name: 'sex', dic: importDic('sex') }
        ]
      }
    }
  },
  mounted() {
    this.getUserPage()
  },
  methods: {
    getUserPage() {
      this.loading++
      getUserPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.selectUser = {}
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    delegateTask() {
      if (!this.selectUser.id) {
        this.$message.info('请选择人员')
        return
      }
      this.loading++
      delegateTask(this.taskId, this.selectUser.id).then(res => {
        this.$message.success(res.msg)
        this.$emit('refresh')
        this.dialogVisible = false
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style>
.delegate-container .el-table__header-wrapper .el-checkbox{
	display:none
}
</style>
