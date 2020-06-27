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
  </div>
</template>

<script>
import { getActModelPage, deleteActModel, deployActModel } from '@/api/actModel'
import bpmn from './bpmn'
import { importDic } from '../../../../utils'
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
      searchData: {
        lastVersion: true
      },
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
          { text: '新增', show: _this.checkPermission(['actModel.add']), click: () => { _this.propId = ''; _this.dialogName = 'bpmn' }, icon: 'el-icon-circle-plus' }
        ],
        column: [
          {
            name: 'lastVersion',
            label: '版本',
            show: false,
            search: 'true',
            xType: 'radio',
            dic: [
              { label: '全部', value: false },
              { label: '最新', value: true }
            ]
          },
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
            xType: 'select',
            dic: importDic('all').concat(_this.$store.getters.dic.processCategory)
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
            text: '部署',
            show: _this.checkPermission(['actModel.edit']),
            click: data => _this.deployActModel(data.id)
          },
          {
            text: '设计模型',
            show: _this.checkPermission(['actModel.edit']),
            click: data => { _this.propId = data.id; _this.dialogName = 'bpmn' }
          },
          {
            text: '删除',
            show: _this.checkPermission(['actModel.del']),
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
    deployActModel(id) {
      this.loading++
      deployActModel(id).then(res => {
        this.$message.success(res.msg)
      }).catch(e => console.log(e)).finally(() => this.loading--)
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
