<template>
  <div class="app-container">

    <el-row :gutter="40" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
          </div>
          <dictionaryIndex @cellClick="cellClick"></dictionaryIndex>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
          </div>
          <dictionaryItemIndex :dictionaryId="dictionaryId"></dictionaryItemIndex>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import dictionaryItemIndex from './dictionaryItemIndex';
import dictionaryIndex from './dictionaryIndex';

export default {
  components: {
    dictionaryIndex,
    dictionaryItemIndex,
  },
  data() {
    return {
      dictionaryId: '',
    };
  },
  computed: {
  },
  methods: {
    cellClick(data) {
      this.dictionaryId = data.id;
    }
  }
};
</script>

<style scoped>

</style>
