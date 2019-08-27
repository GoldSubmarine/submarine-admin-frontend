<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" :config="formConfig" v-model="formData" />
    </el-dialog>
  </div>
</template>

<script>
import { getDeptDetail, saveDept } from '@/api/dept';
export default {
  props: ['mode', 'id'], // edit, detail, add
  data() {
    let _this = this;
    return {
      loading: 0,
      dialogVisible: true,
      formData: {},
      formDisabled: false,
      dialogTitle: "编辑",
      showBtn: true
    };
  },
  mounted() {
    if(['edit', 'detail'].includes(this.mode)) {
      this.getDeptDetail();
    }
    if(this.mode == 'detail') {
      this.formDisabled = true;
      this.showBtn = false;
    }
  },
  computed: {
    formConfig() {
      let _this = this;
      return {
        disabled: _this.formDisabled,
        inline: false,
        items: [
          { type: "text", name: "name", label: '名称', },
          { type: "text", name: "code", label: '编码', },
        ],
        operate: [
          { text: "保存", show: _this.showBtn, click: _this.saveDept },
          { text: "取消", show: _this.showBtn, click: () => _this.dialogVisible = false },
        ]
      };
    },
  },
  methods: {
    getDeptDetail() {
      this.loading++;
      getDeptDetail(this.id).then(res => {
        this.formData = res;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    saveDept() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        this.formData.pid = this.id;
        saveDept(this.formData).then(res => {
          this.dialogVisible = false;
          this.$emit("refresh");
        }).catch(e => console.error(e)).finally(() => this.loading--);
      }).catch(e => console.error(e));
    },
  }
};
</script>

<style scoped>
.dialogStyle {
  width: 540px;
}
</style>
