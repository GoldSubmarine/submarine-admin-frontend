<template>
  <div class="app-container">
    <el-dialog fullscreen :title="dialogTitle + '（请假申请）'" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getLeaveFlowDetail, saveLeaveFlow } from '@/api/leaveFlow'
import { importRules } from '@/utils/index'
export default {
  props: {
    mode: { // add, approve
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
    },
    processDefinitionId: {
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
        processDefinitionId: _this.processDefinitionId
      },
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
        item: [
          {
            xType: 'datePicker',
            type: 'datetimerange',
            name: 'beginTime',
            label: '时间',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'duration',
            label: '时长',
            rules: importRules('floatGtZero', 'inputRequired')
          },
          {
            xType: 'input',
            type: 'textarea',
            name: 'reason',
            label: '请假原因'
          },
          {
            xType: 'input',
            name: 'remark',
            type: 'textarea',
            label: '备注'
          }
        ],
        operate: [
          {
            text: '保存',
            show: _this.showBtn,
            click: _this.saveLeaveFlow
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
  watch: {
    mode: {
      handler: function(mode) {
        if (this.mode === 'add') {
          this.dialogTitle = '填报'
        }
        if (this.mode === 'approve') {
          this.dialogTitle = '核准'
          this.getLeaveFlowDetail()
        }
      },
      immediate: true
    }
  },
  methods: {
    getLeaveFlowDetail() {
      this.loading++
      getLeaveFlowDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveLeaveFlow() {
      this.$refs['xForm'].validate().then(() => {
        const copy = JSON.parse(JSON.stringify(this.formData))
        copy.endTime = copy.beginTime[1]
        copy.beginTime = copy.beginTime[0]
        this.loading++
        saveLeaveFlow(copy).then(res => {
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
