<template>
  <div v-loading="loading" class="app-container">
    <h3>基本信息</h3>
    <el-divider />
    <x-form ref="xForm" v-model="formData" :config="formConfig" />
    <h3>安全设置</h3>
    <el-divider />
    <el-form label-width="120px">
      <el-form-item label="密码：">
        <el-button type="text" @click="dialogName = 'changePass'">修改密码</el-button>
      </el-form-item>
    </el-form>

    <changePass v-if="dialogName == 'changePass'" @close="closeDialog" />
  </div>
</template>

<script>
import { getUserDetail, saveUser } from '@/api/user'
import store from '@/store'
import changePass from './changePass'
import { importDic, importRules } from '@/utils/index'
export default {
  components: {
    changePass
  },
  data() {
    return {
      loading: 0,
      formData: {
        status: 'enable'
      },
      dialogName: '',
      formDisabled: false,
      showBtn: true,
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
          { xType: 'input', name: 'username', label: '登录名', disabled: true },
          { xType: 'input', name: 'name', label: '姓名', rules: importRules('inputRequired') },
          { xType: 'input', name: 'deptName', label: '部门', disabled: true },
          { xType: 'input', name: 'phone', label: '手机号', rules: importRules('inputRequired', 'phone') },
          { xType: 'input', name: 'email', label: '邮箱', rules: importRules('email') },
          { xType: 'select', name: 'sex', label: '性别', dic: importDic('sex'), rules: importRules('selectRequired') },
          // { xType: "text", name: "avatar", label: '头像', rules: importRules("inputRequired") },
          { xType: 'input', type: 'textarea', name: 'address', label: '地址' },
          { xType: 'input', name: 'createTime', label: '注册时间', disabled: true }
        ],
        operate: [
          { text: '更新信息', show: _this.showBtn, click: _this.saveUser }
        ]
      }
    }
  },
  mounted() {
    this.getUserDetail()
  },
  methods: {
    getUserDetail() {
      this.loading++
      getUserDetail(store.getters.userId).then(res => {
        res.roleIdList = res.roleIdList.split(',')
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveUser() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        const copy = JSON.parse(JSON.stringify(this.formData))
        copy.roleIdList = copy.roleIdList.join(',')
        saveUser(copy).then(res => {
          this.$emit('refresh')
        }).catch(e => console.error(e)).finally(() => this.loading--)
      }).catch(e => console.error(e))
    },
    closeDialog() {
      this.dialogName = ''
    }
  }
}
</script>

<style scoped>

</style>
