<template>
  <div>
    <el-upload
      :disabled="disabled"
      :class="{ 'upload-img': true, hide: disabled }"
      :action="$store.getters.api.fileUploadApi"
      list-type="picture-card"
      :on-preview="file => { showViewer = true; imgIndex = file.index}"
      :on-success="handleUploadSuccess"
      :on-remove="handleUploadRemove"
      :before-upload="beforeUpload"
      accept="image/*"
      :file-list="fileList"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-image-viewer v-if="showViewer" :on-close="() => showViewer = false" :initial-index="imgIndex" :url-list="fileList.map(item => item.url)" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { findListByIds } from '@/api/fileStore'
import Compressor from 'compressorjs'

export default {
  components: {
    ElImageViewer
  },
  props: {
    ids: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    compress: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showViewer: false,
      imgIndex: false,
      cacheIds: '',
      fileList: []
    }
  },
  watch: {
    ids: {
      handler: function(ids) {
        if (ids !== this.cacheIds) {
          this.findListByIds()
        }
      },
      immediate: true
    }
  },
  methods: {
    async beforeUpload(file) {
      if (file.type.indexOf('image') !== 0) {
        this.$message.error('只能上传图片')
        return false
      }
      if (this.compress) {
        const result = await new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.6,
            convertSize: 1000000, // png图片最大1M，大于1M将会被转换成jpg进行压缩
            success: resolve,
            error: reject
          })
        })
        return result
      }
      return true
    },
    findListByIds() {
      this.loading++
      if (!this.ids) return
      findListByIds(this.ids).then(files => {
        this.buildIndex(files)
        this.fileList = files
      }).catch(err => console.log(err)).finally(_ => this.loading--)
    },
    handleUploadSuccess(response, file, fileList) {
      file.id = response.data.id
      file.url = response.data.url
      this.buildIndex(fileList)
      this.fileList = fileList
      this.cacheIds = this.fileList.map(item => item.id).join(',')
      this.$emit('update:ids', this.cacheIds)
    },
    handleUploadRemove(file, fileList) {
      this.buildIndex(fileList)
      this.fileList = fileList
      this.cacheIds = this.fileList.map(item => item.id).join(',')
      this.$emit('update:ids', this.cacheIds)
    },
    buildIndex(arr) {
      arr.forEach((item, index) => {
        item.index = index
      })
    }
  }
}
</script>

<style lang="scss">
$img-width: 60px;

.upload-img {
  .el-upload-list__item {
    width: $img-width;
    height: $img-width;
  }
  &>div {
    width: $img-width;
    height: $img-width;
    line-height: $img-width;
  }
}
// 隐藏上传按钮
.hide .el-upload--picture-card {
    display: none;
}
.el-image-viewer__close {
  color: white;
}
</style>
