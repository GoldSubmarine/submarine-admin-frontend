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
        <el-tag :type="scope.row.suspended ? 'danger' : 'success'">{{ scope.row.suspended ? '已挂起' : '进行中' }}</el-tag>
      </template>
    </x-table>
    <formLoader v-if="dialogName == 'formLoader'" :form-key="formKey" :process-instance-id="processInstanceId" :task-definition-key="taskDefinitionKey" :process-definition-id="processDefinitionId" :task-id="taskId" mode="approve" @refresh="getTodoPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getTodoPage, getFormKey } from '@/api/actTask'
import { importDic } from '@/utils'
import formLoader from '../components/formLoader'

export default {
  components: { formLoader },
  data() {
    return {
      loading: 0,
      tableData: [],
      dialogName: '',
      formKey: '',
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {
        lastVersion: true
      },
      taskDefinitionKey: '',
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
            name: 'processDefinitionKey',
            label: '任务名称',
            formatter: (row) => {
              return row.processVariables.processDefinitionName
            }
          },
          {
            name: 'category',
            label: '分类',
            search: 'true',
            xType: 'select',
            dic: importDic('all').concat(_this.$store.getters.dic.processCategory)
          },
          {
            name: 'applyName',
            label: '申请人',
            formatter: (row) => {
              return row.processVariables.applyUserName
            }
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
            show: _this.checkPermission(['actProcess.del']),
            click: _this.showInstance
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
      this.taskDefinitionKey = data.taskDefinitionKey
      this.taskId = data.id
      getFormKey(this.processDefinitionId, this.taskDefinitionKey).then(res => {
        this.formKey = res
        this.dialogName = 'formLoader'
      })
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
