<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getTodoPage"
    >
      <template #suspended="scope">
        <el-tag :type="getStatus(scope.row).type">{{ getStatus(scope.row).word }}</el-tag>
      </template>
    </x-table>
    <formLoader
      v-if="dialogName == 'formLoader'"
      :process-definition-key="processDefinitionKey"
      :process-instance-id="processInstanceId"
      :task-definition-key="taskDefinitionKey"
      :process-definition-id="processDefinitionId"
      :task-id="taskId"
      mode="approve"
      @refresh="getTodoPage"
      @close="closeDialog"
    />
    <delegateForm v-if="dialogName == 'delegateForm'" :task-id="taskId" @refresh="getTodoPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getTodoPage, claimTask } from '@/api/actTask'
import { importDic } from '@/utils'
import formLoader from '../components/formLoader'
import delegateForm from './delegate'

export default {
  components: { formLoader, delegateForm },
  data() {
    return {
      loading: 0,
      tableData: [],
      dialogName: '',
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {
        lastVersion: true
      },
      taskDefinitionKey: '',
      processDefinitionKey: '',
      processInstanceId: '',
      taskId: ''
    }
  },
  computed: {
    tableConfig() {
      const _this = this
      return {
        stripe: true,
        search: true,
        reset: true,
        column: [
          {
            name: 'processDefinitionName',
            label: '任务名称',
            search: true,
            xType: 'input'
          },
          {
            name: 'processDefinitionCategory',
            label: '分类',
            search: 'true',
            xType: 'select',
            dic: importDic('all').concat(_this.$store.getters.dic.processCategory)
          },
          {
            name: 'applyUserName',
            label: '申请人'
          },
          {
            name: 'suspended',
            label: '状态',
            slot: true
          },
          {
            name: 'createTime',
            label: '创建时间'
          }
        ],
        operate: [
          {
            text: '办理',
            show: data => _this.checkPermission(['workflowTask.find']) && data.assigneeId,
            click: _this.showInstance
          },
          {
            text: '签收',
            show: data => _this.checkPermission(['workflowTask.claim']) && !data.assigneeId,
            click: _this.claimTask
          },
          {
            text: '委托',
            show: data => _this.checkPermission(['workflowTask.delegate']) && data.assigneeId,
            click: _this.delegateTask
          }
        ]
      }
    }
  },
  mounted() {
    this.getTodoPage()
  },
  methods: {
    getTodoPage() {
      this.loading++
      getTodoPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    showInstance(data) {
      this.processInstanceId = data.processInstanceId
      this.processDefinitionId = data.processDefinitionId
      this.processDefinitionKey = data.processDefinitionKey
      this.taskDefinitionKey = data.taskDefinitionKey
      this.taskId = data.id
      this.mode = 'approve'
      this.dialogName = 'formLoader'
    },
    claimTask(row) {
      this.commonConfirm('确认签收该任务？').then(res => {
        this.loading++
        claimTask(row.id).then(res => {
          this.$message.success(res.msg)
          this.getTodoPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      })
    },
    delegateTask(row) {
      this.taskId = row.id
      this.dialogName = 'delegateForm'
    },
    getStatus(row) {
      let word = ''
      let type = ''
      if (row.suspended) {
        word = '已挂起'
        type = 'danger'
      } else if (!row.assigneeId) {
        word = '待签收'
        type = 'warning'
      } else {
        word = '办理中'
        type = 'success'
      }
      return { word, type }
    },
    closeDialog() {
      this.dialogName = ''
    }
  }
}
</script>

<style>
.approve-box-card {
  padding-top: 20px;
}
</style>
