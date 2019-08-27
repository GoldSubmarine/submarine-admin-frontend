<template>
  <div class="app-container" style="width: 700px;" v-loading="loading">
    <el-tree
      :data="treeData"
      :expand-on-click-node="false"
      default-expand-all
      :show-checkbox="true">
      <span class="tree-node" slot-scope="{ node, data }">
        <span style="margin-left: 10px;">{{ data.name }}</span>
        <span>
          <span style="color: #8492a6;">{{ data.code }}</span>
          <span>
            <el-button type="text" size="mini" @click="operate('add', data)"> 添加子节点 </el-button>
            <el-button type="text" size="mini" @click="operate('edit', data)"> 编辑 </el-button>
            <el-button type="text" size="mini" @click="del(data)"> 删除 </el-button>
            <el-button type="text" size="mini" @click="operate('detail', data)"> 详情 </el-button>
          </span>
        </span>
      </span>
    </el-tree>

    <dForm :mode="mode" :id="propId" @refresh="getDeptTree" @close="closeDialog" v-if="dialogName == 'dForm'"></dForm>
  </div>
</template>

<script>
import { getDeptDetail, getDeptTree, saveDept, deleteDept } from '@/api/dept';
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
    this.getDeptTree();
  },
  methods: {
    getDeptTree() {
      this.loading++;
      getDeptTree().then(res => {
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
        deleteDept(data.id).then(res => {
          this.$message.success("删除成功");
          this.getDeptTree();
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
