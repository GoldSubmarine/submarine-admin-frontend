<template>
  <div v-loading="loading" style="font-size: 14px;">
    <el-card shadow="never">
      <div slot="header">
        <span style="font-weight: bold;font-size: 16px;">{{ mode == 'permission' ? '权限' : '菜单' }}</span>
        <el-button :disabled="!id" style="float: right; padding: 6px 20px" type="success" @click="save">保存</el-button>
      </div>
      <el-tree
        ref="tree"
        :data="treeData"
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :show-checkbox="true">
        <span class="tree-node" slot-scope="{ node, data }">
          <span style="margin-left: 10px;">{{ data.name }}</span>
        </span>
      </el-tree>
    </el-card>

  </div>
</template>

<script>
import { getPermissionTree, } from '@/api/permission';
import { getMenuTree, } from '@/api/menu';
import { getRoleDetail, saveRolePermission, saveRoleMenu } from '@/api/role';
import { getLeafFromList } from '@/utils/tree';
export default {
  props: ['mode', 'id'], // permission, menu
  data() {
    return {
      loading: 0,
      treeData: [],
    };
  },
  mounted() {
    if(this.mode == 'permission') {
      this.getPermissionTree();
    } else if(this.mode == 'menu') {
      this.getMenuTree();
    }
  },
  methods: {
    getRoleDetail(){
      this.loading++;
      getRoleDetail(this.id).then(res => {
        let setIds = [];
        if(this.mode == 'permission') {
          setIds = res.permissionList.map(item => item.id);
          this.$refs.tree.setCheckedKeys(setIds);
        } else if(this.mode == 'menu') {
          setIds = getLeafFromList(res.menuList).map(item => item.id);
          // 只设置叶子节点
          this.$refs.tree.setCheckedKeys(setIds);
        }
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    getPermissionTree() {
      this.loading++;
      getPermissionTree().then(res => {
        this.treeData = res;
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    getMenuTree() {
      this.loading++;
      getMenuTree().then(res => {
        this.treeData = res;
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    save() {
      let promise = null;
      this.loading++;
      if(this.mode == 'permission') {
        // 具体模块可以有code，但大的模块不能有code
        let nodeList = this.$refs.tree.getCheckedNodes();
        let idList = nodeList.filter(item => item.value).map(item => item.id);
        promise = saveRolePermission(this.id, idList);
      } else if(this.mode == 'menu') {
        // 保存选中节点和半开节点，设置时只设置叶子节点
        let nodeList = this.$refs.tree.getCheckedNodes(false, true);
        let idList = nodeList.filter(item => item.value).map(item => item.id);
        promise = saveRoleMenu(this.id, idList);
      }
      promise.then(res => {
        this.$message.success("保存成功");
      }).catch(e => console.log(e)).finally(() => this.loading--);
    }
  },
  watch: {
    id: function(val) {
      if(val) {
        this.getRoleDetail();
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// .tree-node {
//   flex: 1;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   font-size: 14px;
//   padding-right: 8px;
//   & > span:nth-of-type(2) {
//     display: inline-block;
//     width: 400px;
//     span{
//       display: inline-block;
//       width: 50%;
//     }
//   }
// }
</style>
