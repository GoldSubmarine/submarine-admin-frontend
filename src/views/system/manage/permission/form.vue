<template>
  <div class="app-container">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="520px"
      :close-on-click-modal="false"
      @closed="$emit('close')"
    >
      <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionDetail,
  savePermission,
  saveModulePermission,
  getPermissionTree
} from '@/api/permission'
import { importRules, importDic } from '@/utils/index'
export default {
  props: {
    mode: {
      // edit, detail, add
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
    },
    pid: {
      type: String,
      default: null
    }
  },
  data() {
    const _this = this
    return {
      loading: 0,
      dialogVisible: true,
      formData: {
        isModule: false,
        pid: _this.pid
      },
      formDisabled: false,
      dialogTitle: '编辑',
      showBtn: true,
      treeData: []
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        disabled: _this.formDisabled,
        inline: false,
        item: [
          {
            xType: 'radio',
            label: '新增方式',
            name: 'isModule',
            dic: importDic('permissionAddType'),
            rules: importRules('selectRequired'),
            show: _this.mode === 'add'
          },
          {
            xType: 'select',
            label: '类型',
            name: 'type',
            dic: importDic('permissionType'),
            rules: importRules('selectRequired'),
            disabled: _this.formData.isModule
          },
          {
            xType: 'input',
            name: 'name',
            label: '名称',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'value',
            label: '权限值'
          },
          {
            xType: 'select',
            type: 'tree',
            name: 'pid',
            dic: { data: _this.treeData, label: 'name', value: 'id' },
            label: '父级'
          }
        ],
        operate: [
          {
            text: '保存',
            show: _this.showBtn,
            click: _this.savePermission
          },
          {
            text: '取消',
            show: _this.showBtn,
            click: () => {
              _this.dialogVisible = false
            }
          }
        ]
      }
    }
  },
  watch: {
    mode: {
      handler: function(mode) {
        if (this.mode === 'add') {
          this.dialogTitle = '新建'
        }
        if (this.mode === 'edit') {
          this.dialogTitle = '编辑'
          this.getPermissionDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getPermissionDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    },
    'formData.isModule': {
      handler: function(val) {
        if (val) {
          this.formData.type = 'menu'
        } else {
          this.formData.type = ''
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getPermissionTree()
  },
  methods: {
    getPermissionDetail() {
      this.loading++
      getPermissionDetail(this.id)
        .then(res => {
          this.formData = res
        })
        .catch(e => console.error(e))
        .finally(() => this.loading--)
    },
    getPermissionTree() {
      this.loading++
      getPermissionTree({ type: 'menu' })
        .then(res => {
          this.treeData = res
        })
        .catch(e => console.error(e))
        .finally(() => this.loading--)
    },
    savePermission() {
      this.$refs['xForm']
        .validate()
        .then(() => {
          this.loading++
          let promise
          const copy = JSON.parse(JSON.stringify(this.formData))
          delete copy.isModule
          if (this.formData.isModule) {
            promise = saveModulePermission(copy)
          } else {
            promise = savePermission(copy)
          }
          promise
            .then(res => {
              this.dialogVisible = false
              this.$message.success(res.msg)
              this.$emit('refresh')
            })
            .catch(e => console.error(e))
            .finally(() => this.loading--)
        })
        .catch(e => console.error(e))
    }
  }
}
</script>

<style scoped>
.dialogStyle {
  width: 540px;
}
</style>
