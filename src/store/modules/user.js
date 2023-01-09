import { login, loginByLdap, logout } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  setUserName,
  getUserName,
  setUserAvatar,
  getUserAvatar
} from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: getUserName(),
  avatar: getUserAvatar()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        setToken(data.token)
        setUserName(data.name)
        setUserAvatar(data.avatar)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login
  loginByLdap({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginByLdap({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        setToken(data.token)
        setUserName(data.name)
        setUserAvatar(data.avatar)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')

        localStorage.clear()

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
      commit('SET_TOKEN', '')
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
