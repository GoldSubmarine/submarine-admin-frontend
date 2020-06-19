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
    <reason v-if="dialogName == 'reason'" :id="propId" @refresh="getApplyPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getApplyPage } from '@/api/actTask'
import { importDic, filterDic } from '@/utils'
import reason from './reason'

export default {
  components: { reason },
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
      propId: ''
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
            label: '任务名称'
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
      this.propId = data.processInstanceId
      this.dialogName = 'reason'
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
