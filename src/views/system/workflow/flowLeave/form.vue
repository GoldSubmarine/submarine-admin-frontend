<template>
  <div v-loading="loading">
    <x-form ref="xForm" v-model="formData" :config="formConfig" />
  </div>
</template>

<script>
import { getFlowLeaveDetailByProcessInstanceId, saveFlowLeave, approveFlowLeave } from '@/api/flowLeave'
import { importRules } from '@/utils/index'
import { getScreenshot } from '@/views/system/workflow/components/util'

export default {
  name: 'LeaveApply',
  parentVariable: {
    width: '540px'
  },
  props: {
    mode: { // add, approve, detail
      type: String,
      required: true
    },
    processInstanceId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      dialogVisible: true,
      originFormDataCache: {},
      formData: {}
    }
  },
  computed: {
    formConfig() {
      const _this = this
      return {
        disabled: _this.mode === 'detail',
        inline: false,
        itemStyle: 'width: 100%;',
        item: [
          {
            xType: 'datePicker',
            type: 'datetimerange',
            name: 'beginTime',
            label: '时间',
            rules: importRules('inputRequired')
          },
          {
            xType: 'input',
            name: 'duration',
            label: '时长',
            rules: importRules('floatGtZero', 'inputRequired')
          },
          {
            xType: 'input',
            type: 'textarea',
            name: 'reason',
            label: '请假原因'
          },
          {
            xType: 'input',
            name: 'remark',
            type: 'textarea',
            label: '备注'
          }
        ]
      }
    }
  },
  mounted() {
    if (this.mode !== 'add') {
      this.getFlowLeaveDetailByProcessInstanceId()
    }
    this.$on('add', () => this.save('add'))
    this.$on('approve', () => this.save('approve'))
  },
  methods: {
    getFlowLeaveDetailByProcessInstanceId() {
      this.loading++
      getFlowLeaveDetailByProcessInstanceId(this.processInstanceId).then(res => {
        res.beginTime = [res.beginTime, res.endTime]
        delete res.endTime
        this.originFormDataCache = JSON.parse(JSON.stringify(res))
        this.formData = res
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    save(type) {
      this.$refs['xForm'].validate().then(async() => {
        const copy = JSON.parse(JSON.stringify(this.formData))
        copy.endTime = copy.beginTime[1]
        copy.beginTime = copy.beginTime[0]
        // 填充必要参数
        this.$emit('fill', copy)
        copy.img = await getScreenshot(this.originFormDataCache, copy)
        this.loading++
        let promise
        if (type === 'add') {
          promise = saveFlowLeave(copy)
        } else if (type === 'approve') {
          promise = approveFlowLeave(copy)
        }
        promise.then(res => {
          this.$message.success(res.msg)
          this.$emit('close')
          this.$emit('refresh')
        }).catch(e => console.error(e)).finally(() => this.loading--)
      })
    }
  }
}
</script>

<style scoped>

</style>
