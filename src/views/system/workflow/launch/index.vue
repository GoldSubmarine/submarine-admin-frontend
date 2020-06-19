<template>
  <div v-loading="loading" class="app-container">
    <el-card v-for="(launch, index) in launchList" :key="index" shadow="hover" class="launch-box-card">
      <div @click="getFormKey(launch.id)">
        {{ launch.name }}
      </div>
    </el-card>
    <leaveForm v-if="dialogName == 'leaveForm'" :id="propId" :mode="mode" :process-definition-id="processDefinitionId" @close="closeDialog" />
  </div>
</template>

<script>
import { getActProcessList } from '@/api/actProcess'
import { getFormKey } from '@/api/actTask'
import leaveForm from '../leaveFlow/form'
export default {
  components: { leaveForm },
  data() {
    return {
      loading: 0,
      launchList: [],
      dialogName: '',
      propId: '',
      mode: '',
      processDefinitionId: ''
    }
  },
  mounted() {
    this.getActProcessList()
  },
  methods: {
    getActProcessList() {
      this.loading++
      getActProcessList().then(res => {
        this.launchList = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getFormKey(procDefId) {
      this.loading++
      getFormKey(procDefId).then(res => {
        if (res === 'leave') {
          console.log(procDefId)
          this.processDefinitionId = procDefId
          this.dialogName = 'leaveForm'
        }
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    closeDialog() {
      this.dialogName = ''
      this.propId = ''
      this.mode = ''
      this.processDefinitionId = ''
    }
  }
}
</script>

<style>
.launch-box-card {
  display: inline-block;
  margin-right: 20px;
  width: 200px;
  height: 200px;
}
</style>
