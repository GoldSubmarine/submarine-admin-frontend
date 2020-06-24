<template>
  <div class="app-container">
    <el-dialog :fullscreen="mode === 'approve'" :title="dialogTitle + '（请假申请）'" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <div v-if="mode === 'add'">
        <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
        <el-button style="margin-left: 120px" type="primary" @click="saveFlowLeave">保存</el-button>
        <el-button type="primary" @click="$emit('close')">取消</el-button>
      </div>
      <el-row v-else :gutter="20">
        <el-col :span="14">
          <el-card class="approve-box-card">
            <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
            <approveForm ref="approveForm" :data.sync="approveForm" />
            <div style="margin: 0 0 30px 120px">
              <el-button type="primary" @click="approveFlowLeave">确认审核</el-button>
              <el-link style="float: right" type="primary" @click="showHistory = true">历史记录</el-link>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <historyTimeline :process-instance-id="processInstanceId" :task-definition-key="taskDefinitionKey" />
        </el-col>
      </el-row>
    </el-dialog>
    <editHistory v-if="showHistory" :process-instance-id="processInstanceId" @close="handleClose" />
  </div>
</template>

<script>
import { getFlowLeaveDetailByProcessInstanceId, saveFlowLeave, approveFlowLeave } from '@/api/flowLeave'
import { importRules } from '@/utils/index'
import historyTimeline from '../components/historyTimeline'
import approveForm from '../components/approveForm'
import editHistory from '../components/editHistory'
import { getScreenshot, isEdited } from '../components/util'
export default {
  formKey: 'Leave',
  components: { historyTimeline, approveForm, editHistory },
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
      showHistory: false,
      originFormDataCache: {},
      formData: {},
      approveForm: {},
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
        this.originFormDataCache = JSON.parse(JSON.stringify(res))
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveFlowLeave() {
      this.$refs['xForm'].validate().then(async() => {
        const copy = await this.handleData()
        this.loading++
        saveFlowLeave(copy).then(res => {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.$emit('refresh')
        }).catch(e => console.error(e)).finally(() => this.loading--)
      })
    },
    approveFlowLeave() {
      this.$refs['approveForm'].validate().then(() => {
        this.$refs['xForm'].validate().then(async() => {
          const copy = await this.handleData()
          this.loading++
          approveFlowLeave(copy).then(res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.$emit('refresh')
          }).catch(e => console.error(e)).finally(() => this.loading--)
        })
      })
    },
    async handleData() {
      const copy = { ...this.formData, ...this.approveForm }
      copy.endTime = copy.beginTime[1]
      copy.beginTime = copy.beginTime[0]
      copy.processDefinitionId = this.processDefinitionId
      copy.processInstanceId = this.processInstanceId
      copy.taskId = this.taskId
      if (isEdited(this.originFormDataCache, copy)) {
        copy.img = await getScreenshot()
      }
      return copy
    },
    handleClose() {
      this.showHistory = false
    }
  }
}
</script>

<style scoped>

</style>
