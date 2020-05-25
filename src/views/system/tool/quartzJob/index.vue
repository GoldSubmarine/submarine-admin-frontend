<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getQuartzJobPage"
    >
      <template #status="scope">
        <el-tag :type="scope.row.status==='enable' ? 'success' : 'warning'">{{ filterDic('QuartzJobStatusType', scope.row.status) }}</el-tag>
      </template>
    </x-table>
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" @refresh="getQuartzJobPage" @close="closeDialog" />
    <log v-if="dialogName == 'log'" @close="closeDialog" />
  </div>
</template>

<script>
import { getQuartzJobPage, deleteQuartzJob, changeQuartzJobStatus, runQuartzJob } from '@/api/quartzJob'
import dForm from './form'
import log from './log'
import { importDic, filterDic } from '../../../../utils'

export default {
  components: {
    dForm,
    log
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {},
      propId: '',
      dialogName: ''
    }
  },
  computed: {
    tableConfig() {
      const _this = this
      return {
        stripe: true,
        search: true,
        reset: true,
        btn: [
          { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' },
          { text: '日志', click: () => { _this.dialogName = 'log' }, icon: 'el-icon-document', type: 'info' }
        ],
        column: [
          {
            name: 'jobName',
            label: '任务名称',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'beanName',
            label: 'bean名称',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'methodName',
            label: '方法名称',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'params',
            label: '方法参数'
          },
          {
            name: 'cronExpression',
            label: 'cron表达式'
          },
          {
            name: 'status',
            label: '状态',
            search: 'true',
            xType: 'select',
            slot: true,
            dic: importDic('all', 'QuartzJobStatusType')
          },
          {
            name: 'remark',
            label: '备注'
          }
        ],
        operate: [
          {
            text: '编辑',
            show: _this.checkPermission(['quartzJob', 'quartzJob.edit']),
            click: data => _this.operate('edit', data)
          },
          {
            text: '执行',
            show: true,
            click: data => { _this.runQuartzJob(data) }
          },
          {
            text: '删除',
            show: _this.checkPermission(['quartzJob', 'quartzJob.del']),
            click: _this.del
          },
          {
            text: '停用',
            show: data => data.status === 'enable',
            click: data => { _this.changeQuartzJobStatus(data, 'disable') }
          },
          {
            text: '启用',
            show: data => data.status === 'disable',
            click: data => { _this.changeQuartzJobStatus(data, 'enable') }
          }
        ]
      }
    }
  },
  mounted() {
    this.getQuartzJobPage()
  },
  methods: {
    filterDic: filterDic,
    getQuartzJobPage() {
      this.loading++
      getQuartzJobPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'dForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteQuartzJob(data.id).then(res => {
          this.$message.success(res.msg)
          this.getQuartzJobPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    changeQuartzJobStatus(data, status) {
      this.loading++
      changeQuartzJobStatus(data.id, status).then(res => {
        this.$message.success(res.msg)
        this.getQuartzJobPage()
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    runQuartzJob(data) {
      this.loading++
      runQuartzJob(data.id).then(res => {
        this.$message.success(res.msg)
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    closeDialog() {
      this.dialogName = ''
    }
  }
}
</script>

<style scoped>

</style>
