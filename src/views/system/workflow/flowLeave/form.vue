<template>
  <div class="app-container">
    <el-dialog :fullscreen="mode === 'approve'" :title="dialogTitle + '（请假申请）'" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form v-if="mode === 'add'" ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
      <el-row v-else :gutter="20">
        <el-col :span="14">
          <el-card class="approve-box-card">
            <x-form ref="xForm2" v-model="formData" v-loading="loading" :config="formConfig" />
          </el-card>
        </el-col>
        <el-col :span="10">
          <historyTimeline :process-instance-id="processInstanceId" :task-definition-key="taskDefinitionKey" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { getFlowLeaveDetailByProcessInstanceId, saveFlowLeave, approveFlowLeave } from '@/api/flowLeave'
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
    taskId: {
      type: String,
      default: null
    },
    taskDefinitionKey: {
      type: String,
      default: null
    },
    processDefinitionId: {
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
        itemStyle: 'width: 100%;',
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
          },
          {
            xType: 'input',
            name: 'comment',
            type: 'textarea',
            show: _this.mode === 'approve',
            label: '审批建议'
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
      console.log(this.$refs['xForm'])
      this.$refs['xForm'].validate().then(async() => {
        const copy = JSON.parse(JSON.stringify(this.formData))
        copy.endTime = copy.beginTime[1]
        copy.beginTime = copy.beginTime[0]
        copy.processDefinitionId = this.processDefinitionId
        copy.processInstanceId = this.processInstanceId
        copy.taskId = this.taskId
        const imgData = await html2canvas(this.$refs['xForm'], {
          useCORS: true,
          backgroundColor: null
        })
        copy.img = 'data:image/png;base64,' + imgData.toDataURL()
        this.loading++
        let promise
        if (this.mode === 'approve') {
          promise = approveFlowLeave(copy)
        } else {
          promise = saveFlowLeave(copy)
        }
        promise.then(res => {
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
