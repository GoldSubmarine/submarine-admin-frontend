<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionDetail, savePermission, saveModulePermission, getPermissionTree } from '@/api/permission'
export default {
  props: {
    mode: { // edit, detail, add
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
    },
    isModule: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: 0,
      dialogVisible: true,
      formData: {},
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
        items: [
          { type: 'text', name: 'name', label: '名称', rules: _this.importRules('inputRequired') },
          { type: 'text', name: 'value', label: '权限值' },
          { type: 'tree', name: 'pid', tree: { data: _this.treeData, props: { label: 'name' }}, label: '父级' }
        ],
        operate: [
          { text: '保存', show: _this.showBtn, click: _this.savePermission },
          { text: '取消', show: _this.showBtn, click: () => { _this.dialogVisible = false } }
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
        if (this.mode === 'add' && this.isModule) {
          this.dialogTitle = '新建模块'
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
    }
  },
  mounted() {
    this.getPermissionTree()
  },
  methods: {
    getPermissionDetail() {
      this.loading++
      getPermissionDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    getPermissionTree() {
      this.loading++
      getPermissionTree().then(res => {
        this.treeData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    savePermission() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        let promise
        if (this.isModule) {
          promise = saveModulePermission(this.formData)
        } else {
          promise = savePermission(this.formData)
        }
        promise.then(res => {
          this.dialogVisible = false
          this.$emit('refresh')
        }).catch(e => console.error(e)).finally(() => this.loading--)
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style scoped>
.dialogStyle {
  width: 540px;
}
</style>
