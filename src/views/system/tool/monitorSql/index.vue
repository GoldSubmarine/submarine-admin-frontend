<template>
  <div :style="'height:' + height">
    <iframe
      :src="$store.getters.api.sqlApi"
      frameborder="no"
      style="width: 100%;height: 100%"
      scrolling="auto"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: document.documentElement.clientHeight - 50 + 'px;',
      loading: true
    }
  },
  mounted: function() {
    window.onresize = () => {
      this.height = document.documentElement.clientHeight - 50 + 'px;'
    }
  }
}
</script>
