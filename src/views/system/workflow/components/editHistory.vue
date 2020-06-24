<template>
  <div>
    <el-dialog title="编辑历史" :visible.sync="dialogVisible" width="80%" @closed="$emit('close')">
      <el-tabs tab-position="left">
        <el-tab-pane
          v-for="(item,index) in historyList"
          :key="index"
          :label="`（${index+1}）${item.createUserName} / ${item.createTime}`"
        >
          <img :src="item.img">
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { getFlowHistoryList } from '@/api/flowHistory'
export default {
  props: {
    processInstanceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: 0,
      dialogVisible: true,
      historyList: [],
      imgData: ''
    }
  },
  mounted() {
    this.getFlowHistoryList()
  },
  methods: {
    getFlowHistoryList() {
      this.loading++
      getFlowHistoryList({ processInstanceId: this.processInstanceId }).then(res => {
        this.historyList = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style>

</style>
