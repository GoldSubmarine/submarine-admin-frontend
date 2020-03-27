<template>
  <div class="app-container">
    <el-dialog title="上传文件" :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false" @closed="$emit('close')">
      <el-upload
        v-loading="loading"
        class="upload-demo"
        drag
        multiple
        action="string"
        :http-request="uploadFile"
        :on-preview="downloadFile"
        :before-remove="deleteFile"
        :file-list="fileList"
        :on-error="uploadError"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        <div slot="tip" class="el-upload__tip">单击下面的文件，即可下载</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileStore, deleteFileStore, getFileStoreBinary } from '@/api/fileStore'
import { saveAs } from 'file-saver'
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      dialogVisible: true,
      fileList: [],
      detail: {}
    }
  },
  methods: {
    uploadFile(item) {
      const formdata = new FormData()
      formdata.append('file', item.file)
      this.loading++
      uploadFileStore(formdata).then(res => {
        this.fileList.push(res.data)
        this.$message.success(res.msg)
        this.$emit('refresh')
      }).catch(e => {
        this.fileList = JSON.parse(JSON.stringify(this.fileList))
      }).finally(() => this.loading--)
    },
    downloadFile(data) {
      // 方法一
      // const link = document.createElement('a')
      // link.href = data.url
      // link.download = data.name
      // link.click()
      // window.URL.revokeObjectURL(link.href)

      // 方法二
      getFileStoreBinary(data.url)
        .then(blob => saveAs(blob, data.name))
        .catch(e => console.log(e))
    },
    deleteFile(data) {
      this.loading++
      deleteFileStore({ id: this.id }).then(res => {
        this.$message.success(res.msg)
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    uploadError(err, file, fileList) {
      console.log(123, err, file, fileList)
    }
  }
}
</script>

<style scoped>

</style>
