<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getActModelPage"
    />
    <bpmn v-if="dialogName === 'bpmn'" :id="propId" @refresh="getActModelPage" @close="closeDialog" />
    <dForm v-if="dialogName === 'dForm'" :id="propId" :mode="mode" @refresh="getActModelPage" @close="closeDialog" />
  </div>
</template>

<script>
import { getActModelPage, deleteActModel } from '@/api/actModel'
import bpmn from './bpmn'
import dForm from './form'
// import { importDic } from '@/utils'

export default {
  components: {
    bpmn,
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
      mode: '',
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
            name: 'name',
            label: '流程名称',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'category',
            label: '分类',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'key',
            label: '编码',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'version',
            label: '版本',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'createTime',
            label: '创建时间'
          }
        ],
        operate: [
          {
            text: '编辑',
            show: _this.checkPermission(['fileStore', 'fileStore.edit']),
            click: data => _this.operate('edit', data)
          },
          {
            text: '设计模型',
            show: _this.checkPermission(['fileStore', 'fileStore.edit']),
            click: data => { _this.propId = data.id; _this.dialogName = 'bpmn' }
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
    this.getActModelPage()
  },
  methods: {
    getActModelPage() {
      this.loading++
      getActModelPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
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
        deleteActModel(data.id).then(res => {
          this.$message.success(res.msg)
          this.getActModelPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = ''
      this.propId = ''
    }
  }
}
</script>

<style scoped>

</style>
