<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" :config="formConfig" v-model="formData" />
    </el-dialog>
  </div>
</template>

<script>
import { getDictionaryItemDetail, saveDictionaryItem } from '@/api/dictionaryItem';
export default {
  props: ['mode', 'id', "dictionaryId"], // edit, detail, add
  data() {
    let _this = this;
    return {
      loading: 0,
      dialogVisible: true,
      formData: {
        dictionaryId: _this.dictionaryId
      },
      formDisabled: false,
      dialogTitle: "编辑",
      showBtn: true
    };
  },
  mounted() {

  },
  computed: {
    formConfig() {
      let _this = this;
      return {
        disabled: _this.formDisabled,
        inline: false,
        items: [
          { type: "text", name: "label", label: '字典标签', rules: _this.importRules("inputRequired") },
          { type: "text", name: "value", label: '字典值', rules: _this.importRules("inputRequired") },
          { type: "text", name: "sort", label: '排序', rules: _this.importRules("inputRequired") },
          { type: "text", name: "remark", label: '备注' },
        ],
        operate: [
          { text: "保存", show: _this.showBtn, click: _this.saveDictionaryItem },
          { text: "取消", show: _this.showBtn, click: () => _this.dialogVisible = false },
        ]
      };
    },
  },
  methods: {
    getDictionaryItemDetail() {
      this.loading++;
      getDictionaryItemDetail(this.id).then(res => {
        this.formData = res;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    saveDictionaryItem() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        saveDictionaryItem(this.formData).then(res => {
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
          this.getDictionaryItemDetail();
        }
        if(this.mode == 'detail') {
          this.dialogTitle = "详情";
          this.getDictionaryItemDetail();
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

</style>
