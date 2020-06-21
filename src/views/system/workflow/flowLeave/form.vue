<template>
  <div class="app-container">
    <el-dialog fullscreen :title="dialogTitle + '（请假申请）'" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
      <historyTimeline v-if="mode === 'approve'" :process-definition-id="processDefinitionId" :end-activity-id="endActivityId" />
    </el-dialog>
  </div>
</template>

<script>
import { getFlowLeaveDetailByProcessInstanceId, saveFlowLeave } from '@/api/flowLeave'
import { importRules } from '@/utils/index'
import historyTimeline from '../components/historyTimeline'
export default {
  components: { historyTimeline },
  props: {
    mode: { // add, approve
      type: String,
      required: true
    },
    processInstanceId: {
      type: String,
      default: null
    },
    endActivityId: {
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
            click: _this.saveFlowLeave
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
          this.getFlowLeaveDetailByProcessInstanceId()
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.processInstanceId) {
      this.getFlowLeaveDetailByProcessInstanceId()
    }
  },
  methods: {
    getFlowLeaveDetailByProcessInstanceId() {
      this.loading++
      getFlowLeaveDetailByProcessInstanceId(this.processInstanceId).then(res => {
        res.beginTime = [res.beginTime, res.endTime]
        delete res.endTime
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveFlowLeave() {
      this.$refs['xForm'].validate().then(() => {
        const copy = JSON.parse(JSON.stringify(this.formData))
        copy.endTime = copy.beginTime[1]
        copy.beginTime = copy.beginTime[0]
        this.loading++
        saveFlowLeave(copy).then(res => {
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
