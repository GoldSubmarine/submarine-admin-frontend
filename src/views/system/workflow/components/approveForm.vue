<template>
  <el-form ref="form" :model="form" label-width="120px">
    <el-divider />
    <el-form-item label="审批结果：" prop="status" :rules="[ { required: true, message: '请选择', trigger: 'blur,change' } ]">
      <el-radio-group v-model="form.status">
        <el-radio label="approve">通过</el-radio>
        <el-radio label="reject">驳回</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="审批意见：" prop="comment" :rules="[ { required: true, message: '请输入', trigger: 'blur' } ]">
      <el-input v-model="form.comment" type="textarea" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        comment: '',
        status: ''
      }
    }
  },
  watch: {
    form: {
      handler: function(val, oldVal) {
        this.$emit('update:data', val)
      },
      immediate: true
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    }
  }
}
</script>
