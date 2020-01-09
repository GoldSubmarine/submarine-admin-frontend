<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getFileStorePage"
    />
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" @refresh="getFileStorePage" @close="closeDialog" />
    <uploadForm v-if="dialogName == 'uploadForm'" @refresh="getFileStorePage" @close="closeDialog" />
  </div>
</template>

<script>
import { getFileStorePage, deleteFileStore, getFileStoreBinary } from '@/api/fileStore'
import dForm from './form'
import uploadForm from './upload'
import { importDic } from '../../../../utils'
import { saveAs } from 'file-saver'

export default {
  components: {
    dForm,
    uploadForm
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
          { text: '新增', click: () => { _this.dialogName = 'uploadForm' }, icon: 'el-icon-circle-plus' }
        ],
        column: [
          {
            name: 'name',
            label: '原始文件名',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'realName',
            label: '磁盘文件名',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'size',
            label: '文件大小',
            formatter: data => data.size + ' (kb)'
          },
          {
            name: 'type',
            label: '文件类型',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'url',
            label: 'url'
          },
          {
            name: 'md5',
            label: 'md5 值',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'storeType',
            label: '存储方式',
            search: 'true',
            xType: 'select',
            dic: importDic('all', 'fileStoreType')
          },
          {
            name: 'remark',
            label: '备注'
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
          },
          {
            text: '详情',
            show: true,
            click: data => { _this.operate('detail', data) }
          },
          {
            text: '下载',
            show: true,
            click: data => { _this.downloadFile(data) }
          }
        ]
      }
    }
  },
  mounted() {
    this.getFileStorePage()
  },
  methods: {
    getFileStorePage() {
      this.loading++
      getFileStorePage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.records
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
        deleteFileStore(data.id).then(res => {
          this.$message.success(res.msg)
          this.getFileStorePage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = ''
    },
    downloadFile(data) {
      // 方法一
      // const link = document.createElement('a')
      // link.href = data.url
      // link.download = data.name
      // link.click()
      // window.URL.revokeObjectURL(link.href)

      // 方法二
      getFileStoreBinary(data.url)
        .then(blob => saveAs(blob, data.name))
        .catch(e => console.log(e))
    }
  }
}
</script>

<style scoped>

</style>
