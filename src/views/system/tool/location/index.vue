<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :load="getLocationList"
    />
    <dForm v-if="dialogName == 'dForm'" :id="propId" :mode="mode" @refresh="getLocationList" @close="closeDialog" />
  </div>
</template>

<script>
import { getLocationList, deleteLocation } from '@/api/location'
import dForm from './form'

export default {
  components: {
    dForm
  },
  data() {
    return {
      loading: 0,
      tableData: [],
      locationList: [],
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
        rowKey: 'id',
        lazy: true,
        load: _this.load,
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        btn: [
          // { text: '新增', click: () => _this.operate('add'), icon: 'el-icon-circle-plus' }
        ],
        column: [
          {
            name: 'name',
            label: '区域名',
            search: 'true',
            xType: 'input',
            align: 'left'
          },
          {
            name: 'id',
            label: '区域编号'
          },
          // {
          //   name: 'pid',
          //   label: '父级区域编号'
          // },

          {
            name: 'deep',
            label: '当前层次'
          },
          {
            name: 'point',
            label: '区域中心经纬度'
          }
        ],
        operate: [
          // {
          //   text: '编辑',
          //   show: _this.checkPermission(['location', 'location.edit']),
          //   click: data => _this.operate('edit', data)
          // },
          // {
          //   text: '删除',
          //   show: _this.checkPermission(['location', 'location.del']),
          //   click: _this.del
          // },
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
    this.getLocationList()
  },
  methods: {
    getLocationList() {
      this.loading++
      getLocationList(this.searchData).then(res => {
        res.forEach(item => {
          item.hasChildren = item.deep < 2
        })
        this.locationList = res
        this.tableData = res.filter(item => item.deep === 0)
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    load(tree, treeNode, resolve) {
      resolve(this.locationList.filter(item => item.pid === tree.id))
    },
    operate(mode, data) {
      if (mode !== 'add') this.propId = data.id
      this.mode = mode
      this.dialogName = 'dForm'
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteLocation(data.id).then(res => {
          this.$message.success(res.msg)
          this.getLocationList()
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
