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
import { getLeafFromList } from '@/utils/tree'
export default {
  props: {
    mode: { // permission, menu
      type: String,
      required: true
    },
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
    if (this.mode === 'permission') {
      this.getPermissionTree()
    } else if (this.mode === 'menu') {
      this.getMenuTree()
    }
  },
  methods: {
    getRoleDetail() {
      this.loading++
      getRoleDetail(this.id).then(res => {
        let setIds = []
        if (this.mode === 'permission') {
          setIds = res.permissionList.map(item => item.id)
          this.$refs.tree.setCheckedKeys(setIds)
        } else if (this.mode === 'menu') {
          setIds = getLeafFromList(res.menuList).map(item => item.id)
          // 只设置叶子节点
          this.$refs.tree.setCheckedKeys(setIds)
        }
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getPermissionTree() {
      this.loading++
      getPermissionTree({ type: 'button' }).then(res => {
        this.treeData = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    getMenuTree() {
      this.loading++
      getPermissionTree({ type: 'menu' }).then(res => {
        this.treeData = res
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    save() {
      let promise = null
      this.loading++
      if (this.mode === 'permission') {
        // 具体模块可以有code，但大的模块不能有code
        const nodeList = this.$refs.tree.getCheckedNodes()
        const idList = nodeList.filter(item => item.value).map(item => item.id)
        promise = saveRolePermission(this.id, 'button', idList)
      } else if (this.mode === 'menu') {
        // 保存选中节点和半开节点，设置时只设置叶子节点
        const nodeList = this.$refs.tree.getCheckedNodes(false, true)
        const idList = nodeList.filter(item => item.value).map(item => item.id)
        promise = saveRolePermission(this.id, 'menu', idList)
      }
      promise.then(res => {
        this.$message.success(res.msg)
      }).catch(e => console.log(e)).finally(() => this.loading--)
    }
  }
}
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
