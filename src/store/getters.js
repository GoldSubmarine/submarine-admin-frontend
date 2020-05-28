const getters = {
  sidebar: state => state.app.sidebar,
  user: state => state.user,
  device: state => state.app.device,
  // token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  routes: state => state.permission.routes,
  api: state => state.api,
  dic: state => state.dic.dic
}
export default getters
