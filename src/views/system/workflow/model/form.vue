<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getActModelDetail, saveActModel } from '@/api/actModel'
import { importRules } from '@/utils'
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
            label: '流程名称',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'category',
            label: '分类',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'key',
            label: '编码',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            type: 'textarea',
            name: 'description',
            label: '描述'
          }
        ],
        operate: [
          {
            text: '保存',
            show: _this.showBtn,
            click: _this.saveActModel
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
          this.getActModelDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getActModelDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  methods: {
    getActModelDetail() {
      this.loading++
      getActModelDetail(this.id).then(res => {
        res.description = res.metaInfo?.description
        delete res.metaInfo
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveActModel() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        const copy = JSON.parse(JSON.stringify(this.formData))
        copy.metaInfo = {
          description: copy.description
        }
        delete copy.description
        saveActModel(copy).then(res => {
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
