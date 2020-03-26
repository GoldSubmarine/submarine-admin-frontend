<template>
  <div v-loading="loading" class="role-permission-select">
    <el-card shadow="never">
      <div slot="header">
        <span style="font-weight: bold;font-size: 16px;">权限分配</span>
        <el-button :disabled="!id" style="float: right; padding: 6px 20px" type="primary" @click="save">保存</el-button>
      </div>
      <el-tree
        ref="tree"
        :data="treeData"
        :props="{ label: 'name' }"
        node-key="id"
        :check-strictly="true"
        :expand-on-click-node="false"
        default-expand-all
        :show-checkbox="true"
      >
        <span slot-scope="{ node, data }" class="tree-node">
          <span style="margin-left: 10px;">{{ data.name }}</span>
        </span>
      </el-tree>
    </el-card>

  </div>
</template>

<script>
import { getPermissionTree } from '@/api/permission'
import { getRoleDetail, saveRolePermission } from '@/api/role'
// import { getLeafFromList } from '@/utils/tree'
export default {
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: 0,
      treeData: []
    }
  },
  watch: {
    id: function(val) {
      if (val) {
        this.getRoleDetail()
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    }
  },
  mounted() {
    this.getPermissionTree()
  },
  methods: {
    getRoleDetail() {
      this.loading++
      getRoleDetail(this.id).then(res => {
        const setIds = res.permissionList.map(item => item.id)
        this.$refs.tree.setCheckedKeys(setIds)
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getPermissionTree() {
      this.loading++
      getPermissionTree().then(res => {
        this.treeData = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    save() {
      this.loading++
      const nodeList = this.$refs.tree.getCheckedNodes()
      const idList = nodeList.filter(item => item.value).map(item => item.id)
      saveRolePermission(this.id, 'button', idList).then(res => {
        this.$message.success(res.msg)
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
</script>

<style lang="scss">
.role-permission-select {
  font-size: 14px;
  .el-card__body{
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>
