<template>
  <div class="block">
    <x-table
      :config="tableConfig"
      :data="historyOperateList"
      :load="getHistoryOperate"
    >
      <template #approveStatus="scope">
        <el-tag v-if="scope.row.approveStatus" :type="scope.row.approveStatus === 'reject' ? 'danger' : 'success'">
          {{ filterDic('TaskApplyStatus', scope.row.approveStatus) }}
        </el-tag>
      </template>
      <template #status="scope">
        <el-tag :type="scope.row.endTime ? 'success' : 'info'">
          {{ scope.row.endTime ? '已处理' : '待处理' }}
        </el-tag>
      </template>
    </x-table>
  </div>
</template>

<script>
import { getHistoryOperate } from '@/api/actTask'
import { filterDic } from '../../../../utils'
export default {
  props: {
    processInstanceId: {
      type: String,
      required: true
    },
    taskDefinitionKey: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      historyOperateList: []
    }
  },
  computed: {
    tableConfig() {
      return {
        stripe: true,
        search: false,
        reset: false,
        column: [
          {
            name: 'name',
            label: '任务名称'
          },
          {
            name: 'assigneeName',
            label: '处理人'
          },
          {
            name: 'approveStatus',
            label: '处理结果',
            slot: true
          },
          {
            name: 'comment',
            label: '处理意见'
          },
          {
            name: 'durationInMillis',
            label: '耗时',
            formatter: row => {
              if (row.endTime) {
                return `${(row.durationInMillis / 1000 / 60 / 60).toFixed(2)} 小时`
              }
              return ''
            }
          },
          {
            name: 'beginTime',
            label: '开始时间'
          },
          {
            name: 'endTime',
            label: '结束时间'
          },
          {
            name: 'status',
            label: '状态',
            slot: true
          }
        ]
      }
    }
  },
  mounted() {
    this.getHistoryOperate()
  },
  methods: {
    filterDic: filterDic,
    getHistoryOperate() {
      this.loading++
      getHistoryOperate(this.processInstanceId, this.taskDefinitionKey).then(res => {
        this.historyOperateList = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style lang="scss" scope>

</style>
