<template>
  <div v-loading="loading" class="role-permission-select">
    <el-card shadow="never">
      <div slot="header">
        <span style="font-weight: bold;font-size: 16px;">权限分配</span>
        <el-button v-show="!isBatchAuth" :disabled="!id" style="float: right; padding: 6px 20px" type="primary" @click="save">保存</el-button>
        <el-button v-show="isBatchAuth" :disabled="!id" style="float: right; padding: 6px 20px" type="success" @click="save('auth')">批量授权</el-button>
        <el-button v-show="isBatchAuth" :disabled="!id" style="float: right; padding: 6px 20px" type="danger" @click="save('revoke')">撤销授权</el-button>
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
        <span slot-scope="{ data }" class="tree-node">
          <span style="margin-left: 10px;">{{ data.name }}</span>
        </span>
      </el-tree>
    </el-card>

  </div>
</template>

<script>
import { getPermissionTree } from '@/api/permission'
import { getRoleDetail, saveRolePermission, saveRolePermissionBatch } from '@/api/role'
// import { getLeafFromList } from '@/utils/tree'
export default {
  props: {
    id: { // 批量模式下，为逗号分隔的id
      type: String,
      default: null
    },
    isBatchAuth: {
      type: Boolean,
      default: false
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
      if (!this.isBatchAuth) {
        if (val) {
          this.getRoleDetail()
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      }
    },
    isBatchAuth: function(val) {
      this.$refs.tree.setCheckedKeys([])
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
    save(batchAuthType) {
      this.loading++
      const nodeList = this.$refs.tree.getCheckedNodes()
      const idList = nodeList.map(item => item.id)
      if (this.isBatchAuth) {
        saveRolePermissionBatch(batchAuthType, this.id, idList).then(res => {
          this.$message.success(res.msg)
        }).catch(e => console.log(e)).finally(() => this.loading--)
      } else {
        saveRolePermission(this.id, idList).then(res => {
          this.$message.success(res.msg)
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }
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
