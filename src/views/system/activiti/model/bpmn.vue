<!-- 参考：https://github.com/winily/bpmn-demo -->
<template>
  <el-dialog title="流程设计" :visible.sync="dialogVisible" fullscreen :close-on-click-modal="false" @closed="$emit('close')">
    <div style="position: relative;">
      <!-- 创建一个canvas画布 npmn-js是通过canvas实现绘图的，并设置ref让vue获取到element -->
      <div class="bpmn-container">
        <div ref="canvas" class="bpmn-canvas" />
        <!-- 工具栏显示的地方 -->
        <div id="js-properties-panel" class="bpmn-js-properties-panel" />
      </div>

      <!-- 把操作按钮写在这里面 -->
      <div class="action">
        <el-upload action class="upload-demo" :before-upload="openBpmn">
          <el-button icon="el-icon-folder-opened" />
        </el-upload>
        <el-button class="new" icon="el-icon-circle-plus" @click="newDiagram" />
        <el-button icon="el-icon-download" @click="downloadBpmn" />
        <el-button icon="el-icon-picture" @click="downloadSvg" />
        <el-button @click="save"><svg-icon icon-class="save" /></el-button>
        <a ref="downloadLink" hidden />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

import BpmnModeler from 'bpmn-js/lib/Modeler'

// 左边工具栏以及编辑节点的样式
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
// 工具栏相关
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import camundaExtensionModule from 'camunda-bpmn-moddle/lib'

// 汉化
import customTranslate from './translate'

import { saveActModel } from '@/api/actModel'
import initBpmnTemplate from './init.bpmn.js'

export default {
  data() {
    return {
      dialogVisible: true,
      bpmnModeler: null,
      canvas: null,
      bpmnTemplate: initBpmnTemplate
    }
  },
  mounted() {
    this.$nextTick().then(() => this.init())
  },
  methods: {
    newDiagram() {
      this.createNewDiagram(this.bpmnTemplate)
    },
    async downloadBpmn() {
      try {
        const { xml } = await this.bpmnModeler.saveXML({ format: true })
        // 获取文件名
        const name = `${this.getFilename(xml)}.bpmn`
        // 将文件名以及数据交给下载方法
        this.download({ name: name, data: xml })
      } catch (err) {
        console.log('error rendering', err)
      }
    },
    async downloadSvg() {
      try {
        const { xml } = await this.bpmnModeler.saveXML({ format: true })
        // 获取文件名
        const name = `${this.getFilename(xml)}.svg`
        const { svg } = await this.bpmnModeler.saveSVG({ format: true })
        this.download({ name: name, data: svg })
      } catch (err) {
        console.log('error rendering', err)
      }
    },
    openBpmn(file) {
      const reader = new FileReader()
      // 读取File对象中的文本信息，编码格式为UTF-8
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        // 读取完毕后将文本信息导入到Bpmn建模器
        this.createNewDiagram(reader.result)
      }
      return false
    },
    getFilename(xml) {
      const start = xml.indexOf('process')
      let filename = xml.substr(start, xml.indexOf('>'))
      filename = filename.substr(filename.indexOf('id') + 4)
      filename = filename.substr(0, filename.indexOf('"'))
      return filename
    },
    download({ name = 'diagram.bpmn', data }) {
      // 这里就获取到了之前设置的隐藏链接
      const downloadLink = this.$refs.downloadLink
      // 把数据转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)

      if (data) {
        // 将数据给到链接
        downloadLink.href =
          'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        // 设置文件名
        downloadLink.download = name
        // 触发点击事件开始下载
        downloadLink.click()
      }
    },
    async init() {
      // 获取画布 element
      this.canvas = this.$refs.canvas

      // 将汉化包装成一个模块
      const customTranslateModule = {
        translate: ['value', customTranslate]
      }

      // 创建Bpmn对象
      this.bpmnModeler = new BpmnModeler({
        // 设置bpmn的绘图容器为上门获取的画布 element
        container: this.canvas,

        // 加入工具栏支持
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 工具栏模块
          propertiesProviderModule,
          propertiesPanelModule,
          // camunda
          camundaExtensionModule,
          // 汉化模块
          customTranslateModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      await this.createNewDiagram(this.bpmnTemplate)
    },
    async createNewDiagram(bpmn) {
      // 将字符串转换成图显示出来;
      try {
        await this.bpmnModeler.importXML(bpmn)
      } catch (err) {
        console.log('打开模型出错,请确认该模型符合Bpmn2.0规范', err.message, err.warnings)
      }
    },
    async save() {
      try {
        const { xml } = await this.bpmnModeler.saveXML({ format: true })
        const result = {
          name: this.getFilename(xml),
          xml: xml
          // category: category,
          // key: key
        }
        this.loading++
        saveActModel(result).then(res => {
          this.$message.success(res.msg)
        }).catch(e => console.log(e)).finally(_ => this.loading--)
      } catch (err) {
        console.log('error rendering', err)
      }
    }
  }
}
</script>

<style>
.bpmn-container {
  width: 100%;
  height: calc(100vh - 114px);
  display: flex;
}

.bpmn-canvas {
  width: calc(100% - 300px);
  height: calc(100vh - 114px);
}

.bpmn-js-properties-panel {
  width: 320px;
  height: inherit;
  overflow-y: auto;
}

.action {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
}
.upload-demo {
  margin-right: 10px;
}
</style>
