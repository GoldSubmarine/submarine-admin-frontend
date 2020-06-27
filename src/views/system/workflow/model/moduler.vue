<template>
  <div>
    <el-dialog fullscreen :title="dialogTitle + '（请假申请）'" :visible.sync="dialogVisible" height="100%" :close-on-click-modal="false" @closed="$emit('close')">
      <el-button size="small" style="float:right;margin-top:6px;margin-right:6px;" @click="$refs['wfd'].graph.saveXML()">导出XML</el-button>
      <el-button size="small" style="float:right;margin-top:6px;margin-right:6px;" @click="save">保存</el-button>
      <wfd-vue v-if="showModuler" ref="wfd" :data="g6Data" :height="600" :users="candidateUsers" :groups="candidateGroups" :lang="lang" />
    </el-dialog>
  </div>
</template>

<script>
import WfdVue from '@/components/FlowableModuler/src/components/Wfd'
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
        })
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getPng() {
      var canvas = document.querySelector('canvas')
      var context = canvas.getContext('2d')

      var imgData = context.getImageData(0, 0, canvas.width, canvas.height).data
      var lOffset = canvas.width; var rOffset = 0; var tOffset = canvas.height; var bOffset = 0
      for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
          var pos = (i + canvas.width * j) * 4
          if (imgData[pos] === 255 || imgData[pos + 1] === 255 || imgData[pos + 2] === 255 || imgData[pos + 3] === 255) {
            bOffset = Math.max(j, bOffset) // 找到有色彩的最下端
            rOffset = Math.max(i, rOffset) // 找到有色彩的最右端

            tOffset = Math.min(j, tOffset) // 找到有色彩的最上端
            lOffset = Math.min(i, lOffset) // 找到有色彩的最左端
          }
        }
      }
      lOffset++
      rOffset++
      tOffset++
      bOffset++

      var c = document.createElement('canvas')
      c.style.backgroundColor = '#fff'
      c.width = rOffset - lOffset + 100
      c.height = bOffset - tOffset + 100
      var ctx = c.getContext('2d')
      ctx.drawImage(canvas, lOffset - 100, tOffset - 100, c.width, c.height, 0, 0, c.width, c.height)
      return c.toDataURL()
    },
    save() {
      const xml = this.$refs['wfd'].graph.saveXML(false)
      const json = this.$refs['wfd'].graph.save()
      const processModel = this.$refs['wfd'].processModel
      const png = this.getPng()
      const result = {
        id: this.id,
        name: processModel.name,
        editorSourceValue: xml,
        editorSourceExtraValue: {
          g6: JSON.stringify(json),
          img: png
        },
        category: this.category,
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
