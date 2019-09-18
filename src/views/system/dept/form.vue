<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" :config="formConfig" v-model="formData" />
    </el-dialog>
  </div>
</template>

<script>
import { getDeptDetail, saveDept, getDeptTree } from '@/api/dept';
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
      showBtn: true,
      treeData: [],
    };
  },
  mounted() {
    this.getDeptTree();
  },
  computed: {
    formConfig() {
      let _this = this;
      return {
        disabled: _this.formDisabled,
        inline: false,
        items: [
          { type: "text", name: "name", label: '名称', rules: _this.importRules("inputRequired") },
          { type: "text", name: "code", label: '编码', },
          { type: "tree", name: "pid", tree: { data: _this.treeData, props: {label: 'name'} }, label: '父级', },
          { type: "text", name: "remark", label: '备注', },
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
    getDeptTree() {
      this.loading++;
      getDeptTree().then(res => {
        this.treeData = res;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    saveDept() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        saveDept(this.formData).then(res => {
          this.dialogVisible = false;
          this.$emit("refresh");
        }).catch(e => console.error(e)).finally(() => this.loading--);
      }).catch(e => console.error(e));
    },
  },
  watch: {
    mode: {
      handler: function(mode) {
        if(this.mode == 'add') {
          this.dialogTitle = "新建";
        }
        if(this.mode == 'edit') {
          this.dialogTitle = "编辑";
          this.getDeptDetail();
        }
        if(this.mode == 'detail') {
          this.dialogTitle = "详情";
          this.getDeptDetail();
          this.formDisabled = true;
          this.showBtn = false;
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.dialogStyle {
  width: 540px;
}
</style>
