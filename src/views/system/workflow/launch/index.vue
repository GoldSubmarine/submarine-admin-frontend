<template>
  <div v-loading="loading" class="app-container">
    <el-card
      v-for="(launch, index) in launchList"
      :key="index"
      shadow="hover"
      class="launch-box-card"
    >
      <div @click="open(launch)">
        {{ launch.name }}
      </div>
    </el-card>
    <formLoader
      v-if="dialogName == 'formLoader'"
      :mode="mode"
      :process-definition-key="processDefinitionKey"
      :process-definition-id="processDefinitionId"
      @close="closeDialog"
    />
  </div>
</template>

<script>
import { getActProcessList } from '@/api/actProcess'
import formLoader from '../components/formLoader'

export default {
  components: { formLoader },
  data() {
    return {
      loading: 0,
      launchList: [],
      dialogName: '',
      propId: '',
      mode: '',
      processDefinitionId: '',
      processDefinitionKey: ''
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
    open(data) {
      this.mode = 'add'
      this.processDefinitionId = data.id
      this.processDefinitionKey = data.key
      this.dialogName = 'formLoader'
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
