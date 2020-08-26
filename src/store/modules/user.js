import { login, logout, getInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import defaultAvatar from '@/assets/avatar/avatar.png'

const state = {
  id: '',
  deptId: '',
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  permissions: [],
  menus: [],
  isSuperAdmin: false,
  isAdmin: false
}

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_DEPTID: (state, deptId) => {
    state.deptId = deptId
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar ?? defaultAvatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_IS_SUPER_ADMIN: (state, isSuperAdmin) => {
    state.isSuperAdmin = isSuperAdmin
  },
  SET_IS_ADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  },
  RESET: (state) => {
    for (const key in state) {
      if (state[key] instanceof Array) {
        state[key] = []
        continue
      }
      if (typeof state[key] === 'string') {
        state[key] = ''
        continue
      }
      if (typeof state[key] === 'number') {
        state[key] = 0
        continue
      }
      if (state[key] instanceof Object) {
        state[key] = {}
        continue
      }
    }
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        commit('SET_TOKEN', res.data)
        setToken(res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        if (!response) {
          reject('没有获取到用户信息，请重新登录')
        }

        const { id, deptId, superAdmin, admin, username, avatar, roles, permissionList } = response
        const permissions = []
        const menus = []
        permissionList.forEach(item => {
          if (item.type === 'button') permissions.push(item.value)
          if (item.type === 'menu') menus.push(item.value)
        })
        response.permissions = permissions
        response.menus = menus
        commit('SET_ID', id)
        commit('SET_DEPTID', deptId)
        commit('SET_IS_SUPER_ADMIN', superAdmin)
        commit('SET_IS_ADMIN', admin)
        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_MENUS', menus)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('RESET')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('RESET')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

