import { getDictionaryList } from '@/api/dictionary'

const state = {
  dic: {}
}

const mutations = {
  SET_DIC: (state, dic) => {
    state.dic = dic
  }
}

const actions = {
  loadDic({ commit }) {
    return new Promise(resolve => {
      getDictionaryList().then(res => {
        const obj = {}
        res.forEach(item => {
          obj[item.name] = item.dictionaryItemList
        })
        commit('SET_DIC', obj)
        resolve(obj)
      }).catch(e => console.log(e))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
