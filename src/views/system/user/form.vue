<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getUserDetail, saveUser } from '@/api/user'
import { getDeptTree } from '@/api/dept'
import { getRoleList } from '@/api/role'
import { importDic, importRules } from '@/utils/index'
export default {
  props: {
    mode: { // edit, detail, add
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
    }
  },
  data() {
    const _this = this
    return {
      loading: 0,
      dialogVisible: true,
      formData: {
        status: 'enable',
        deptId: _this.$store.getters.user.deptId
      },
      deptIdDisabled: true,
      formDisabled: false,
      dialogTitle: '编辑',
      showBtn: true,
      treeData: [],
      roleData: []
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        disabled: _this.formDisabled,
        inline: false,
        item: [
          { xType: 'input', name: 'username', label: '登录名', rules: importRules('inputRequired') },
          { xType: 'input', name: 'name', label: '姓名', rules: importRules('inputRequired') },
          { xType: 'select', type: 'tree', disabled: _this.deptIdDisabled, name: 'deptId', label: '部门', dic: { data: _this.treeData, label: 'name', value: 'id' }, rules: importRules('inputRequired') },
          // { xType: 'select', name: 'roleIdList', label: '角色', multiple: true, dic: { data: _this.roleData, label: 'name', value: 'id' }, rules: importRules('inputRequired') },
          { xType: 'input', name: 'phone', label: '手机号', rules: importRules('inputRequired', 'phone') },
          { xType: 'input', name: 'email', label: '邮箱', rules: importRules('email') },
          { xType: 'select', name: 'sex', label: '性别', dic: importDic('sex'), rules: importRules('selectRequired') },
          // { xType: "text", name: "avatar", label: '头像', rules: importRules("inputRequired") },
          { xType: 'select', name: 'status', label: '状态', dic: importDic('userStatus'), rules: importRules('selectRequired') },
          { xType: 'input', name: 'address', label: '地址' },
          // { xType: "text", name: "password", label: '密码', },
          { xType: 'input', name: 'remark', label: '备注' }
        ],
        operate: [
          { text: '保存', show: _this.showBtn, click: _this.saveUser },
          { text: '取消', show: _this.showBtn, click: () => { _this.dialogVisible = false } }
        ]
      }
    }
  },
  watch: {
    mode: {
      handler: function(mode) {
        if (this.mode === 'add') {
          this.dialogTitle = '新建'
        }
        if (this.mode === 'edit') {
          this.dialogTitle = '编辑'
          this.getUserDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getUserDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.$store.getters.user.isAdmin || this.$store.getters.user.isSuperAdmin) {
      this.deptIdDisabled = false
      this.formData.deptId = ''
    }
    this.getDeptTree()
    this.getRoleList()
  },
  methods: {
    getUserDetail() {
      this.loading++
      getUserDetail(this.id).then(res => {
        // res.roleIdList = res.roleIdList.split(',')
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    getDeptTree() {
      this.loading++
      getDeptTree().then(res => {
        this.treeData = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getRoleList() {
      this.loading++
      getRoleList().then(res => {
        this.roleData = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    saveUser() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        // const copy = JSON.parse(JSON.stringify(this.formData))
        // copy.roleIdList = copy.roleIdList.join(',')
        saveUser(this.formData).then(res => {
          if (this.mode === 'add') {
            this.$alert(`初始化密码为：${res.data}，请及时保存`, '提示', {
              confirmButtonText: '确定'
            })
          }
          this.dialogVisible = false
          this.$emit('refresh')
        }).catch(e => console.error(e)).finally(() => this.loading--)
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style scoped>

</style>
