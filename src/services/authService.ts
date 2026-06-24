import api from './api'

export const registerUser = (data: any) => {
  return api.post('/register', data)
}

export const loginUser = (data: any) => {
  return api.post('/login', data)
}

export const getUser = () => {
  return api.get('/profile')
}

export const logoutUser = () => {
  return api.post('/logout')
}
