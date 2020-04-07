<template>
  <div v-loading="loading" class="app-container">
    <el-dialog title="日志" :visible.sync="dialogVisible" width="1220px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-table
        v-model="searchData"
        :config="tableConfig"
        :data="tableData"
        :page.sync="page"
        :load="findLogByPage"
      >
        <template #detail="scope">
          <el-button v-if="scope.row.detail" type="text" @click="showDetail(scope.row.detail)">查看详情</el-button>
        </template>
        <template #status="scope">
          <el-tag :type="scope.row.status==='success' ? 'success' : 'danger'">{{ filterDic('QuartzLogStatusType', scope.row.status) }}</el-tag>
        </template>
      </x-table>
    </el-dialog>
    <el-dialog title="错误信息" :visible.sync="detailVisible" width="940px" :before-close="done => { detail = ''; done() }">
      <pre style="width: 100%; white-space: pre-wrap">{{ detail }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import { findLogByPage } from '@/api/quartzJob'
import { importDic, filterDic } from '../../../../utils'

export default {
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
      dialogName: '',
      dialogVisible: true,
      detailVisible: false,
      detail: ''
    }
  },
  computed: {
    tableConfig() {
      return {
        stripe: true,
        search: true,
        reset: true,
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
            search: false,
            xType: 'input'
          },
          {
            name: 'methodName',
            label: '方法名称',
            search: false,
            xType: 'input'
          },
          {
            name: 'params',
            label: '参数'
          },
          {
            name: 'cronExpression',
            label: 'cron表达式',
            width: 100
          },
          {
            name: 'status',
            label: '状态',
            search: 'true',
            xType: 'select',
            width: 100,
            dic: importDic('all', 'QuartzLogStatusType'),
            slot: true
          },
          {
            name: 'time',
            label: '耗时(秒)',
            width: 100,
            search: 'true',
            placeholder: '请输入要大于的数值',
            xType: 'input',
            formatter: (row, column, cellValue) => {
              if (cellValue !== 0) {
                return cellValue / 1000
              }
              return cellValue
            }
          },
          {
            name: 'detail',
            label: '错误详情',
            width: 100,
            slot: true
          },
          {
            name: 'createTime',
            label: '创建时间'
          }
        ]
      }
    }
  },
  mounted() {
    this.findLogByPage()
  },
  methods: {
    filterDic: filterDic,
    showDetail(detail) {
      this.detail = detail
      this.detailVisible = true
    },
    findLogByPage() {
      this.loading++
      findLogByPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.records
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style scoped>

</style>
