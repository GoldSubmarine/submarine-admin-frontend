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
  </div>
</template>

<script>
import { getTodoPage } from '@/api/actTask'
import { importDic } from '@/utils'

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
            click: _this.del
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
