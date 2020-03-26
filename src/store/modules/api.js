const baseUrl = process.env.VUE_APP_BASE_API
const api = {
  state: {
    // Sql 监控
    sqlApi: baseUrl + '/druid',
    // 文件上传
    fileUploadApi: baseUrl + '/api/localStorage',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
