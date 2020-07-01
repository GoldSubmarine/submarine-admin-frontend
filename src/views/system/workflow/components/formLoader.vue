<template>
  <div class="app-container">
    <el-dialog :fullscreen="/(approve|detail)/.test(mode)" :title="dialogTitle + '（请假申请）'" :width="childVariable.width" :visible.sync="dialogVisible" :close-on-click-modal="false" @closed="$emit('close')">
      <!-- 新增 -->
      <div v-if="mode === 'add'" v-loading="loading">
        <component
          :is="processDefinitionKey"
          ref="xForm"
          class="js-screenshot"
          :mode="mode"
          :process-instance-id="processInstanceId"
          @fill="formData => fillFormData(formData, This)"
          @refresh="$emit('refresh')"
          @close="$emit('close')"
        />
        <el-button style="margin-left: 120px" type="primary" @click="saveFlowLeave">保存</el-button>
        <el-button type="primary" @click="$emit('close')">取消</el-button>
      </div>
      <!-- 审核 -->
      <el-tabs v-else v-model="activeName" type="card">
        <el-tab-pane label="表单数据" name="formDataApprove">
          <div :style="{ width: childVariable.width, margin: '20px auto' }">
            <component
              :is="processDefinitionKey"
              ref="xForm"
              class="js-screenshot edit-history"
              :mode="mode"
              :process-instance-id="processInstanceId"
              @fill="formData => fillFormData(formData, This)"
              @refresh="$emit('refresh')"
              @close="$emit('close')"
            />
            <el-link style="position: relative; top: -24px;float: right" type="primary" @click="showHistory = true">历史记录</el-link>
            <!-- 审批的form -->
            <el-form v-if="mode === 'approve'" ref="approveForm" :model="approveForm" :label-width="childVariable.labelWidth">
              <el-divider />
              <el-form-item label="审批结果：" prop="status" :rules="[ { required: true, message: '请选择', trigger: 'blur,change' } ]">
                <el-radio-group v-model="approveForm.status">
                  <el-radio v-for="item in importDic('TaskApplyStatus')" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="审批意见：" prop="comment" :rules="[ { required: true, message: '请输入', trigger: 'blur' } ]">
                <el-input v-model="approveForm.comment" type="textarea" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="approveFlowLeave">确认审核</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="审批历史" name="flowHistory">
          <historyTimeline :process-instance-id="processInstanceId" :task-definition-key="taskDefinitionKey" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <editHistory v-if="showHistory" :process-instance-id="processInstanceId" @close="showHistory = false" />
  </div>
</template>

<script>
import historyTimeline from '../components/historyTimeline'
import editHistory from '../components/editHistory'
import { importDic } from '../../../../utils'

// 业务组件注册
import flowLeaveForm from '@/views/system/workflow/flowLeave/form'
const busiComponentList = [flowLeaveForm]

const busiComponentObj = {}
busiComponentList.forEach(item => {
  busiComponentObj[item.name] = item
})

const childDefaultConfig = {
  width: '540px',
  labelWidth: '120px'
}

export default {
  components: {
    historyTimeline,
    editHistory,
    ...busiComponentObj
  },
  props: {
    mode: { // add, approve, detail
      type: String,
      required: true
    },
    processDefinitionId: {
      type: String,
      default: null
    },
    processDefinitionKey: {
      type: String,
      default: null
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
    }
  },
  data() {
    return {
      This: this,
      loading: 0,
      activeName: 'formDataApprove',
      dialogVisible: true,
      showHistory: false,
      originFormDataCache: {},
      approveForm: {}
    }
  },
  computed: {
    dialogTitle() {
      let result
      switch (this.mode) {
        case 'add': result = '填报'
          break
        case 'approve': result = '核准'
          break
        case 'detail': result = '详情'
          break
      }
      return result
    },
    childVariable() {
      const data = busiComponentObj[this.processDefinitionKey]['parentVariable'] ?? {}
      const result = {}
      Object.assign(result, childDefaultConfig, data)
      return result
    }
  },
  methods: {
    importDic: importDic,
    saveFlowLeave() {
      this.$refs['xForm'].$emit('add')
    },
    approveFlowLeave() {
      this.$refs['approveForm'].validate().then(() => {
        this.$refs['xForm'].$emit('approve')
      })
    },
    fillFormData(formData, _this) {
      Object.assign(formData, _this.approveForm)
      formData.processDefinitionId = _this.processDefinitionId
      formData.processInstanceId = _this.processInstanceId
      formData.taskId = _this.taskId
      return formData
    }
  }
}
</script>

<style scoped>
.edit-history {
  margin-bottom: 40px;
  max-width: 800px;
}
</style>

