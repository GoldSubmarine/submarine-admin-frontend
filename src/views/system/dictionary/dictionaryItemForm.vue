<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getDictionaryItemDetail, saveDictionaryItem } from '@/api/dictionaryItem'
import { importRules } from '@/utils/index'
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
    dictionaryId: {
      type: String,
      required: true
    }
  },
  data() {
    const _this = this
    return {
      loading: 0,
      dialogVisible: true,
      formData: {
        dictionaryId: _this.dictionaryId
      },
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
          { xType: 'input', name: 'label', label: '字典标签', rules: importRules('inputRequired') },
          { xType: 'input', name: 'value', label: '字典值', rules: importRules('inputRequired') },
          { xType: 'input', name: 'sort', label: '排序', rules: importRules('inputRequired') },
          { xType: 'input', name: 'remark', label: '备注' }
        ],
        operate: [
          { text: '保存', show: _this.showBtn, click: _this.saveDictionaryItem },
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
          this.getDictionaryItemDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getDictionaryItemDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    getDictionaryItemDetail() {
      this.loading++
      getDictionaryItemDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveDictionaryItem() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        saveDictionaryItem(this.formData).then(res => {
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
