<template>
  <div class="app-container" style="width: 700px;" v-loading="loading">
    <el-tree
      :data="treeData"
      :expand-on-click-node="false"
      default-expand-all
      :show-checkbox="false">
      <span class="tree-node" slot-scope="{ node, data }">
        <span style="margin-left: 10px;">{{ data.name }}</span>
        <span>
          <span style="color: #8492a6;">{{ data.value }}</span>
          <span>
            <el-button type="text" size="mini" @click="operate('add', data)" v-if="checkPermission(['menu', 'menu.add'])"> 添加子节点 </el-button>
            <el-button type="text" size="mini" @click="operate('edit', data)" v-if="checkPermission(['menu', 'menu.edit'])"> 编辑 </el-button>
            <el-button type="text" size="mini" @click="del(data)" v-if="checkPermission(['menu', 'menu.del'])"> 删除 </el-button>
            <el-button type="text" size="mini" @click="operate('detail', data)" v-if="checkPermission(['menu', 'menu.find'])"> 详情 </el-button>
          </span>
        </span>
      </span>
    </el-tree>

    <dForm :mode="mode" :id="propId" @refresh="getMenuTree" @close="closeDialog" v-if="dialogName == 'dForm'"></dForm>
  </div>
</template>

<script>
import { getMenuDetail, getMenuTree, saveMenu, deleteMenu } from '@/api/menu';
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
    this.getMenuTree();
  },
  methods: {
    getMenuTree() {
      this.loading++;
      getMenuTree().then(res => {
        this.treeData = res;
      }).catch(e => console.log(e)).finally(() => this.loading--);
    },
    operate(mode, data) {
      this.propId = data.id;
      this.mode = mode;
      this.dialogName = 'dForm';
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++;
        deleteMenu(data.id).then(res => {
          this.$message.success("删除成功");
          this.getMenuTree();
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
  & > span:nth-of-type(2) {
    display: inline-block;
    width: 400px;
    span{
      display: inline-block;
      width: 50%;
    }
  }
}
</style>
