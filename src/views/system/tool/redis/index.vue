<template>
  <div>123</div>
</template>

<script>
import getSocket from '@/utils/socket'
export default {
  data() {
    return {
      socket: undefined
    }
  },
  mounted() {
    this.socket = getSocket(() => {
      this.socket.emit('/redis/list', 'sadf', 123)
    })
  }
}
</script>

<style>

</style>
