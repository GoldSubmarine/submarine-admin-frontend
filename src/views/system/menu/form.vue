<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getMenuDetail, saveMenu, getMenuTree } from '@/api/menu'
export default {
  props: {
    mode: { // edit, detail, add
      type: String,
      required: true
    },
    id: {
      type: String,
      default: null
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
        item: [
          { xType: 'input', name: 'name', label: '名称', rules: _this.importRules('inputRequired') },
          { xType: 'input', name: 'value', label: '权限值', rules: _this.importRules('inputRequired') },
          { xType: 'select', type: 'tree', name: 'pid', tree: { data: _this.treeData, props: { label: 'name' }}, label: '父级' },
          { xType: 'input', name: 'remark', label: '备注' }
        ],
        operate: [
          { text: '保存', show: _this.showBtn, click: _this.saveMenu },
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
        if (this.mode === 'edit') {
          this.dialogTitle = '编辑'
          this.getMenuDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getMenuDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getMenuTree()
  },
  methods: {
    getMenuDetail() {
      this.loading++
      getMenuDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    getMenuTree() {
      this.loading++
      getMenuTree().then(res => {
        this.treeData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveMenu() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        saveMenu(this.formData).then(res => {
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
