<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" :config="formConfig" v-model="formData" />
    </el-dialog>
  </div>
</template>

<script>
import { getUserDetail, changePass } from '@/api/user';
export default {
  props: ['id'], // edit, detail, add
  data() {
    let _this = this;
    return {
      loading: 0,
      dialogVisible: true,
      formData: {},
      formDisabled: false,
      dialogTitle: "修改密码",
      showBtn: true,
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
          { type: "text", showPassword:true, name: "oldPassword", label: '旧密码', rules: _this.importRules("inputRequired") },
          { type: "text", showPassword:true, name: "newPassword", label: '新密码', rules: _this.importRules("inputRequired") },
          { type: "text", showPassword:true, name: "confirmPassword", label: '确认密码', rules: _this.importRules("inputRequired").concat([{validator: _this.validatePass2, trigger: 'blur'}]) },
        ],
        operate: [
          { text: "保存", show: _this.showBtn, click: _this.saveUser },
          { text: "取消", show: _this.showBtn, click: () => _this.dialogVisible = false },
        ]
      };
    },
  },
  methods: {
    getUserDetail() {
      this.loading++;
      getUserDetail(this.id).then(res => {
        res.roleIdList = res.roleIdList.split(",");
        this.formData = res;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    saveUser() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        let copy = JSON.parse(JSON.stringify(this.formData));
        delete copy.confirmPassword;
        changePass(copy).then(res => {
          this.dialogVisible = false;
          this.$message.success("修改成功");
          this.$store.dispatch('user/logout');
        }).catch(e => console.error(e)).finally(() => this.loading--);
      }).catch(e => console.error(e));
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
  },
};
</script>

<style scoped>

</style>
