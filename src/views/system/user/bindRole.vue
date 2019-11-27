<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getUserDetail, bindRole } from '@/api/user'
import { getRoleList } from '@/api/role'
import { importRules } from '@/utils/index'
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      dialogVisible: true,
      formData: {
        status: 'enable'
      },
      formDisabled: false,
      dialogTitle: '绑定角色',
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
          { xType: 'select', name: 'roleIds', label: '角色', multiple: true, dic: { data: _this.roleData, label: 'name', value: 'id' }, rules: importRules('inputRequired') }
        ],
        operate: [
          { text: '保存', show: _this.showBtn, click: _this.bindRole },
          { text: '取消', show: _this.showBtn, click: () => { _this.dialogVisible = false } }
        ]
      }
    }
  },
  mounted() {
    this.getRoleList()
    this.getUserDetail()
  },
  methods: {
    getUserDetail() {
      this.loading++
      getUserDetail(this.id).then(res => {
        res.roleIds = res.roleIds.split(',')
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    getRoleList() {
      this.loading++
      getRoleList().then(res => {
        this.roleData = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    bindRole() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        bindRole({ id: this.id, roleIds: this.formData.roleIds }).then(res => {
          this.$message.success(res.msg)
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
