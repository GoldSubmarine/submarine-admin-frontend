<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" :config="formConfig" v-model="formData" />
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionDetail, savePermission } from '@/api/permission';
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
      this.getPermissionDetail();
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
          { type: "text", name: "name", label: '名称（中文）', },
          { type: "text", name: "value", label: '权限值', },
        ],
        operate: [
          { text: "保存", show: _this.showBtn, click: _this.savePermission },
          { text: "取消", show: _this.showBtn, click: () => _this.dialogVisible = false },
        ]
      };
    },
  },
  methods: {
    getPermissionDetail() {
      this.loading++;
      getPermissionDetail(this.id).then(res => {
        this.formData = res;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    savePermission() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        this.formData.pid = this.id;
        savePermission(this.formData).then(res => {
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
