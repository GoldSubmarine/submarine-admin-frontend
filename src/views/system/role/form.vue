<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getRoleDetail, saveRole } from '@/api/role'
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
    return {
      loading: 0,
      dialogVisible: true,
      formData: {},
      formDisabled: false,
      dialogTitle: '编辑',
      showBtn: true
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        disabled: _this.formDisabled,
        inline: false,
        items: [
          { type: 'text', name: 'name', label: '名称（中文）', rules: _this.importRules('inputRequired') },
          { type: 'text', name: 'code', label: '编码' },
          { type: 'text', name: 'remark', label: '备注' }
        ],
        operate: [
          { text: '保存', show: _this.showBtn, click: _this.saveRole },
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
          this.getRoleDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getRoleDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    getRoleDetail() {
      this.loading++
      getRoleDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveRole() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        saveRole(this.formData).then(res => {
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
