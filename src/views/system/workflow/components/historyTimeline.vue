<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(operate,index) in historyOperateList" :key="index" :timestamp="operate.endTime" placement="top">
        <el-card>
          <h4>{{ operate.activityType === 'startEvent' ? '发起人' : '核准人' }}：{{ operate.assigneeName }}</h4>
          <p v-if="operate.activityType !== 'startEvent'">审批意见：{{ operate.comment }}</p>
          <p>耗时：{{ (operate.durationInMillis/1000/60/60).toFixed(2) }} 小时</p>
        </el-card>
      </el-timeline-item>
      <!-- <el-timeline-item timestamp="2018/4/2" placement="top">
        <el-card>
          <h4>更新 Github 模板</h4>
          <p>王小虎 提交于 2018/4/2 20:46</p>
        </el-card>
      </el-timeline-item> -->
    </el-timeline>
  </div>
</template>

<script>
import { getHistoryOperate } from '@/api/actTask'
export default {
  props: {
    processInstanceId: {
      type: String,
      required: true
    },
    taskDefinitionKey: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      historyOperateList: []
    }
  },
  mounted() {
    this.getHistoryOperate()
  },
  methods: {
    getHistoryOperate() {
      this.loading++
      getHistoryOperate(this.processInstanceId, this.taskDefinitionKey).then(res => {
        this.historyOperateList = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style lang="scss" scope>

</style>
