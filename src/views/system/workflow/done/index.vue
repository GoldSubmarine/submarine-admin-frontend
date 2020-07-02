<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getDonePage"
    />
    <formLoader
      v-if="dialogName == 'formLoader'"
      :process-definition-key="processDefinitionKey"
      :process-instance-id="processInstanceId"
      :task-definition-key="taskDefinitionKey"
      :process-definition-id="processDefinitionId"
      :task-id="taskId"
      mode="detail"
      @refresh="getDonePage"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import { getDonePage } from '@/api/actTask'
import { importDic } from '@/utils'
import formLoader from '../components/formLoader'

export default {
  components: { formLoader },
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
            name: 'endTime',
            label: '审核时间'
          }
        ],
        operate: [
          {
            text: '详情',
            show: _this.checkPermission(['workflowTask.find']),
            click: _this.showInstance
          }
        ]
      }
    }
  },
  mounted() {
    this.getDonePage()
  },
  methods: {
    getDonePage() {
      this.loading++
      getDonePage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
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
      this.dialogName = 'formLoader'
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
