<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getFileStoreDetail, saveFileStore } from '@/api/fileStore'
import { importDic, importRules } from '@/utils/index'
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
      showBtn: true
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
            xType: 'input',
            name: 'name',
            label: '原始文件名',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'realName',
            label: '磁盘文件名',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'size',
            label: '文件大小',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'type',
            label: '文件类型'
          },
          {
            xType: 'input',
            name: 'url',
            label: 'url',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'md5',
            label: 'md5 值',
            rules: importRules('inputRequired')
          },
          {
            xType: 'select',
            name: 'storeType',
            label: '存储方式',
            dic: importDic('fileStoreType'),
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'remark',
            label: '备注',
            rules: importRules('inputRequired')
          }
        ],
        operate: [
          {
            text: '保存',
            show: _this.showBtn,
            click: _this.saveFileStore
          },
          {
            text: '取消',
            show: _this.showBtn,
            click: () => { _this.dialogVisible = false }
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
          this.getFileStoreDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getFileStoreDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  methods: {
    getFileStoreDetail() {
      this.loading++
      getFileStoreDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveFileStore() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        saveFileStore(this.formData).then(res => {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.$emit('refresh')
        }).catch(e => console.error(e)).finally(() => this.loading--)
      }).catch(e => console.error(e))
    }
  }
}
</script>

<style scoped>

</style>
