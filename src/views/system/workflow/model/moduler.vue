<template>
  <div>
    <el-dialog fullscreen :title="dialogTitle + '（请假申请）'" :visible.sync="dialogVisible" height="100%" :close-on-click-modal="false" @closed="$emit('close')">
      <el-button size="small" style="float:right;margin-top:6px;margin-right:6px;" @click="$refs['wfd'].graph.saveXML()">导出XML</el-button>
      <el-button size="small" style="float:right;margin-top:6px;margin-right:6px;" @click="$refs['wfd'].graph.saveImg()">导出图片</el-button>
      <el-button size="small" style="float:right;margin-top:6px;margin-right:6px;" @click="save">保存</el-button>
      <wfd-vue v-if="showModuler" ref="wfd" :data="g6Data" :height="600" :users="candidateUsers" :groups="candidateGroups" :categorys="$store.getters.dic.processCategory.map(item => { return { id: item.value, name: item.label } })" :lang="lang" />
    </el-dialog>
  </div>
</template>

<script>
import WfdVue from '../../../../../wfd-vue/src/components/Wfd'
import { getActModelDetail, saveActModel } from '@/api/actModel'
import { getUserList } from '@/api/user'
import { getRoleList } from '@/api/role'

export default {
  components: {
    WfdVue
  },
  props: {
    id: { // add, approve, detail
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: true,
      dialogTitle: '',
      lang: 'zh',
      showModuler: false,
      g6Data: {
        nodes: [{ id: 'startNode1', x: 50, y: 200, label: '', clazz: 'start' }]
      },
      candidateUsers: [],
      candidateGroups: []
    }
  },
  mounted() {
    this.getUserList()
    this.getRoleList()
    if (this.id) {
      this.getActModelDetail()
    } else {
      this.showModuler = true
    }
  },
  methods: {
    getUserList() {
      this.loading++
      getUserList().then(res => {
        this.candidateUsers = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getRoleList() {
      this.loading++
      getRoleList().then(res => {
        this.candidateGroups = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getActModelDetail() {
      this.loading++
      getActModelDetail(this.id).then(res => {
        this.g6Data = JSON.parse(res.editorSourceExtraValue.g6)
        this.showModuler = true
        this.$nextTick().then(() => {
          this.$refs['wfd'].processModel.name = res.name
          this.$refs['wfd'].processModel.id = res.key
          this.$refs['wfd'].processModel.category = res.category
        })
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    save() {
      const xml = this.$refs['wfd'].graph.saveXML(false)
      const json = this.$refs['wfd'].graph.save()
      const processModel = this.$refs['wfd'].processModel
      const png = this.$refs['wfd'].graph.saveImg(false)
      const result = {
        id: this.id,
        name: processModel.name,
        editorSourceValue: xml,
        editorSourceExtraValue: {
          g6: JSON.stringify(json),
          img: png
        },
        category: processModel.category,
        key: processModel.id
      }
      this.loading++
      saveActModel(result).then(res => {
        this.$message.success(res.msg)
        this.$emit('refresh')
        this.dialogVisible = false
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style>
</style>
