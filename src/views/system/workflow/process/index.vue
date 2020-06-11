<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getActProcessPage"
    >
      <template #resourceName="scope">
        <el-link type="primary" @click="showResource(scope.row.id, scope.row.resourceName, false)">{{ scope.row.resourceName }}</el-link>
      </template>
      <template #dgrmResourceName="scope">
        <el-link type="primary" @click="showResource(scope.row.id, scope.row.dgrmResourceName, true)">{{ scope.row.dgrmResourceName }}</el-link>
      </template>
    </x-table>
  </div>
</template>

<script>
import { getActProcessPage, deleteActDeployment, getActProcessResource, changeProcessStatus } from '@/api/actProcess'
import { importDic } from '../../../../utils'

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
            name: 'suspensionState',
            label: '状态',
            dic: importDic('all', 'ProcessSuspensionState')
          },
          {
            slot: true,
            name: 'resourceName',
            label: '流程xml'
          },
          {
            slot: true,
            name: 'dgrmResourceName',
            label: '流程图片'
          },
          {
            name: 'version',
            label: '版本'
          },
          {
            name: 'deploymentTime',
            label: '部署时间'
          }
        ],
        operate: [
          {
            text: '激活',
            show: data => _this.checkPermission(['actProcess.edit']) && data.suspensionState === 'suspended',
            click: data => _this.changeProcessStatus(data.id, 'active')
          },
          {
            text: '挂起',
            show: data => _this.checkPermission(['actProcess.edit']) && data.suspensionState === 'active',
            click: data => _this.changeProcessStatus(data.id, 'suspended')
          },
          {
            text: '删除',
            show: _this.checkPermission(['actProcess.del']),
            click: _this.del
          }
        ]
      }
    }
  },
  mounted() {
    this.getActProcessPage()
  },
  methods: {
    getActProcessPage() {
      this.loading++
      getActProcessPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    showResource(id, name, isSvg) {
      this.loading++
      getActProcessResource(id, name).then(res => {
        this.$alert(res, '预览', {
          // center: escape,
          customClass: isSvg ? 'resource-middle-class' : 'resource-class',
          dangerouslyUseHTMLString: isSvg
        }).catch(e => console.log(e))
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    changeProcessStatus(id, suspensionState) {
      this.loading++
      changeProcessStatus({ id: id, suspensionState: suspensionState }).then(res => {
        this.$message.success(res.msg)
        this.getActProcessPage()
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteActDeployment(data.deploymentId).then(res => {
          this.$message.success(res.msg)
          this.getActProcessPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
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
