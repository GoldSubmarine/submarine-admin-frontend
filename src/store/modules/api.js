const baseUrl = process.env.VUE_APP_BASE_API
const socketPort = process.env.VUE_APP_SOCKET_PORT
const api = {
  state: {
    // Sql 监控
    sqlApi: baseUrl + '/druid',
    // socket
    socketPort: socketPort,
    // 文件上传
    fileUploadApi: baseUrl + '/file/upload',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
