<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { deleteApply } from '@/api/actTask'
import { importRules } from '@/utils'
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
      formData: {},
      formDisabled: false,
      dialogTitle: '确认撤销',
      showBtn: true
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        disabled: _this.formDisabled,
        inline: false,
        item: [
          {
            xType: 'input',
            type: 'textarea',
            name: 'deleteReason',
            label: '原因',
            rules: importRules('inputRequired')
          }
        ],
        operate: [
          {
            text: '保存',
            show: _this.showBtn,
            click: _this.deleteApply
          },
          {
            text: '取消',
            show: _this.showBtn,
            click: () => { _this.dialogVisible = false }
          }
        ]
      }
    }
  },
  methods: {
    deleteApply() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        deleteApply(this.id, this.formData.deleteReason).then(res => {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.$emit('refresh')
        }).catch(e => console.log(e)).finally(() => this.loading--)
      })
    }
  }
}
</script>

<style scoped>

</style>
