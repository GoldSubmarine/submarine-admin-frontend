<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(operate,index) in historyOperateList" :key="index" timestamp="2018/4/12" placement="top">
        <el-card>
          <h4>核准人：{{ operate.assignee }}</h4>
          <p>审批意见：{{ operate.comment }}</p>
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
    processDefinitionId: {
      type: String,
      required: true
    },
    endActivityId: {
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
      getHistoryOperate(this.processDefinitionId, this.endActivityId).then(res => {
        this.historyOperateList = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style>

</style>
