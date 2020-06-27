<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getApplyPage"
    >
      <template #status="scope">
        <el-tag :type="getStatusTagType(scope.row.status)">{{ filterDic('ApplyStatus', scope.row.status) }}</el-tag>
      </template>
    </x-table>
    <reason
      v-if="dialogName == 'reason'"
      :id="processInstanceId"
      @refresh="getApplyPage"
      @close="closeDialog"
    />
    <formLoader
      v-if="dialogName == 'formLoader'"
      :mode="mode"
      :process-instance-id="processInstanceId"
      :process-definition-id="processDefinitionId"
      :process-definition-key="processDefinitionKey"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import { getApplyPage } from '@/api/actTask'
import { importDic, filterDic } from '@/utils'
import reason from './reason'
import formLoader from '../components/formLoader'

export default {
  components: { reason, formLoader },
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
      processInstanceId: '',
      processDefinitionId: '',
      processDefinitionKey: ''
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
            name: 'processDefinitionVersion',
            label: '版本'
          },
          {
            name: 'status',
            label: '状态',
            slot: true
          },
          {
            name: 'startTime',
            label: '创建时间'
          },
          {
            name: 'endTime',
            label: '结束时间'
          }
        ],
        operate: [
          {
            text: '撤销',
            show: data => _this.checkPermission(['actProcess.del']) && data.status === 'process',
            click: _this.del
          },
          {
            text: '详情',
            show: _this.checkPermission(['actProcess.del']),
            click: _this.detail
          }
        ]
      }
    }
  },
  mounted() {
    this.getApplyPage()
  },
  methods: {
    filterDic: filterDic,
    getApplyPage() {
      this.loading++
      getApplyPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    getStatusTagType(status) {
      if (status === 'process') return 'success'
      if (status === 'done') return ''
      if (status === 'abandon') return 'danger'
    },
    del(data) {
      this.processInstanceId = data.processInstanceId
      this.dialogName = 'reason'
    },
    detail(data) {
      this.processDefinitionKey = data.processDefinitionKey
      this.processDefinitionId = data.processDefinitionId
      this.processInstanceId = data.processInstanceId
      this.mode = 'detail'
      this.dialogName = 'formLoader'
    },
    closeDialog() {
      this.dialogName = ''
    }
  }
}
</script>

<style>
.resource-class .el-message-box__content{
  max-height: 400px;
  overflow-y: auto;
}
.resource-middle-class .el-message-box__content{
  text-align: center;
  max-height: 400px;
  overflow-y: auto;
}
</style>
