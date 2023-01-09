import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserNameKey = 'USER-NAME'
const UserAvatarKey = 'USER-AVATAR'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserName(name) {
  localStorage.setItem(UserNameKey, name)
}

export function getUserName() {
  return localStorage.getItem(UserNameKey)
}

export function setUserAvatar(val) {
  localStorage.setItem(UserAvatarKey, val)
}

export function getUserAvatar() {
  return localStorage.getItem(UserAvatarKey)
}
