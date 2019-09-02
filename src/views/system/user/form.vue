<template>
  <div class="app-container">
    <el-dialog v-loading="loading" :title="dialogTitle" :visible.sync="dialogVisible" width="540px" :close-on-click-modal="false" @closed="$emit('close')">
      <x-form ref="xForm" :config="formConfig" v-model="formData" />
    </el-dialog>
  </div>
</template>

<script>
import { getUserDetail, saveUser } from '@/api/user';
import { getDeptTree } from '@/api/dept';
import { getRoleList } from '@/api/role';
export default {
  props: ['mode', 'id'], // edit, detail, add
  data() {
    let _this = this;
    return {
      loading: 0,
      dialogVisible: true,
      formData: {
        status: 'enable'
      },
      formDisabled: false,
      dialogTitle: "编辑",
      showBtn: true,
      treeData: [],
      roleData: [],
    };
  },
  mounted() {
    this.getDeptTree();
    this.getRoleList();
  },
  computed: {
    formConfig() {
      let _this = this;
      return {
        disabled: _this.formDisabled,
        inline: false,
        items: [
          { type: "text", name: "username", label: '登录名', rules: _this.importRules("inputRequired") },
          { type: "text", name: "name", label: '姓名', rules: _this.importRules("inputRequired") },
          { type: "tree", name: "deptId", label: '部门',  tree: { data: _this.treeData, props: {label: 'name'} }, rules: _this.importRules("inputRequired") },
          { type: "select", name: "roleIdList", label: '角色', multiple: true, dic: { data: _this.roleData, label: 'name', value: "id" }, rules: _this.importRules("inputRequired") },
          { type: "text", name: "phone", label: '手机号', rules: _this.importRules("inputRequired", "phone") },
          { type: "text", name: "email", label: '邮箱', rules: _this.importRules("email") },
          { type: "select", name: "sex", label: '性别', dic: _this.importDic("sex"), rules: _this.importRules("selectRequired") },
          // { type: "text", name: "avatar", label: '头像', rules: _this.importRules("inputRequired") },
          { type: "select", name: "status", label: '状态', dic: _this.importDic("userStatus"), rules: _this.importRules("selectRequired") },
          { type: "text", name: "address", label: '地址', },
          { type: "text", name: "password", label: '密码', },
          { type: "text", name: "remark", label: '备注', },
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
    getDeptTree() {
      this.loading++;
      getDeptTree().then(res => {
        this.treeData = res;
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    getRoleList() {
      this.loading++;
      getRoleList().then(res => {
        this.roleData = res;
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    saveUser() {
      this.$refs['xForm'].validate().then(() => {
        this.loading++;
        let copy = JSON.parse(JSON.stringify(this.formData));
        copy.roleIdList = copy.roleIdList.join(",");
        saveUser(copy).then(res => {
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
          this.getUserDetail();
        }
        if(this.mode == 'detail') {
          this.dialogTitle = "详情";
          this.getUserDetail();
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
