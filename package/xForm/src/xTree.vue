<template>
  <el-select
    v-model="formData"
    :disabled="config.disabled"
    :multiple="config.multiple"
    :placeholder="config.placeholder"
    :clearable="config.clearable"
    :collapse-tags="config.collapseTags"
    filterable
    @visible-change="handleOptionHidden"
    :size="config.size">
    <el-option value="" style="display: none;"></el-option>
    <el-option
      style="display: none;"
      v-for="(item, itemIndex) in options"
      :key="itemIndex"
      :label="item[getTreeProps.label]"
      :value="item[getNodekey]"></el-option>
    <el-tree
      ref="tree"
      :data="treeData"
      :node-key="getNodekey"
      :show-checkbox="config.multiple"
      :default-expand-all="computeBoolen(config.defaultExpandAll, true)"
      :expand-on-click-node="false"
      :default-checked-keys="config.multiple ? [config.formData] : config.formData"
      @check="handleCheckChange"
      @node-click="handleNodeClick"
      :props="getTreeProps">
      <template class="tree-node" slot-scope="{ node, data }">
        <span style="margin-left: 10px;font-size: 14px;">{{ data[getTreeProps.label] }}</span>
      </template>
    </el-tree>
  </el-select>

  <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree> -->
</template>

<script>
// {
//   disabled: false,
//   multiple: true,
//   tree: {
//     data: [],
//     nodeKey: "id",
//     defaultExpandAll: true,
//     props: {
//       label: "name",
//       children: "children",
//     }
//   }
// }
import mixinComponent from "../../common/xMixin";
export default {
  name: "xTree",
  mixins: [mixinComponent()],
  data() {
    return {
      options: [],
      treeData: []
    };
  },
  mounted() {

  },
  methods: {
    // 单选时
    handleNodeClick(data) {
      if(!this.config.multiple) {
        this.formData = data[this.getNodekey];
        this.$nextTick().then(() => this.updateOptions())
      }
    },
    // 多选时
    handleCheckChange() {
      if(this.config.multiple) {
        this.formData = this.$refs.tree.getCheckedKeys();
      } else {
        this.formData = this.$refs.tree.getCheckedKeys()[0];
      }
      this.updateOptions();
    },
    updateOptions() {
      this.options = this.$refs.tree.getCheckedNodes();
    },
    // disableAllTree() {
    //   disableArray(this.treeData, true);
    // },
    // enableAllTree() {
    //   disableArray(this.treeData, false);
    // },
    // // 递归
    // disableArray(arr, isDisabled) {
    //   arr.forEach(item => {
    //     item['disabled'] = isDisabled;
    //     let children = item[this.getTreeProps.children];
    //     if(children) disableArray(children, isDisabled);
    //   });
    // },
    handleOptionHidden(val) {
      if(val) {
        let data = this.config.multiple ? this.formData : [this.formData];
        this.$refs.tree.setCheckedKeys(data);
      }
    }
  },
  computed: {
    getNodekey() {
      if(this.config.tree.nodeKey) {
        return this.config.tree.nodeKey;
      }
      return "id";
    },
    getTreeProps() {
      let props = this.config.tree.props;
      let defaultProps = {
        children: "children",
        label: "label"
      };
      if(props instanceof Object) {
        if(props.label) defaultProps.label = props.label;
        if(props.children) defaultProps.children = props.children;
      }
      return defaultProps;
    },
  },
  watch: {
    // remove tag时同步tree
    // default-checked-keys 只在 第一次赋值时有效，所以不需要immediate，也不用担心后续formData的变动
    formData: function(val) {
      let data = this.config.multiple ? val : [val];
      this.$refs.tree.setCheckedKeys(data);
    },
    // 初始化时父级的tree可能没有数据，所以要watch
    config: {
      handler: function(val) {
        this.$nextTick().then(() => {
          this.updateOptions();
        })
        let tree = this.config.tree;
        if(tree instanceof Array) {
          this.treeData = tree;
        } else if(tree instanceof Object) {
          this.treeData = tree.data;
        }
      },
      deep: true
    }
  }
};
</script>

