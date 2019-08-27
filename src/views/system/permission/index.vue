<template>
  <div class="app-container" v-loading="loading">
    <el-tree
      :data="treeData"
      :expand-on-click-node="false"
      default-expand-all
      :show-checkbox="true">
      <span class="tree-node" slot-scope="{ node, data }">
        <span style="display: inline-block; margin-left: 10px;">{{ data.name }}</span>
        <span style="color: #8492a6;">{{ data.value }}</span>
        <span>
          <el-button type="text" size="mini" @click="add(data)"> 添加子节点 </el-button>
          <el-button type="text" size="mini" @click="edit(data)"> 编辑 </el-button>
          <el-button type="text" size="mini" @click="del(data)"> 删除 </el-button>
        </span>
      </span>
    </el-tree>

    <dForm :mode="mode" :id="propId" @refresh="getPermissionTree" @close="closeDialog" v-if="dialogName == 'dForm'"></dForm>
  </div>
</template>

<script>
import { getPermissionDetail, getPermissionTree, savePermission, deletePermission } from '@/api/permission';
import dForm from './form';
export default {
  components: {
    dForm
  },
  data() {
    return {
      loading: 0,
      dialogName: '',
      mode: 'add',
      propId: '',
      treeData: [],
    };
  },
  mounted() {
    this.getPermissionTree();
  },
  methods: {
    getPermissionTree() {
      this.loading++;
      getPermissionTree().then(res => {
        this.treeData = res;
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    add(data) {
      this.propId = data.id;
      this.mode = 'add';
      this.dialogName = 'dForm';
    },
    edit(data) {
      this.propId = data.id;
      this.mode = 'edit';
      this.dialogName = 'dForm';
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++;
        deletePermission(data.id).then(res => {
          this.$message.success("删除成功");
          this.getPermissionTree();
        }).catch(e => console.log(e)).finally(() => this.loading--);
      }).catch(e => console.log(e))
    },
    closeDialog() {
      this.dialogName = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
