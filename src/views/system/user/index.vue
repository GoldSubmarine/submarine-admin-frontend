<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getUserPage"
    />
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" @refresh="getUserPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getUserPage, deleteUser, resetPass } from '@/api/user'
import dForm from './form'

export default {
  components: {
    dForm
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
        search: true,
        reset: true,
        btn: [
          { text: '新增', show: _this.checkPermission(['user', 'user.add']), click: () => _this.operate('add'), icon: 'el-icon-circle-plus' }
        ],
        column: [
          { type: 'index', index: a => { console.log(a); return a * 2 } },
          { label: '登录名', name: 'username', search: true, xType: 'input' },
          { label: '姓名', name: 'name', search: true, xType: 'input' },
          { label: '部门', name: 'deptName', search: true, xType: 'input' },
          { label: '手机号', name: 'phone', search: true, xType: 'input' },
          { label: '邮箱', name: 'email', search: true, xType: 'input' },
          { label: '性别', name: 'sex', dic: _this.importDic('sex') },
          { label: '状态', name: 'status', dic: _this.importDic('all', 'userStatus'), search: true, xType: 'select' },
          { label: '地址', name: 'address', search: true, xType: 'input' },
          { label: '备注', name: 'remark' }
        ],
        operate: [
          { text: '编辑', show: _this.checkPermission(['user', 'user.edit']), click: data => _this.operate('edit', data) },
          { text: '删除', show: _this.checkPermission(['user', 'user.del']), click: _this.del },
          { text: '重置密码', show: _this.checkPermission(['user', 'user.reset']), click: _this.resetPass },
          { text: '详情', show: _this.checkPermission(['user', 'user.find']), click: data => _this.operate('detail', data) }
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
        this.tableData = res.list
        this.page.total = res.total
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
        deleteUser(data.id).then(res => {
          this.$message.success('删除成功')
          this.getUserPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    resetPass(data) {
      this.commonConfirm(`确认重置 ${data.username} 的密码？`).then(() => {
        this.loading++
        resetPass(data.id).then(res => {
          this.$message.success('重置成功')
          this.$alert(`重置密码为：${res}，请及时保存`, '提示', {
            confirmButtonText: '确定'
          })
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
