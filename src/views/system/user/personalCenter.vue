<template>
  <div class="app-container" v-loading="loading">
    <h3>基本信息</h3>
    <el-divider></el-divider>
    <x-form ref="xForm" :config="formConfig" v-model="formData" />
    <h3>安全设置</h3>
    <el-divider></el-divider>
    <el-form label-width="120px">
      <el-form-item label="密码：">
        <el-button type="text" @click="dialogName = 'changePass'">修改密码</el-button>
      </el-form-item>
    </el-form>

    <changePass @close="closeDialog" v-if="dialogName == 'changePass'"></changePass>
  </div>
</template>

<script>
import { getUserDetail, saveUser } from '@/api/user';
import store from '@/store';
import changePass from './changePass';
export default {
  components: {
    changePass
  },
  data() {
    return {
      loading: 0,
      formData: {
        status: 'enable'
      },
      dialogName: '',
      formDisabled: false,
      showBtn: true,
      roleData: [],
    };
  },
  mounted() {
    this.getUserDetail();
  },
  computed: {
    formConfig() {
      let _this = this;
      return {
        disabled: _this.formDisabled,
        inline: false,
        items: [
          { type: "text", name: "username", label: '登录名', disabled: true },
          { type: "text", name: "name", label: '姓名', rules: _this.importRules("inputRequired") },
          { type: "text", name: "deptName", label: '部门', disabled: true },
          { type: "text", name: "phone", label: '手机号', rules: _this.importRules("inputRequired", "phone") },
          { type: "text", name: "email", label: '邮箱', rules: _this.importRules("email") },
          { type: "select", name: "sex", label: '性别', dic: _this.importDic("sex"), rules: _this.importRules("selectRequired") },
          // { type: "text", name: "avatar", label: '头像', rules: _this.importRules("inputRequired") },
          { type: "textarea", name: "address", label: '地址', },
          { type: "text", name: "createTime", label: '注册时间', disabled: true },
        ],
        operate: [
          { text: "更新信息", show: _this.showBtn, click: _this.saveUser },
        ]
      };
    },
  },
  methods: {
    getUserDetail() {
      this.loading++;
      getUserDetail(store.getters.userId).then(res => {
        res.roleIdList = res.roleIdList.split(",");
        this.formData = res;
      }).catch(e => console.error(e)).finally(() => this.loading--);
    },
    saveUser() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        let copy = JSON.parse(JSON.stringify(this.formData));
        copy.roleIdList = copy.roleIdList.join(",");
        saveUser(copy).then(res => {
          this.$emit("refresh");
        }).catch(e => console.error(e)).finally(() => this.loading--);
      }).catch(e => console.error(e));
    },
    closeDialog() {
      this.dialogName = '';
    }
  }
};
</script>

<style scoped>

</style>
