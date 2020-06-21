<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getFlowLeavePage"
    />
    <dForm v-if="dialogName == 'dForm'" :process-instance-id="propId" :mode="mode" @refresh="getFlowLeavePage" @close="closeDialog" />
  </div>
</template>

<script>
import { getFlowLeavePage, deleteFlowLeave } from '@/api/flowLeave'
import dForm from './form'
// import { importDic } from '@/utils'

export default {
  components: {
    dForm
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
          { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' }
        ],
        column: [
          {
            name: 'beginTime',
            label: '开始时间',
            search: 'true',
            xType: 'datePicker',
            type: 'datetimerange'
          },
          {
            name: 'endTime',
            label: '结束时间'
          },
          {
            name: 'duration',
            label: '时长'
          },
          {
            name: 'reason',
            label: '请假原因',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'remark',
            label: '备注'
          }
        ],
        operate: [
          {
            text: '编辑',
            show: _this.checkPermission(['leaveFlow.edit']),
            click: data => _this.operate('edit', data)
          },
          {
            text: '删除',
            show: _this.checkPermission(['leaveFlow.del']),
            click: _this.del
          },
          {
            text: '详情',
            show: true,
            click: data => { _this.operate('detail', data) }
          }
        ]
      }
    }
  },
  mounted() {
    this.getFlowLeavePage()
  },
  methods: {
    getFlowLeavePage() {
      this.loading++
      getFlowLeavePage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
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
        deleteFlowLeave(data.id).then(res => {
          this.$message.success(res.msg)
          this.getFlowLeavePage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = ''
    }
  }
}
</script>

<style scoped>

</style>
