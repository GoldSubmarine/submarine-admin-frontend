const getters = {
  sidebar: state => state.app.sidebar,
  user: state => state.user,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userId: state => state.user.id,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  routes: state => state.permission.routes

}
export default getters
