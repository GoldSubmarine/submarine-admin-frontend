<template>
  <div class="app-container">
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="520px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" v-model="formData" v-loading="loading" :config="formConfig" />
    </el-dialog>
  </div>
</template>

<script>
import { getQuartzJobDetail, saveQuartzJob } from '@/api/quartzJob'
import { importRules, importDic } from '../../../../utils'
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
      formData: {
        status: 'enable'
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
          {
            xType: 'input',
            name: 'jobName',
            label: '任务名称',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'beanName',
            label: 'bean名称',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'methodName',
            label: '方法名称',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'params',
            label: '方法参数'
          },
          {
            xType: 'input',
            name: 'cronExpression',
            label: 'cron表达式',
            rules: importRules('inputRequired')
          },
          {
            xType: 'radio',
            name: 'status',
            label: '状态',
            rules: importRules('selectRequired'),
            dic: importDic('QuartzJobStatusType')
          },
          {
            xType: 'input',
            name: 'remark',
            label: '备注'
          }
        ],
        operate: [
          {
            text: '保存',
            show: _this.showBtn,
            click: _this.saveQuartzJob
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
          this.getQuartzJobDetail()
        }
        if (this.mode === 'detail') {
          this.dialogTitle = '详情'
          this.getQuartzJobDetail()
          this.formDisabled = true
          this.showBtn = false
        }
      },
      immediate: true
    }
  },
  methods: {
    getQuartzJobDetail() {
      this.loading++
      getQuartzJobDetail(this.id).then(res => {
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    saveQuartzJob() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++
        saveQuartzJob(this.formData).then(res => {
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
