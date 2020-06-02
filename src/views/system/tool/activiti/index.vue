<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getActivitiPage"
    />
    <bpmn v-if="dialogName == 'bpmn'" @refresh="getActivitiPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getActivitiPage, deleteActiviti } from '@/api/activiti'
import bpmn from './bpmn'
// import { importDic } from '@/utils'

export default {
  components: {
    bpmn
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
          { text: '新增', click: () => { _this.dialogName = 'bpmn' }, icon: 'el-icon-circle-plus' }
        ],
        column: [
          {
            name: 'name',
            label: '流程名称',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'category',
            label: '类别',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'key',
            label: 'key',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'deploymentTime',
            label: '发布时间'
          }
        ],
        operate: [
          {
            text: '编辑',
            show: _this.checkPermission(['fileStore', 'fileStore.edit']),
            click: data => _this.operate('edit', data)
          },
          {
            text: '删除',
            show: _this.checkPermission(['fileStore', 'fileStore.del']),
            click: _this.del
          }
        ]
      }
    }
  },
  mounted() {
    this.getActivitiPage()
  },
  methods: {
    getActivitiPage() {
      this.loading++
      getActivitiPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'bpmn'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteActiviti(data.id).then(res => {
          this.$message.success(res.msg)
          this.getActivitiPage()
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
